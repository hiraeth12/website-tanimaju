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
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">
            🚀 {getGreeting()}, Tom!
          </span>
          <span className="text-xs block text-stone-500">{formattedDate}</span>
        </div>

        {/* Ganti button dengan logo */}
        <img
          src="/images/tnmj.png"
          alt="Logo Taman Maju Jaya"
          className="w-10 h-10 object-contain rounded"
        />
      </div>
    </div>
  );
};
