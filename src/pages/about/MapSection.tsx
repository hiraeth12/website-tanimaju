import { useRef, useEffect } from "react";
import mapboxgl, { Marker } from "mapbox-gl"; // Impor Marker
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.error(
        "Error: Mapbox token is not provided. Please check your .env file."
      );
      if (mapContainer.current) {
        mapContainer.current.innerHTML =
          '<div class="flex items-center justify-center h-full bg-red-100 text-red-700">Mapbox token is missing.</div>';
      }
      return;
    }

    // Guard untuk memastikan container sudah siap
    if (!mapContainer.current) return;

    // Inisialisasi peta
    const map = new mapboxgl.Map({
      accessToken: MAPBOX_TOKEN,
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [107.75, -7.04], // Koordinat sekitar Bandung Selatan
      zoom: 12,
    });

    map.on("load", () => {

      map.resize();
    });

    new Marker({ color: "#16A34A" })
      .setLngLat([107.75, -7.04])
      .addTo(map);

    return () => map.remove();
  }, []); 

  return (
    <div
      ref={mapContainer}
      className="w-full h-[400px] md:h-[500px] rounded-2xl shadow-md bg-gray-200"
    />
  );
};

export default MapSection;