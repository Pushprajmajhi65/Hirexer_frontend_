import React from "react";
import { Calendar } from "@/components/ui/calendar";

export const DatePicker = ({ selected, onChange, placeholderText, className }) => {
  return (
    <Calendar
      selected={selected}
      onChange={onChange}
      placeholderText={placeholderText}
      className={className}
    />
  );
};