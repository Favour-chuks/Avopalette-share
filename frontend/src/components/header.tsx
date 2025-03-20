import { Command } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

function Header() {
  return (
    <header className="flex flex-row h-16 shrink-0 gap-4 px-[24px]">
      <a
        href="#"
        className="w-fit h-full flex justify-center items-center ">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <Command className="size-4" />
        </div>
        <div className="h-fit text-left text-sm leading-tight">
          <span className="h-fit truncate font-medium">Acme Inc</span>
          <span className="h-fit truncate text-xs">Enterprise</span>
        </div>
      </a>
      <div className="w-full flex justify-end items-center gap-[6px] px-[48]">
        <Separator orientation="vertical" />
        <div className="flex-grow flex justify-center">
          <input
            type="text"
            defaultValue="Untitled-01"
            className="border border-transparent rounded px-2 py-1 text-center w-32 focus:border-[.5px] focus:border-gray-400"
            onClick={(e) => e.currentTarget.select()}
          />
        </div>
        
        <Separator orientation="vertical" />
        {/* this would be some type of small menu to be able to name the files and other stuff */}
        <Button
          size="custom"
          className="min-w-[70px] bg-blue-500 text-white hover:bg-blue-500 px-2 py-1">
          Save
        </Button>
        <Button size="custom" variant={"outline"} className="min-w-[70px]">
          Share
        </Button>
        <Button size="custom" variant="outline" className="min-w-[70px] border-dotted">
            <Command name="more-vertical" className="size-4" />
        </Button>
      </div>
    </header>
  );
}

export default Header;
