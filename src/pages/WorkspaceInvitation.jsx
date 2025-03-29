import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import inbox from "../assets/inbox.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useInviteWorkspace } from "@/services/workspace";
import { getInitial } from "@/utils/getInitial";

const avatarColors = [
  { bg: "bg-red-500", chip: "bg-red-50" },
  { bg: "bg-blue-500", chip: "bg-blue-50" },
  { bg: "bg-green-500", chip: "bg-green-50" },
  { bg: "bg-yellow-500", chip: "bg-yellow-50" },
  { bg: "bg-purple-500", chip: "bg-purple-50" },
  { bg: "bg-pink-500", chip: "bg-pink-50" },
  { bg: "bg-indigo-500", chip: "bg-indigo-50" },
  { bg: "bg-orange-500", chip: "bg-orange-50" },
];

const getColors = (index) => {
  return avatarColors[index % avatarColors.length];
};

const WorkspaceInvitation = () => {
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const workspaceId = location.state?.id || "";
  // console.log(workspaceId);

  const mutation = useInviteWorkspace();

  const handleAddEmail = () => {
    if (email && email.includes("@")) {
      setEmailList([...emailList, email]);
      setEmail("");
    }
  };

  const handleRemoveEmail = (indexToRemove) => {
    setEmailList(emailList.filter((_, index) => index !== indexToRemove));
  };

  const handleSendInvitations = () => {
    /*  console.log("Sending invitations to:", emailList); */
    mutation.mutate(
      { emails: emailList, workspace_id: workspaceId },
      { onSuccess: () => navigate("/workspacesetupdone") }
    );
    setEmailList([]);
  };

  return (
    <div className="bg-figmaBackground min-h-screen px-4 xl:px-0">
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[780px] md:h-[640px] md:px-[48px] md:py-[64px]">
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <img
              src={inbox}
              alt="inbox image"
              className="h-24 bg-gray-100 p-4 rounded-full"
            />
            <h2 className="text-[32px] font-[700] text-primary/90">
              Invite members to workspace
            </h2>
            <section className="w-full space-y-3">
              <Label>Enter emails</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  disabled={mutation.isPending}
                  className="h-10 bg-gray-50"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddEmail();
                  }}
                  placeholder="Enter email address"
                />
                <Button
                  onClick={handleAddEmail}
                  variant="outline"
                  size="icon"
                  disabled={mutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Email List */}
              <div className="mt-4 flex flex-wrap gap-2">
                {emailList.map((email, index) => {
                  const colors = getColors(index);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 ${colors.chip} px-3 py-1.5 rounded-full`}
                    >
                      <Avatar className={`h-6 w-6 ${colors.bg}`}>
                        <AvatarFallback className=" text-sm">
                          {getInitial(email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{email}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveEmail(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  className="flex-1 font-semibold cursor-pointer"
                  onClick={handleSendInvitations}
                  disabled={emailList.length === 0 || mutation.isPending}
                >
                  Send Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/workspacesetupdone")}
                  className="flex-1 text-figmaPrimary border-figmaPrimary hover:bg-figmaBackground"
                >
                  Skip
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkspaceInvitation;
