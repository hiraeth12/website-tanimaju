// src/blog/post.ts

export interface Post {
  title: string;
  image: string;
  date: string;
  category?: string;
  content?: string[];
  tags?: string[];
  authorImage?: string; // tambahkan ini
}


export const blogPosts: Post[] = [
  {
    title: "Avocado Season is Here",
    image: "/images/blog/post-placeholder-1.jpg",
    date: "Nov 13, 2024",
    category: "News",
    authorImage: "/images/blog/profile-blog-1.jpg", // contoh path foto admin
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur maximus luctus. Nullam et nisi efficitur, maximus ipsum eu, tempor nisi. Phasellus tristique fringilla massa a rutrum. Nam et ipsum quis felis mattis tempus. Pellentesque pulvinar non magna et rhoncus. Mauris vel arcu varius, porta ante non, dictum tellus. Duis eget efficitur nisi.Pellentesque finibus ultricies nulla in congue. Ut laoreet, neque nec consectetur ultrices, risus justo vestibulum quam, quis scelerisque dolor nunc imperdiet dolor.", 
      "Suspendisse vitae neque eu massa finibus ornare. Nunc ac turpis vitae tellus maximus porta. Vivamus mauris ipsum, viverra vitae vulputate ut, vehicula sed leo. Maecenas in lacinia nulla. Nulla pharetra at nunc sed fermentum. Etiam eu hendrerit mi. Cras luctus erat odio, eget tempus quam auctor non. Donec vitae sapien sit amet nisi efficitur ultricies. Proin lobortis arcu quis arcu porta iaculis. Fusce tempus sed metus ut condimentum. Maecenas venenatis justo in ante vulputate, at malesuada est pellentesque. Donec lobortis porttitor ante, at viverra libero eleifend in.",
    ],
    tags: ["Avocado", "Season", "Fruits"],
  },
  {
    title: "Tips For Your Herb Garden",
    image: "/images/blog/post-placeholder-2.jpg",
    date: "Nov 13, 2024",
    category: "Recipes",
    authorImage: "/images/blog/profile-blog-1.jpg", // contoh path foto admin
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur maximus luctus. Nullam et nisi efficitur, maximus ipsum eu, tempor nisi. Phasellus tristique fringilla massa a rutrum. Nam et ipsum quis felis mattis tempus. Pellentesque pulvinar non magna et rhoncus. Mauris vel arcu varius, porta ante non, dictum tellus. Duis eget efficitur nisi.Pellentesque finibus ultricies nulla in congue. Ut laoreet, neque nec consectetur ultrices, risus justo vestibulum quam, quis scelerisque dolor nunc imperdiet dolor.", 
      "Suspendisse vitae neque eu massa finibus ornare. Nunc ac turpis vitae tellus maximus porta. Vivamus mauris ipsum, viverra vitae vulputate ut, vehicula sed leo. Maecenas in lacinia nulla. Nulla pharetra at nunc sed fermentum. Etiam eu hendrerit mi. Cras luctus erat odio, eget tempus quam auctor non. Donec vitae sapien sit amet nisi efficitur ultricies. Proin lobortis arcu quis arcu porta iaculis. Fusce tempus sed metus ut condimentum. Maecenas venenatis justo in ante vulputate, at malesuada est pellentesque. Donec lobortis porttitor ante, at viverra libero eleifend in.",
    ],
    tags: ["Herbs", "Gardening"],
  },
  {
    title: "Creamy Pumpkin Soup",
    image: "/images/blog/post-placeholder-3.jpg",
    date: "Nov 13, 2024",
    category: "Recipes",
    authorImage: "/images/blog/profile-blog-1.jpg", // contoh path foto admin
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur maximus luctus. Nullam et nisi efficitur, maximus ipsum eu, tempor nisi. Phasellus tristique fringilla massa a rutrum. Nam et ipsum quis felis mattis tempus. Pellentesque pulvinar non magna et rhoncus. Mauris vel arcu varius, porta ante non, dictum tellus. Duis eget efficitur nisi.Pellentesque finibus ultricies nulla in congue. Ut laoreet, neque nec consectetur ultrices, risus justo vestibulum quam, quis scelerisque dolor nunc imperdiet dolor.", 
      "Suspendisse vitae neque eu massa finibus ornare. Nunc ac turpis vitae tellus maximus porta. Vivamus mauris ipsum, viverra vitae vulputate ut, vehicula sed leo. Maecenas in lacinia nulla. Nulla pharetra at nunc sed fermentum. Etiam eu hendrerit mi. Cras luctus erat odio, eget tempus quam auctor non. Donec vitae sapien sit amet nisi efficitur ultricies. Proin lobortis arcu quis arcu porta iaculis. Fusce tempus sed metus ut condimentum. Maecenas venenatis justo in ante vulputate, at malesuada est pellentesque. Donec lobortis porttitor ante, at viverra libero eleifend in.",
    ],
    tags: ["Herbs", "Gardening"],
  },
  {
    title: "Ferrari Clowning Again !",
    image: "/images/blog/post-placeholder-4.jpg",
    date: "Nov 13, 2024",
    category: "News",
    authorImage: "/images/blog/profile-blog-1.jpg", // contoh path foto admin
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur maximus luctus. Nullam et nisi efficitur, maximus ipsum eu, tempor nisi. Phasellus tristique fringilla massa a rutrum. Nam et ipsum quis felis mattis tempus. Pellentesque pulvinar non magna et rhoncus. Mauris vel arcu varius, porta ante non, dictum tellus. Duis eget efficitur nisi.Pellentesque finibus ultricies nulla in congue. Ut laoreet, neque nec consectetur ultrices, risus justo vestibulum quam, quis scelerisque dolor nunc imperdiet dolor.", 
      "Suspendisse vitae neque eu massa finibus ornare. Nunc ac turpis vitae tellus maximus porta. Vivamus mauris ipsum, viverra vitae vulputate ut, vehicula sed leo. Maecenas in lacinia nulla. Nulla pharetra at nunc sed fermentum. Etiam eu hendrerit mi. Cras luctus erat odio, eget tempus quam auctor non. Donec vitae sapien sit amet nisi efficitur ultricies. Proin lobortis arcu quis arcu porta iaculis. Fusce tempus sed metus ut condimentum. Maecenas venenatis justo in ante vulputate, at malesuada est pellentesque. Donec lobortis porttitor ante, at viverra libero eleifend in.",
    ],
    tags: ["Herbs", "Gardening"],
  },
];
