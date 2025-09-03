import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { InputField } from "@/components/InputField";
import { SelectField } from "@/components/SelectField";
import ImageUpload from "@/components/ImageUpload";
import { FormActions } from "@/components/FormActions";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BlogPost = {
  _id: string;
  title: string;
  category: string;
  date: string;
  image: string | File | null;
  author: string;
  authorImage: string | File | null;
  content: string;
  tags: string[];
};

export default function EditPostsPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal fetch blog");
        return res.json();
      })
      .then((data) => {
        setPost({
          _id: data._id,
          title: data.title || "",
          category: data.category || "",
          date: data.date || "",
          image: data.image || null,
          author: data.author || "",
          authorImage: data.authorImage || null,
          content: data.content || "",
          tags: data.tags || [],
        });
      })
      .catch((err) => console.error("Gagal memuat produk:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!post) return;
    try {
      const form = new FormData();
      form.append("title", post.title);
      form.append("category", post.category);
      form.append("date", post.date);
      form.append("author", post.author);
      form.append("content", post.content);
      form.append("tags", JSON.stringify(post.tags));

      if (post.image instanceof File) {
        form.append("image", post.image);
      }

      if (post.authorImage instanceof File) {
        form.append("authorImage", post.authorImage);
      }

      const res = await fetch(`${API}/posts/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Gagal update post");

      alert("Post berhasil diperbarui!");
      navigate("/admin/posts");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update post");
    }
  };

  if (loading || !post) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Memuat data blog...</div>
      </DashboardLayout>
    );
  }

  const handleChange = (
    field: keyof BlogPost,
    value: string | File | null | string[]
  ) => {
    setPost((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Blog", to: "/admin/posts" }, { label: "Edit" }]}
      />

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom kiri */}
          <div className="space-y-6">
            <InputField
              id="title"
              label="Judul"
              value={post.title}
              onChange={(value) => handleChange("title", value)}
            />

            <SelectField
              id="category"
              label="Kategori"
              required
              value={post.category}
              placeholder="Pilih kategori"
              options={[
                { value: "News", label: "News" },
                { value: "Recipe", label: "Recipe" },
              ]}
              onChange={(v: string) => handleChange("category", v)}
            />

            <InputField
              id="date"
              label="Tanggal"
              type="date"
              value={post.date}
              onChange={(value) => handleChange("date", value)}
            />

            <InputField
              id="tags"
              label="Tags"
              value={post.tags.join(", ")}
              onChange={(value) => handleChange("tags", value.split(", "))}
            />

            <InputField
              id="author"
              label="Penulis"
              value={post.author}
              onChange={(value) => handleChange("author", value)}
            />
          </div>

          {/* Kolom kanan */}

          <div className="space-y-2">
            <Label htmlFor="content">Konten</Label>
            <Textarea
              id="content"
              value={post.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="min-h-[160px] resize-none"
            />
          </div>
          <ImageUpload
            _id="image"
            label="Gambar Blog"
            value={post.image}
            onChange={(file) => handleChange("image", file)}
          />

          <ImageUpload
            _id="authorImage"
            label="Gambar Penulis"
            value={post.authorImage}
            onChange={(file) => handleChange("authorImage", file)}
          />
        </div>

        {/* Tombol aksi (disabled untuk preview) */}
        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin/posts")}
          submitLabel="Simpan Perubahan"
          cancelLabel="Batal"
        />
      </div>
    </DashboardLayout>
  );
}
