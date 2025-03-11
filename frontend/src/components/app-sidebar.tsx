import * as React from "react";
import { Bold, Command, Italic, Underline } from "lucide-react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Slider } from "./ui/slider";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState<string>("");

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className=" min-h-[58px]">
        <h2>button</h2>
        <div className="flex gap-2 w-full">
          <Button
            size="custom"
            className="min-w-[70px] bg-blue-500 text-white hover:bg-blue-500 px-2 py-1">
            Save
          </Button>
          <Button size="custom" variant={"outline"} className="min-w-[70px]">
            Share
          </Button>
        </div>
        </div>
        {/* toggle groups */}
        <div className=" min-h-[58px]">
          <h2>Group</h2>
          <ToggleGroup
            type="single"
            value={activeItem}
            onValueChange={(value) => setActiveItem(value)}
            size="custom"
            className="w-full bg-gray-500 p-1 rounded-lg">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="strikethrough"
              aria-label="Toggle strikethrough">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {/* slider */}
        <div>
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
