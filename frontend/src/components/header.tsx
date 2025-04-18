import { Command } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SelectAspectRatio } from "./aspect-ratio-selector";
// import SaveButton from "./save-button";
import { useState } from "react";
// import { useExportCanvas } from "@/hooks/useexportcavas";
import { ArtComponentRef } from "../components/art-component"; // Update this path if needed
import { SaveDialogue, ShareDialogue } from "./dialoguebox";

interface HeaderProps {
  orientation: string; // Current orientation
  onAspectRatioChange: (aspectRatio: string) => void; // Callback to update orientation
  aspectRatios: { value: string; label: string }[]; // Predefined aspect ratios
  artComponentRef: React.RefObject<ArtComponentRef | null>;
}

//! there needs to be a way to save the files and a way to share them

function Header({
  onAspectRatioChange,
  aspectRatios,
  artComponentRef,
}: HeaderProps) {
  const [title, setTitle] = useState("Untitled-01");
  const [preview, setPreview] = useState<string | null>(null); // Preview image URL
  const [isDownloading, setIsDownloading] = useState(false); // Loading state
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const words = input.value.split(/\s+/).filter(Boolean);
    if (words.length > 10) {
      input.value = words.slice(0, 10).join(" ");
      setTitle(input.value);
    }
    input.style.width = `${Math.min(input.scrollWidth, 300)}px`;
    setTitle(input.value);
  };

  const handleSave = () => {
    if (!artComponentRef.current) return;
    artComponentRef.current.exportCanvas({
      title: title || "Untitled-01",
      description: description || "Preview of the captured component",
      keyword: keyword || "generative, pixel, wow",
      setIsDownloading,
      setPreview,
    });
  };

  return (
    <header className="flex flex-row h-16 shrink-0 gap-4 px-[24px]">
      <a href="#" className="w-fit h-full flex justify-center items-center ">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <Command className="size-4" />
        </div>
        <div className="h-fit text-left text-sm leading-tight">
          <span className="h-fit truncate font-medium">Acme Inc</span>
          <span className="h-fit truncate text-xs">Enterprise</span>
        </div>
      </a>
      <div className="w-full flex justify-end items-center gap-[6px] px-[48] ml-[18px]">
        <Separator orientation="vertical" />
        <div className="flex-grow flex justify-center">
          <input
            type="text"
            defaultValue="Untitled-01"
            className="border border-transparent rounded px-2 py-1 text-center w-auto max-w-[300px] focus:border-[.5px] focus:border-gray-400"
            onClick={(e) => e.currentTarget.select()}
            onInput={handleTitleChange}
          />
        </div>

        <Separator orientation="vertical" className="mr-6" />
        {/* this would be some type of small menu to be able to name the files and other stuff */}
        <SelectAspectRatio
          aspectRatio={aspectRatios}
          onSelect={onAspectRatioChange} // Notify parent about changes
        />

        <ShareDialogue>
          <Button
            onClick={() => console.log("this is the share button")}
            size="custom"
            variant={"outline"}
            className="min-w-[70px]">
            Share
          </Button>
        </ShareDialogue>

        <SaveDialogue>
          <Button
            onClick={handleSave}
            size="custom"
            variant={"outline"}
            className="min-w-[70px]">
            Save
          </Button>
        </SaveDialogue>
        {/* <SaveButton artComponentRef={artComponentRef} title={title} description="" keyword=""/> */}
        <Button
          size="custom"
          variant="outline"
          className="min-w-[70px] border-dotted">
          <Command name="more-vertical" className="size-4" />
        </Button>
      </div>
    </header>
  );
}

export default Header;
