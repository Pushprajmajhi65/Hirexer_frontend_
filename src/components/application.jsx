import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NavBar } from "./UserOverview";
import api from "@/api";

export const Applications = () => {
  return (
    <div className="flex w-screen h-screen gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] items-center xl:p-0">
      <NavBar />
      <ManageApplicationsCard />
    </div>
  );
};

export const ManageApplicationsCard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full max-w-[1100px] h-[755px] bg-white rounded-2xl px-6 py-6 flex flex-col gap-12">
      <div className="w-full h-[70px] border-b px-6 flex items-center">
        <div>
          <h1 className="font-semibold text-textBlack text-[20px]">Manage Applications</h1>
          <p className="text-[14px] text-textSecondary font-normal">Review and manage job applications.</p>
        </div>
      </div>
      <div>
        <input
          className="border w-[320px] h-11 rounded-xl p-6"
          placeholder="Search by name or email"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-scroll rounded-md whitespace-nowrap no-scrollbar">
        <div className="flex items-center border-t h-11 bg-backGroundCardGrayLight w-[1100px]">
          <h2 className="text-center min-w-14 h-fit text-headerGray2 text-[15px] font-medium">SN</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[296px]">Full Name</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[200px]">Email</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[150px]">Experience (Years)</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[150px]">Applied At</h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[120px]">CV</h2>
        </div>
        <ApplicationsTable searchQuery={searchQuery} />
      </div>
    </div>
  );
};

const ApplicationsTable = ({ searchQuery }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get(`/posts/${1}/applications/`);
        setApplications(response.data);
      } catch (error) {
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(
    (app) =>
      app.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p>Loading applications...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {filteredApplications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        filteredApplications.map((application, index) => (
          <div key={application.id} className="flex items-center w-[1100px] h-[72px] border-t border-b">
            <h2 className="text-center w-14 h-fit text-textBlack text-[15px] font-medium">{index + 1}</h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[296px]">{application.user.full_name}</h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[200px]">{application.email}</h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[150px]">{application.experience_level}</h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[150px]">
              {new Date(application.applied_at).toLocaleDateString()}
            </h2>
            <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[120px]">
              {application.cv ? (
                <a href={application.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View CV
                </a>
              ) : (
                "No CV"
              )}
            </h2>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationsTable;