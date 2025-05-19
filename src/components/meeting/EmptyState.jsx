import { CalendarX2 } from "lucide-react";

export const EmptyState = ({ message = "No meetings found" }) => (
  <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
    <div className="mb-4 p-4 bg-gray-100 rounded-full">
      <CalendarX2 size={48} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      {message}
    </h3>
    <p className="text-center text-sm text-gray-500 max-w-md">
      You currently have no meetings scheduled. You can create one by clicking the <strong>"Create Meeting"</strong> button above.
    </p>
  </div>
);