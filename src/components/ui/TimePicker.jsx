import React from "react";
import { TimeInput } from "@/components/ui/time-input";

export const TimePicker = ({ selected, onChange, placeholderText, className }) => {
  return (
    <TimeInput
      selected={selected}
      onChange={onChange}
      placeholderText={placeholderText}
      className={className}
    />
  );
};