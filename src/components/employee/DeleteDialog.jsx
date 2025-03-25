import { Button } from "../ui/button";
import {
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import crossImage from "../../assets/cross.png";

const DeleteDialog = ({ onClose }) => {
  const handleDelete = () => {};

  return (
    <div className="text-center flex items-center justify-center flex-col gap-3 p-4">
      <img src={crossImage} alt="cross image" className="h-[48px] w-[48px]" />
      <DialogTitle className="leading-7 pt-2">
        You're about to delete the member from this workspace
      </DialogTitle>
      <DialogDescription>
        You won't be able to undo this again
      </DialogDescription>
      <DialogFooter className="flex gap-2 w-full pt-3">
        <Button variant="outline" className="flex-1 border-figmaPrimary text-figmaPrimary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDelete} className="flex-1 bg-figmaPrimaryDark">
          Submit
        </Button>
      </DialogFooter>
    </div>
  );
};

export default DeleteDialog;
