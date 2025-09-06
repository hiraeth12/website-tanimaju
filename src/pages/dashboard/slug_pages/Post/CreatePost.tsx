// File: src/pages/dashboard/slug_pages/Blog/CreateBlogPage.tsx

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import ImageUpload from "@/components/ImageUpload";
import { FormActions } from "@/components/FormActions";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "@/context/NotificationContext";

type BlogForm = {
  title: string;
  image: File | null;
  date: string;
  category: string;
  author:string;
  authorImage: File | null;
  content: string;
  tags: string;
};

export default function CreatePostsPage() {
  const [formData, setFormData] = useState<BlogForm>({
    title: "",
    image: null,
    category: "News",
    date: "",
    author: "",
    authorImage: null,
    content: "",
    tags: "",
  });

  const handleChange = (field: keyof BlogForm, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const handleSubmit = async () => {
  try {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("category", formData.category);
    form.append("date", formData.date);
    form.append("author", formData.author);
    form.append("content", formData.content);

    // ubah tags string → JSON array string
    if (formData.tags) {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim());
      form.append("tags", JSON.stringify(tagsArray));
    }

    if (formData.image) {
      form.append("image", formData.image);
    }

    if (formData.authorImage) {
      form.append("authorImage", formData.authorImage);
    }

    const response = await fetch(`${API}/posts`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) throw new Error("Gagal membuat post");
    await response.json();
    
    addNotification({
      variant: "success", 
      title: "Berhasil!",
      message: "Data post berhasil disimpan!",
      duration: 4000,
    });
    navigate("/admin/posts");
  } catch (error) {
    console.error(error);
    addNotification({
      variant: "error",
      title: "Error!", 
      message: "Terjadi kesalahan saat menyimpan data post",
      duration: 5000,
    });
  }
};


  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Blog", to: "/admin/posts" }, { label: "Create" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Blog</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <InputField
              id="title"
              label="Judul"
              type="text"
              value={formData.title}
              onChange={(val) => handleChange("title", val)}
              required
            />

            <SelectField
              id="category"
              label="Kategori"
              required
              value={formData.category}
              placeholder="Pilih kategori"
              options={[
                { value: "News", label: "News" },
                { value: "Recipe", label: "Recipe" },
              ]}
              onChange={(val) => handleChange("category", val)}
            />

            <InputField
              id="date"
              label="Tanggal"
              type="date"
              value={formData.date}
              onChange={(val) => handleChange("date", val)}
              required
            />

            <InputField
              id="tags"
              label="Tag (pisahkan dengan koma)"
              type="text"
              value={formData.tags}
              onChange={(val) => handleChange("tags", val)}
              required
            />

            <InputField
              id="author"
              label="Penulis"
              type="text"
              value={formData.author}
              onChange={(val) => handleChange("author", val)}
              required
            />
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

            <ImageUpload
              _id="image"
              label="Gambar"
              value={formData.image}
              onChange={(file) => setFormData({ ...formData, image: file })}
            />

            <ImageUpload
              _id="authorImage"
              label="Gambar Penulis"
              value={formData.authorImage}
              onChange={(file) => setFormData({ ...formData, authorImage: file })}
            />
          </div>
        </div>

        {/* Tombol Aksi */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/posts")}
        />
      </div>
    </DashboardLayout>
  );
}
