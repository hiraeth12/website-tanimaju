import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";

// Tipe untuk data form produk
type ProductForm = {
  title: string;
  price: string;
  imageSrc: string | File | null;
  description: string;
  info: string;
  whatsappNumber: string;
};

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductForm>({
    title: "",
    price: "",
    imageSrc: null,
    description: "",
    info: "",
    whatsappNumber: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            ...data,
            price: String(data.price),
            imageSrc: null, // Reset for new file upload
          });
          setCurrentImageSrc(data.imageSrc || ''); // Keep current image for preview
        }
      })
      .catch((err) => console.error("Failed to fetch product:", err));
  }, [id, API_URL]);

  const handleChange = (field: keyof ProductForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Check if a new file was uploaded
      if (formData.imageSrc instanceof File) {
        // Use FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('imageSrc', formData.imageSrc);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('info', formData.info);
        formDataToSend.append('whatsappNumber', formData.whatsappNumber);

        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'PUT',
          body: formDataToSend,
        });

        if (response.ok) {
          alert('Produk berhasil diperbarui!');
          navigate('/admin/item');
        } else {
          alert('Gagal memperbarui produk!');
        }
      } else {
        // Use JSON for text-only updates
        const updateData = {
          title: formData.title,
          price: Number(formData.price),
          description: formData.description,
          info: formData.info,
          whatsappNumber: formData.whatsappNumber
        };

        const response = await fetch(`${API_URL}/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          alert('Produk berhasil diperbarui!');
          navigate('/admin/item');
        } else {
          alert('Gagal memperbarui produk!');
        }
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Terjadi kesalahan saat memperbarui produk!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, imageSrc: file }));
  };

  const handleDragOver = (event: React.DragEvent) => event.preventDefault();

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) setFormData((prev) => ({ ...prev, imageSrc: file }));
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="px-6 mt-2 mb-4 ml-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/admin/item" className="hover:underline hover:text-gray-800 transition">
            Produk
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-semibold text-gray-800">Edit</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6 ml-2">
        <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Produk</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="info">Informasi Lengkap</Label>
              <Textarea
                id="info"
                value={formData.info}
                onChange={(e) => handleChange("info", e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Nomor WhatsApp</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSrc">Gambar Produk</Label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="imageSrc"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <label htmlFor="imageSrc" className="cursor-pointer">
                  <div className="text-gray-500">
                    <p>
                      Drag & Drop atau {" "}
                      <span className="text-blue-600 font-semibold">Browse</span>
                    </p>
                  </div>
                </label>
                
                {/* Display current image if no new file selected */}
                {!formData.imageSrc && currentImageSrc && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                    <img
                      src={currentImageSrc.startsWith('/uploads') ? `${API_URL.replace('/api', '')}${currentImageSrc}` : currentImageSrc}
                      alt="Current product"
                      className="w-32 h-32 object-cover mx-auto rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/product-placeholder-5.jpg';
                      }}
                    />
                  </div>
                )}
                
                {/* Display preview of new uploaded file */}
                {formData.imageSrc instanceof File && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Gambar baru:</p>
                    <img
                      src={URL.createObjectURL(formData.imageSrc)}
                      alt="New preview"
                      className="w-32 h-32 object-cover mx-auto rounded"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      {formData.imageSrc.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-6"
            onClick={handleSubmit}
          >
            Simpan Perubahan
          </Button>
          <Link to="/admin/item">
            <Button variant="outline" className="px-6">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
