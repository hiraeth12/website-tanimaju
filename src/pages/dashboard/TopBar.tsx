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
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("id-ID", options);

  return (
    <div className="border-b px-6 py-4 border-stone-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <span className="text-sm font-bold block truncate">
            🚀 {getGreeting()}, Tom!
          </span>
          <span className="text-xs block text-stone-500 truncate">{formattedDate}</span>
        </div>

        {/* Ganti button dengan logo */}
        <img
          src="/images/tnmj.png"
          alt="Logo Taman Maju Jaya"
          className="w-8 h-8 lg:w-10 lg:h-10 object-contain rounded flex-shrink-0"
        />
      </div>
    </div>
  );
};
