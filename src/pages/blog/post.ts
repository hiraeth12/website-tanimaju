// src/blog/post.ts

export interface Post {
  title: string;
  image: string;
  date: string;
  category?: string;
  content?: string[];
  tags?: string[];
}

export const blogPosts: Post[] = [
  {
    title: "Avocado Season is Here",
    image: "/images/blog-placeholder-1.jpg",
    date: "Nov 13, 2024",
    category: "News",
    content: [
      "Avocado season is upon us, bringing fresh flavors to your table.",
      "Discover tips on selecting the best avocados and recipes to try at home.",
    ],
    tags: ["Avocado", "Season", "Fruits"],
  },
  {
    title: "Tips For Your Herb Garden",
    image: "/images/about-placeholder-2.jpg",
    date: "Nov 13, 2024",
    category: "Recipes",
    content: [
      "Learn how to grow fresh herbs in your garden with these simple tips.",
      "Your kitchen will never be the same!",
    ],
    tags: ["Herbs", "Gardening"],
  },
  {
    title: "Creamy Pumpkin Soup",
    image: "/images/blog-placeholder-3.jpg",
    date: "Nov 13, 2024",
    category: "Recipes",
    content: [
      "Learn how to grow fresh herbs in your garden with these simple tips.",
      "Your kitchen will never be the same!",
    ],
    tags: ["Herbs", "Gardening"],
  }
];
