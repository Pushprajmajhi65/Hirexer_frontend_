import React from "react";
import { MapPin } from "lucide-react";
import useLocation from "@/utils/useLocation";
import useCurrentTime from "@/utils/useCurrentDateTime";
import { useWeatherAPI } from "@/services/useWeatherAPI";
import { useWorkspace } from "@/context/WorkspaceContext";
import useGreeting from "@/utils/greeting";

const Greetings = () => {
  const { location, isLoading } = useLocation();
  /*  console.log(location); */
  const currentDateTime = useCurrentTime();
  const greeting = useGreeting();

  const { data, isLoading: weatherDataLoading } = useWeatherAPI(
    location?.address
  );
  /*   console.log(data); */
  const { userName } = useWorkspace();

  return (
    <div className="bg-figmaBackground flex items-center justify-between rounded-xl p-2 md:p-6 w-full">
      <section className="">
        <h1 className="font-[600] text-xl md:text-[30px] text-primary/80">
          {greeting},
        </h1>
        <h2 className="font-[600] text-xl md:text-[30px] text-primary/80 capitalize">
          {userName}
        </h2>
      </section>

      <section className="flex justify-end flex-col">
        <section className="flex items-center justify-center gap-4">
          <h2 className="font-[600] text-lg md:text-[36px] text-primary/90">
            {weatherDataLoading
              ? "Loading"
              : data?.current?.temp_c
              ? `${data.current.temp_c}\u00B0`
              : ""}
          </h2>
          {data?.current?.condition?.icon && (
            <img src={data?.current?.condition?.icon} alt="weather icon" />
          )}
        </section>
        <div className="flex flex-col font-[600] text-[10px] md:text-[14px] text-primary/90">
          <p>{currentDateTime}</p>
          <span className="flex gap-1 justify-end">
            <MapPin />
            {isLoading ? "Fetching" : location?.address}
          </span>
        </div>
      </section>
    </div>
  );
};

export default Greetings;
