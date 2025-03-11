import { Command } from "lucide-react"

function Header() {
  return (
   <header className="flex flex-col h-16 shrink-0 justify-center gap-2">
          <div className="flex w-fit justify-center gap-2 px-[24px]">
          <a href="#" className="flex justify-center">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="h-fit text-left text-sm leading-tight">
                  <span className="h-fit truncate font-medium">Acme Inc</span>
                  <span className="h-fit truncate text-xs">Enterprise</span>
                </div>
              </a>
          </div>
        </header>
  )
}

export default Header