import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogDemoProps {
 title: string; 
 previewImageUrl: string; 
  trigger: boolean; // Boolean to control whether the dialog is open
  onClose: () => void; // Callback to handle closing the dialog
}

export function DialogDemo({ trigger, onClose }: DialogDemoProps) {
  return (
    <Dialog open={trigger} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}