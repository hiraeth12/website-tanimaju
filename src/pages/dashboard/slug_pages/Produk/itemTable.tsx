// src/components/admin/ItemTable.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Copy, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Item = {
  id: string;
  imageSrc: string;
  title: string;
  price: number;
  description: string;
  whatsappNumber: string;
  average_rating?: number;
  total_ratings?: number;
};

type ItemTableProps = {
  productData: Item[];
  filteredData: Item[];
  selectedRows: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: string, checked: boolean) => void;
  formatRupiah: (value: number) => string;
  onDelete: (id: string) => void;
  onRatingUpdate?: (id: string, rating: number) => void;
};

// Rating Stars Component
const RatingStars: React.FC<{ 
  rating: number; 
  totalRatings?: number;
  onEdit?: () => void;
}> = ({ rating, totalRatings }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />;
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative w-4 h-4">
                <Star className="w-4 h-4 text-gray-300 absolute" />
                <div className="overflow-hidden absolute w-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            );
          } else {
            return <Star key={index} className="w-4 h-4 text-gray-300" />;
          }
        })}
      </div>
      <div className="flex flex-col ml-1">
        <span className="text-sm text-gray-800 font-medium">{rating.toFixed(1)}</span>
        {totalRatings !== undefined && totalRatings > 0 && (
          <span className="text-xs text-gray-500">({totalRatings})</span>
        )}
      </div>
    </div>
  );
};

const ItemTable: React.FC<ItemTableProps> = ({
  productData,
  filteredData,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  formatRupiah,
  onDelete,
}) => {
  const [editRatingDialog, setEditRatingDialog] = useState<{
    productId: string;
    currentRating: number;
  } | null>(null);
  const [newRating, setNewRating] = useState<string>("");

  const handleOpenEditRating = (productId: string, currentRating: number) => {
    setEditRatingDialog({ productId, currentRating });
    setNewRating(currentRating.toString());
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow key="header-row">
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedRows.length === productData.length &&
                  productData.length > 0
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
            </TableHead>
            {[
              "Gambar",
              "Nama Produk",
              "Harga",
              "Rating",
              "Deskripsi",
              "WhatsApp",
              "Aksi",
            ].map((header, index) => (
              <TableHead key={`header-${index}-${header}`} className="text-gray-700">
                <div className="flex items-center space-x-1">
                  <span>{header}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(item.id)}
                  onCheckedChange={(checked) =>
                    handleSelectRow(item.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <img
                  src={`${import.meta.env.VITE_API_URL_IMAGE}${item.imageSrc}`}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-md"
                />
              </TableCell>
              <TableCell className="font-medium text-gray-800">
                {item.title}
              </TableCell>
              <TableCell>{formatRupiah(item.price)}</TableCell>
              <TableCell>
                <RatingStars 
                  rating={item.average_rating || 0}
                  totalRatings={item.total_ratings}
                  onEdit={() => handleOpenEditRating(item.id, item.average_rating || 0)}
                />
              </TableCell>
              <TableCell className="max-w-xs truncate text-sm text-gray-600">
                {item.description}
              </TableCell>
              <TableCell className="flex items-center gap-2 text-sm text-gray-700">
                <span className="font-mono">{item.whatsappNumber}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(item.whatsappNumber);
                    alert("Nomor WhatsApp disalin!");
                  }}
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Edit clicked for item:", item.id);
                      window.location.href = `/admin/item/edit/${item.id}`;
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Rating Edit Dialog */}
      <Dialog open={!!editRatingDialog} onOpenChange={(open) => !open && setEditRatingDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Rating Produk</DialogTitle>
            <DialogDescription>
              Masukkan rating baru untuk produk ini (0-5)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="0.0 - 5.0"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Rating saat ini: {editRatingDialog?.currentRating.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditRatingDialog(null)}>
              Batal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemTable;
