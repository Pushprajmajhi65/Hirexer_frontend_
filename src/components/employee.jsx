import remove from "../images/Commonimg/remove.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NavBar } from "./UserOverview";
export const Employee = () => {
  return (
    <div className="flex w-screen h-screen gap-8 bg-backgroundGray max-sm:px-0 px-[40px] pb-[80px] items-center xl:p-0">
      <NavBar />
      <ManageEmployeeCard />
    </div>
  );
};

export const ManageEmployeeCard = () => {
  return (
    <div className="w-full max-w-[1100px] h-[755px] bg-white rounded-2xl px-6 py-6 flex flex-col gap-12">
      <div className="w-full h-[70px] border-b px-6 flex items-center">
        <div>
          <h1 className="font-semibold text-textBlack text-[20px]">
            Manage Employee
          </h1>
          <p className="text-[14px] text-textSecondary font-normal">
            Manage teams and members.
          </p>
        </div>
        <Dialog>
          <DialogTrigger className="ml-auto border w-[101px] h-[40px] rounded-xl bg-buttonGreen text-white">
            Invite
          </DialogTrigger>
          <InviteUserCard />
        </Dialog>
      </div>
      <div>
        <input
          className="border w-[320px] h-11 rounded-xl p-6"
          placeholder="Search for"
        />
      </div>
      <div className="overflow-scroll rounded-md whitespace-nowrap no-scrollbar">
        <div className="flex items-center border-t h-11 bg-backGroundCardGrayLight w-[1100px]">
          <h2 className="text-center min-w-14 h-fit text-headerGray2 text-[15px] font-medium">
            SN
          </h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[296px]">
            Member Name
          </h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[122px]">
            Join Date
          </h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[122px]">
            DOB
          </h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[117px]">
            Type
          </h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[122px]">
            Ph.Number
          </h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[100px]">
            Status
          </h2>
          <h2 className="h-fit text-headerGray2 text-[15px] font-medium px-6 min-w-[64px]">
            Action
          </h2>
        </div>
        <EmployeeTable />
        <EmployeeTable />
        <EmployeeTable />
        <EmployeeTable />
        <EmployeeTable />
        <EmployeeTable />
      </div>
    </div>
  );
};

export const EmployeeTable = () => {
  return (
    <div>
      <div className="flex items-center w-[1100px] h-[72px] border-t border-b">
        <h2 className="text-center w-14 h-fit text-textBlack text-[15px] font-medium">
          1
        </h2>
        <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[296px] flex gap-[12px] items-center">
          <div className="w-10 h-10 border rounded-full"></div>
          <div>
            <p>Aalok Shah</p>
            <p className="text-xs text-textSecondary">
              aalok.shah@zstudioo.com
            </p>
          </div>
        </h2>
        <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[122px]">
          Jan 1,2022
        </h2>
        <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[122px]">
          Jan 1,2022
        </h2>
        <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[117px]">
          Full Time
        </h2>
        <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[122px]">
          9860123456
        </h2>
        <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[100px]">
          <p className="py-1 px-[6px] rounded-xl border w-fit text-xs font-medium">
            Active
          </p>
        </h2>
        <h2 className="h-fit text-textBlack text-[14px] font-normal px-6 w-[full]">
          <Dialog>
            <DialogTrigger>
              <img src={remove} className="w-10 h-10" />
            </DialogTrigger>
            <DeleteUser />
          </Dialog>
        </h2>
      </div>
    </div>
  );
};
export const InviteUserCard = () => {
  return (
    <DialogContent className="h-auto w-[459px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <div className="border rounded-full w-[48px] h-[48px]"></div>
          <h1 className="font-semibold text-[20px]">Invite Members</h1>
          <p className="text-[14px] w-full text-center text-textSecondary">
            Invite new members to your workspace and begin collaborating.
          </p>
        </div>
        <div className="flex flex-col gap-[12px]">
          <h1>Email address</h1>
          <input
            className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
            placeholder="hirexer@gmail.com"
          />
          <input
            className="w-full border h-[44px] rounded-xl p-2 font-normal text-[16px]"
            placeholder="hirexer@gmail.com"
          />
        </div>
        <p className="text-[14px] font-semibold text-textSecondary">
          Add another
        </p>
        <div className="flex justify-center gap-4">
          <button className="border w-[170px] h-[44px] rounded-xl bg-white text-textBlack">
            Cancel
          </button>
          <button className="border w-[170px] h-[44px] rounded-xl bg-buttonGreen text-white">
            Send Invites
          </button>
        </div>
      </div>
    </DialogContent>
  );
};
export const DeleteUser = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};
