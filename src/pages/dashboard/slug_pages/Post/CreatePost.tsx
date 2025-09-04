// File: src/pages/dashboard/slug_pages/Post/CreatePost.tsx

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";

// Tipe untuk data form post
type PostForm = {
  title: string;
  image: File | null;
  date: string;
  category: string;
  author: string;
  content: string[];
  tags: string[];
};

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    image: null,
    date: new Date().toISOString().split('T')[0], // Default today
    category: "",
    author: "",
    content: [""],
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fungsi generik untuk menangani perubahan pada input teks
  const handleChange = (field: keyof PostForm, value: string | string[]) => {
    if (field === 'image') return; // Handle files separately
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk handle upload file
  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  // Fungsi untuk handle drag over
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Fungsi untuk handle drop file untuk image
  const handleDropImage = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Fungsi untuk menambah tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // Fungsi untuk menghapus tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Fungsi untuk submit form
  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('content', JSON.stringify(formData.content));
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: formDataToSend, // Menggunakan FormData untuk upload file
      });

      if (response.ok) {
        alert('Post berhasil dibuat!');
        navigate('/admin/posts');
      } else {
        alert('Gagal membuat post!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Terjadi kesalahan saat membuat post!');
    }
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/admin/posts" className="hover:underline hover:text-gray-800 transition">
            Posts
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Create</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Post</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => handleChange("title", e.target.value)} 
                placeholder="Masukkan judul post"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input 
                id="category" 
                value={formData.category} 
                onChange={(e) => handleChange("category", e.target.value)} 
                placeholder="Masukkan kategori"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Penulis</Label>
              <Input 
                id="author" 
                value={formData.author} 
                onChange={(e) => handleChange("author", e.target.value)} 
                placeholder="Masukkan nama penulis"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input 
                id="date" 
                type="date"
                value={formData.date} 
                onChange={(e) => handleChange("date", e.target.value)} 
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Gambar Post</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400"
                onDragOver={handleDragOver}
                onDrop={handleDropImage}
              >
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
                <label htmlFor="image" className="cursor-pointer">
                  <div className="text-gray-500">
                    <p>
                      Drag & Drop atau{" "}
                      <span className="text-blue-600 font-semibold">
                        Browse
                      </span>
                    </p>
                  </div>
                </label>
                {formData.image && (
                  <p className="text-sm text-green-600 mt-2">
                    File dipilih: {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input 
                  id="tags" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Masukkan tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Tambah
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-2">
          <Label htmlFor="content">Konten</Label>
          <Textarea
            id="content"
            value={formData.content[0] || ""}
            onChange={(e) => handleChange("content", [e.target.value])}
            className="min-h-[200px] resize-none"
            placeholder="Masukkan konten post"
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            onClick={handleSubmit}
          >
            Create
          </Button>
          <Button 
            variant="outline" 
            className="px-6"
            onClick={() => {
              handleSubmit();
              // Reset form untuk create another
              setFormData({
                title: "",
                image: null,
                date: new Date().toISOString().split('T')[0],
                category: "",
                author: "",
                content: [""],
                tags: [],
              });
              setTagInput("");
            }}
          >
            Create & create another
          </Button>
          <Link to="/admin/posts">
            <Button variant="outline" className="px-6">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
