import { CalendarX2 } from "lucide-react";

export const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
    <CalendarX2 size={48} className="mb-4 text-gray-400" />
    <p className="text-lg font-medium">{message}</p>
  </div>
);