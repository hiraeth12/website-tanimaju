// backend/src/models/mysql/interfaces.ts

export interface Product {
  id?: number;
  title: string;
  price: number;
  imageSrc?: string | null;
  description?: string | null;
  info?: string | null;
  whatsappNumber?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Petani {
  id?: number;
  nama: string;
  alamat?: string | null;
  nomorKontak?: string | null;
  foto?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Post {
  id?: number;
  title: string;
  slug?: string;
  image?: string | null;
  date?: string;
  category?: string;
  author?: string;
  authorImage?: string | null;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Tag {
  id?: number;
  name: string;
  created_at?: Date;
}

export interface PostTag {
  id?: number;
  post_id: number;
  tag_id: number;
  created_at?: Date;
}

export interface PostWithTags extends Post {
  tags?: string[];
}

export interface Bibit {
  id?: number;
  nama: string;
  jenis?: string;
  harga?: number;
  stok?: number;
  deskripsi?: string;
  gambar?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Tanaman {
  id?: number;
  nama: string;
  pupuk?: string;
  musim_tanam?: string;
  waktu_panen?: string;
  deskripsi?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Panen {
  id?: number;
  petani_id?: number;
  tanaman_id?: number;
  jumlah?: number;
  satuan?: string;
  tanggal_panen?: string;
  kualitas?: 'A' | 'B' | 'C';
  harga_per_satuan?: number;
  total_nilai?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
