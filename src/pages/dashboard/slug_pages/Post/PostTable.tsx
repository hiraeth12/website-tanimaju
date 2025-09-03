// src/components/admin/BlogTable.tsx

import React from "react";
import { Link } from "react-router-dom";
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
import { ChevronDown } from "lucide-react";

type Blog = {
  _id: string;
  image: string;
  title: string;
  author: string;
  category: string;
  date: string;
  tags: string[];
};

type BlogTableProps = {
  blogData: Blog[];
  filteredData: Blog[];
  selectedRows: string[];
  handleSelectAll: (checked: boolean) => void;
  handleSelectRow: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
};

const BlogTable: React.FC<BlogTableProps> = ({
  blogData,
  filteredData,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
   onDelete,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedRows.length === blogData.length && blogData.length > 0
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
            </TableHead>
            {[
              "Gambar",
              "Judul",
              "Author",
              "Kategori",
              "Tanggal",
              "Tags",
              "Aksi",
            ].map((header) => (
              <TableHead key={header} className="text-gray-700">
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
            <TableRow key={item._id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(item._id)}
                  onCheckedChange={(checked) =>
                    handleSelectRow(item._id, checked as boolean)
                  }
                />
              </TableCell>

              <TableCell>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-md"
                />
              </TableCell>
              <TableCell className="text-gray-800">{item.title}</TableCell>
              <TableCell className="text-gray-800">{item.author}</TableCell>
              <TableCell className="text-gray-700">{item.category}</TableCell>
              <TableCell className="text-gray-600">{item.date}</TableCell>
              <TableCell className="text-gray-500">
                {item.tags.join(", ")}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link to={`/admin/posts/edit/${item._id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item._id)}>
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogTable;
