export type BlogPostType = {
  slug: string;
  title: string;
  date: string;
  author: string;
  categories: string[];
  tags: string[];
  content: string[];
  heroImages: {
    logo: string;
    images: string[];
    appScreenshot: string;
  };
};

const blogPosts: BlogPostType[] = [
  {
    slug: "aplikasi-tanimaju-dirilis",
    title: "Aplikasi TaniMaju Dirilis",
    date: "16 Oct 2024",
    author: "Desa Sukamaju",
    categories: ["Pertanian", "Teknologi & Inovasi"],
    tags: ["Pertanian", "Desa Sukamaju", "Website"],
    content: [
      "Pada hari ini, Desa Sukamaju menyambut peluncuran aplikasi TaniMaju...",
      "Aplikasi ini dikembangkan oleh tim dari SEA Lab Universitas Telkom..."
    ],
    heroImages: {
      logo: "/placeholder.svg",
      images: ["/placeholder.svg", "/placeholder.svg"],
      appScreenshot: "/placeholder.svg"
    }
  },
  // Tambah post lain di sini
];

export default blogPosts;
