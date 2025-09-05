import { useEffect, useState } from "react";

export const StatCards = () => {
  const [productCount, setProductCount] = useState(0);
  const [petaniCount, setPetaniCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch produk
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProductCount(data.length));

    // Fetch petani
    fetch(`${API_URL}/petani`)
      .then((res) => res.json())
      .then((data) => setPetaniCount(data.length));

    // Fetch posts
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then((data) => setPostCount(data.length));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 w-full">
      <Card
        title="Jumlah Produk"
        value={productCount.toString()}
        trend="up"
        period="Per 365 Hari"
      />
      <Card
        title="Jumlah Petani"
        value={petaniCount.toString()}

        trend="up"
        period="Per 365 Hari"
      />
      <Card
        title="Jumlah Post"
        value={postCount.toString()}
        trend="up"
        period="Per 365 Hari"
      />
    </div>
  );
};

const Card = ({
  title,
  value,
  period,
}: {
  title: string;
  value: string;
  trend: "up" | "down";
  period: string;
}) => {
  return (
    <div className="p-4 rounded border border-stone-300 bg-white min-w-0">
      <div className="flex mb-4 lg:mb-8 items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-stone-500 mb-2 text-sm truncate">{title}</h3>
          <p className="text-2xl lg:text-3xl font-semibold break-words">{value}</p>
        </div>
      </div>

      <p className="text-xs text-stone-500 truncate">{period}</p>
    </div>
  );
};
