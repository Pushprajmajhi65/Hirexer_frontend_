import axios from "axios";
import { WEATHER_API_KEY } from "./config";
import { useQuery } from "@tanstack/react-query";

async function weatherAPI({ queryKey }) {
  const [, location] = queryKey;
  const response = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&aqi=no`
  );
  return response.data;
}

export function useWeatherAPI(location) {
  return useQuery({
    queryKey: ["weather", location],
    queryFn: weatherAPI,
    enabled: !!location,
  });
}
