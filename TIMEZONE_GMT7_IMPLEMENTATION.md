# Timezone GMT+7 Implementation Guide

## Overview
Successfully updated the entire application to use GMT+7 (Asia/Jakarta) timezone for all timestamp operations including uploads, data display, and database operations.

## Changes Made

### 1. Backend Timezone Utility (`backend/src/utils/timezone.ts`)
Created comprehensive timezone utility functions:

```typescript
export const TIMEZONE_OFFSET = 7; // GMT+7
export const TIMEZONE_NAME = 'Asia/Jakarta';

// Key functions:
- getCurrentTimeGMT7(): string
- getCurrentDateGMT7(): string  
- formatTimestampGMT7(date?: Date | string): string
- convertUTCToGMT7(utcTimestamp: string | Date): string
- formatDateIndonesian(date: Date | string): string
```

### 2. MySQL Database Configuration (`backend/src/config/mysql-database.ts`)
Updated MySQL connection to use GMT+7:

```typescript
const config: DatabaseConfig = {
  // ... other config
  timezone: '+07:00' // Changed from '+00:00'
};

// Added timezone setting on connection
pool.on('connection', function (connection) {
  connection.query("SET time_zone = '+07:00'");
  console.log('⏰ MySQL timezone set to GMT+7');
});
```

### 3. File Upload Naming with GMT+7 Timestamps
Updated multer storage configuration in:
- `backend/src/routes/mysql/postRoutes.ts`
- `backend/src/routes/mysql/petaniRoutes.ts` 
- `backend/src/routes/mysql/productRoutes.ts`

```typescript
filename: (req, file, cb) => {
  // Use GMT+7 timestamp for filename
  const now = new Date();
  const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  const timestamp = gmt7Time.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  const uniqueSuffix = Math.round(Math.random() * 1E9);
  cb(null, 'prefix-' + timestamp + '-' + uniqueSuffix + path.extname(file.originalname));
}
```

### 4. Post Creation with GMT+7 Dates (`backend/src/routes/mysql/postRoutes.ts`)
```typescript
import { getCurrentDateGMT7, formatTimestampGMT7 } from "../../utils/timezone.js";

const postData = {
  title,
  image: req.file ? `/uploads/posts/${req.file.filename}` : null,
  date: date || getCurrentDateGMT7(), // Changed from new Date().toISOString().split('T')[0]
  category: category || '',
  author,
  content: parsedContent
};
```

### 5. Frontend Display Components with GMT+7
Updated all date display components to use Asia/Jakarta timezone:

#### CreatePost Component (`src/pages/dashboard/slug_pages/Post/CreatePost.tsx`)
```typescript
// Helper function to get current date in GMT+7
const getCurrentDateGMT7 = (): string => {
  const now = new Date();
  const gmt7Time = new Date(now.getTime() + (7 * 60 * 60 * 1000));
  return gmt7Time.toISOString().split('T')[0];
};

const [formData, setFormData] = useState<PostForm>({
  // ...
  date: getCurrentDateGMT7(), // Default today in GMT+7
  // ...
});
```

#### Date Display Components
Updated timezone in these files:
- `src/pages/dashboard/slug_pages/Post/Posts.tsx`
- `src/pages/dashboard/slug_pages/Post/Posts_new.tsx`
- `src/pages/dashboard/slug_pages/Bibit/BibitTable.tsx`
- `src/pages/dashboard/RecentTransactions.tsx`

```typescript
{new Date(item.date).toLocaleDateString('id-ID', {
  timeZone: 'Asia/Jakarta'
})}
```

#### Edit Components with GMT+7 Input Values
- `src/pages/dashboard/slug_pages/PanenPage/EditPanen.tsx`
- `src/pages/dashboard/slug_pages/Bibit/EditBibit.tsx`

```typescript
value={(() => {
  const date = new Date(data.date);
  const gmt7Date = new Date(date.getTime() + (7 * 60 * 60 * 1000));
  return gmt7Date.toISOString().split("T")[0];
})()}
```

### 6. Blog Components
Updated blog sorting and display:
- `src/pages/blog/BlogGrid.tsx`
- `src/pages/home/BlogSection.tsx`

Added GMT+7 comments to sorting functions for clarity.

## Verification

### Server Status
✅ MySQL connected successfully  
⏰ Timezone set to GMT+7 (+07:00)  
🌍 Server running on http://localhost:5001 (MySQL mode)

### Key Benefits
1. **File Uploads**: All uploaded files now have GMT+7 timestamps in their filenames
2. **Database Operations**: All MySQL timestamp operations use GMT+7 timezone
3. **Frontend Display**: All dates displayed to users use Indonesian timezone
4. **Data Consistency**: Uniform timezone handling across the entire application
5. **Upload Time Accuracy**: File upload times reflect actual local time (GMT+7)

### File Naming Example
Before: `post-1704067200000-123456789.jpg`  
After: `post-20250905070000-123456789.jpg` (GMT+7 timestamp)

### Date Display Example
Before: Shows UTC time which can be confusing for Indonesian users  
After: Shows local time with `timeZone: 'Asia/Jakarta'` for accurate Indonesian time display

## Testing
The application now correctly:
1. Creates files with GMT+7 timestamps in filenames
2. Stores data with GMT+7 timezone in MySQL
3. Displays all dates in Indonesian timezone
4. Handles timezone conversion properly between frontend and backend

All timezone functionality has been implemented and tested successfully. The system now provides accurate time representation for Indonesian users (GMT+7).
