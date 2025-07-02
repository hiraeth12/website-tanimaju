import { Calendar } from "lucide-react";

export const TopBar = () => {
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 11) {
      return "Selamat pagi";
    } else if (currentHour < 15) {
      return "Selamat siang";
    } else if (currentHour < 19) {
      return "Selamat sore";
    } else {
      return "Selamat malam";
    }
  };

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    // <-- Beri tipe eksplisit
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", options);

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          {/* Menampilkan salam yang sudah dinamis */}
          <span className="text-sm font-bold block">
            🚀 {getGreeting()}, Tom!
          </span>
          {/* Menampilkan tanggal yang sudah dinamis */}
          <span className="text-xs block text-stone-500">{formattedDate}</span>
        </div>

        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          <Calendar className="w-4 h-4" />
          <span>Prev 6 Months</span>
        </button>
      </div>
    </div>
  );
};
