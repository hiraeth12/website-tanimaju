// File: src/pages/dashboard/slug_pages/Post/EditPost.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Link } from "react-router-dom";

// Tipe untuk data form post
type PostForm = {
  title: string;
  image: string | File | null;
  date: string;
  category: string;
  author: string;
  content: string[];
  tags: string[];
};

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PostForm>({
    title: "",
    image: null,
    date: "",
    category: "",
    author: "",
    content: [""],
    tags: [],
  });
  const [currentImage, setCurrentImage] = useState<string>('');
  const [tagInput, setTagInput] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            title: data.title || "",
            image: null, // Reset for new file upload
            date: data.date ? data.date.split('T')[0] : "",
            category: data.category || "",
            author: data.author || "",
            content: data.content || [""],
            tags: data.tags || [],
          });
          setCurrentImage(data.image || ''); // Keep current image for preview
        }
      })
      .catch((err) => console.error("Failed to fetch post:", err));
  }, [id, API_URL]);

  // Fungsi generik untuk menangani perubahan pada input
  const handleChange = (field: keyof PostForm, value: string | string[]) => {
    if (field === 'image') return; // Handle files separately
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk handle file upload
  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  // Fungsi untuk handle drag over
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Fungsi untuk handle drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileChange(file);
      } else {
        alert('Please select an image file');
      }
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

  const handleSubmit = async () => {
    try {
      // Check if a new file was uploaded
      if (formData.image instanceof File) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('content', JSON.stringify(formData.content));
        formDataToSend.append('tags', JSON.stringify(formData.tags));
        formDataToSend.append('image', formData.image);

        const response = await fetch(`${API_URL}/posts/${id}`, {
          method: 'PUT',
          body: formDataToSend,
        });

        if (response.ok) {
          alert('Post berhasil diperbarui!');
          navigate('/admin/posts');
        } else {
          alert('Gagal memperbarui post!');
        }
      } else {
        // Use JSON for text-only updates
        const updateData = {
          title: formData.title,
          date: formData.date,
          category: formData.category,
          author: formData.author,
          content: formData.content,
          tags: formData.tags
        };

        const response = await fetch(`${API_URL}/posts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          alert('Post berhasil diperbarui!');
          navigate('/admin/posts');
        } else {
          alert('Gagal memperbarui post!');
        }
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Terjadi kesalahan saat memperbarui post!');
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
          <span className="font-semibold text-gray-800">Edit</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
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
                onDrop={handleDrop}
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
                      Drag & Drop atau {" "}
                      <span className="text-blue-600 font-semibold">Browse</span>
                    </p>
                  </div>
                </label>
                
                {/* Display current image if no new file selected */}
                {!formData.image && currentImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                    <img
                      src={currentImage.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${currentImage}` : currentImage}
                      alt="Current post"
                      className="w-32 h-32 object-cover mx-auto rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/blog/blog-placeholder-1.jpg';
                      }}
                    />
                  </div>
                )}
                
                {/* Display preview of new uploaded file */}
                {formData.image instanceof File && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Gambar baru:</p>
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="New preview"
                      className="w-32 h-32 object-cover mx-auto rounded"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      {formData.image.name}
                    </p>
                  </div>
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
            Simpan Perubahan
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
