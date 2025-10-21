# Image Preloading Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx (Entry Point)                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  AppContent Component                                     │   │
│  │  - useAppPreload() hook initialized                       │   │
│  │  - Preloads critical images on mount                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              useAppPreload Hook (hooks/useAppPreload.tsx)        │
│                                                                   │
│  • Runs on app startup                                           │
│  • Defines critical images list                                  │
│  • Calls imagePreloader.preloadImages()                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│        ImagePreloader Singleton (utils/imagePreloader.ts)        │
│                                                                   │
│  ┌─────────────────┐    ┌──────────────────────────────────┐   │
│  │  Cache (Map)    │    │  Loading Promises (Map)          │   │
│  │  - Stores Image │    │  - Tracks in-progress loads      │   │
│  │    objects      │    │  - Prevents duplicate requests   │   │
│  └─────────────────┘    └──────────────────────────────────┘   │
│                                                                   │
│  Methods:                                                         │
│  • preloadImage(src)     - Load single image                     │
│  • preloadImages(arr)    - Load multiple images                  │
│  • isCached(src)         - Check if image cached                 │
│  • getCachedImage(src)   - Get cached image                      │
│  • clearCache()          - Clear all cached images               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Individual Page Components                   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Home.tsx    │  │ About.tsx    │  │  Blog.tsx    │  ...     │
│  │              │  │              │  │              │          │
│  │ • Sets title │  │ • Sets title │  │ • Sets title │          │
│  │ • Preloads   │  │ • Preloads   │  │              │          │
│  │   page imgs  │  │   page imgs  │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User visits site
      │
      ▼
App.tsx loads
      │
      ▼
useAppPreload() executes
      │
      ▼
Critical images queued for preload
      │
      ├─────> Image 1 ──┐
      ├─────> Image 2 ──┤
      ├─────> Image 3 ──┼─> imagePreloader.preloadImages()
      ├─────> Image 4 ──┤
      └─────> Image N ──┘
                │
                ▼
      For each image:
      1. Create new Image() object
      2. Set src = image path
      3. Wait for onload event
      4. Store in cache Map
      5. Resolve promise
                │
                ▼
      Images now cached in memory
                │
                ▼
User navigates to page
      │
      ▼
Page component mounts
      │
      ├─> Sets document.title
      │
      └─> Preloads page-specific images
                │
                ▼
      Check if image in cache
                │
         ┌──────┴──────┐
         │             │
      YES (cached)   NO (not cached)
         │             │
         │             └──> Preload & cache image
         │                       │
         └───────────────────────┘
                    │
                    ▼
      Image renders instantly from cache
```

## Page Title Flow

```
User navigates to page
         │
         ▼
Component mounts
         │
         ▼
useEffect(() => {
  document.title = "Title – TaniMaju"
}, [])
         │
         ▼
Browser tab title updates
         │
         ▼
User sees descriptive title
```

For dynamic titles (Blog posts, Products):

```
User navigates to /blog/slug-name
         │
         ▼
BlogPost component mounts
         │
         ▼
Fetch post data from API
         │
         ▼
Post data loaded into state
         │
         ▼
useEffect with [post] dependency
         │
         ▼
document.title = `${post.title} – TaniMaju`
         │
         ▼
Tab title shows actual post title
```
