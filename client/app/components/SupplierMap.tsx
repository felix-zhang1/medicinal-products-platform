import { useEffect, useRef } from "react";

export default function SupplierMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!window.google?.maps) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly`;
          s.async = true;
          s.defer = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("load maps failed"));
          document.head.appendChild(s);
        });
      }
      // @ts-ignore
      if (google.maps.importLibrary) await google.maps.importLibrary("maps");
      if (!ref.current) return;
      const center = { lat, lng };
      const map = new google.maps.Map(ref.current, { center, zoom: 14 });
      new google.maps.Marker({ position: center, map });
    })();
  }, [lat, lng]);

  return <div ref={ref} className="w-full h-64 rounded border" />;
}
