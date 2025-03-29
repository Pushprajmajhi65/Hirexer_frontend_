export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "submitted":
      return "bg-blue-100 text-blue-700";
    case "in review":
      return "bg-purple-100 text-purple-700";
    case "schedule meeting":
      return "bg-orange-100 text-orange-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "approved":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "active":
      return "bg-teal-100 text-teal-700";
    case "inactive":
      return "bg-gray-300 text-gray-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
