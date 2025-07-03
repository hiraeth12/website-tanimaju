import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type BlogCategory = "News" | "Recipes";

type BlogPost = {
  id: string;
  title: string;
  category: BlogCategory;
  date: string;
  image: string;
  author: string;
  content: string;
  tags: string[];
};

export default function EditPostsPage() {
  const { id } = useParams(); // ambil blog id dari URL
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetch("/data/post.json")
      .then((res) => res.json())
      .then((data) => {
        const withId: BlogPost[] = data.map(
          (item: Omit<BlogPost, "id">, index: number) => ({
            ...item,
            id: `blog-${index + 1}`,
          })
        );
        const found = withId.find((p) => p.id === id); // aman sekarang

        if (found) setPost(found);
      })
      .catch((err) => console.error("Failed to load post:", err));
  }, [id]);

  if (!post) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Memuat data post...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            to="/admin/posts"
            className="hover:underline hover:text-gray-800"
          >
            Blog
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Edit</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom kiri */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={post.title} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={post.category} disabled>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Recipes">Recipes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Input type="date" value={post.date} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <Input value={post.tags.join(", ")} readOnly />
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Konten</Label>
              <Textarea value={post.content} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Gambar</Label>
              <img
                src={post.image}
                alt="Preview"
                className="w-64 h-auto rounded border"
              />
            </div>
          </div>
        </div>

        {/* Tombol aksi (disabled untuk preview) */}
        <div className="flex gap-4 pt-6 border-t">
          <Button className="bg-gray-500 cursor-not-allowed" disabled>
            Update (preview)
          </Button>
          <Link to="/admin/posts">
            <Button variant="outline">Kembali</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
