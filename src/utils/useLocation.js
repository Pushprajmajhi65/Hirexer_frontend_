import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useLocation() {
  const [location, setLocation] = useState({ lat: null, lon: null, address: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        setIsLoading(false);
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        setLocation((prev) => ({ ...prev, lat: latitude, lon: longitude }));

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
         /*  console.log(response) */
          setLocation((prev) => ({
            ...prev,
            address: response.data.address.city || "Address not found",
          }));
        } catch (err) {
          /* console.error(err); */
          toast.error("Failed to fetch address.");
        }
      } catch (err) {
        toast.error("Unable to retrieve your location.");
        /* console.error(err); */
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { location, isLoading };
}