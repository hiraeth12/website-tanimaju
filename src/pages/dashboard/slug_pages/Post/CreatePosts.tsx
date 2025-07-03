// File: src/pages/dashboard/slug_pages/Blog/CreateBlogPage.tsx

import type React from "react";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Tipe untuk kategori yang diizinkan
type BlogCategory = "News" | "Recipes";

// Tipe untuk data form blog
type BlogForm = {
  title: string;
  category: BlogCategory; // <-- Perubahan: Menggunakan tipe spesifik
  date: string;
  image: File | null;
  content: string;
  tags: string;
};

export default function CreatePostsPage() {
  const [formData, setFormData] = useState<BlogForm>({
    title: "",
    category: "News", // Nilai awal harus salah satu dari tipe BlogCategory
    date: "",
    image: null,
    content: "",
    tags: "",
  });

  // Tipe `value` sekarang lebih aman berkat inferensi dari `field`
  const handleChange = (field: keyof BlogForm, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleChange("image", file);
  };

  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) handleChange("image", file);
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link
            to="/admin/posts"
            className="hover:underline hover:text-gray-800 transition"
          >
            Blog
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Create</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Blog</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                // Perubahan: Menggunakan `value` untuk komponen terkontrol
                value={formData.category}
                onValueChange={(value: BlogCategory) => handleChange("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Recipes">Recipes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tag (pisahkan dengan koma)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content">Konten</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="min-h-[160px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Gambar</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label htmlFor="image" className="cursor-pointer text-gray-600">
                  Drag & Drop atau{" "}
                  <span className="text-blue-600 font-semibold">Browse</span>
                </label>
                {formData.image && (
                  <p className="mt-2 text-sm text-gray-600">
                    Gambar terpilih: {formData.image.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 pt-6 border-t">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6">
            Create
          </Button>
          <Button variant="outline" className="px-6">
            Create & create another
          </Button>
          <Button variant="outline" className="px-6">
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}