import { Separator } from "@/components/ui/separator";
import SideBar from "../sidebar";
import Header from "../header";

export default function MainPage() {
  return (
    <div className="h-[100vh] p-[24px]">
      <div className="h-full border-gray-200 border rounded-xl">
        <Header/>
        <Separator />
        <div className="flex flex-row h-full p-[24px] gap-[24px] overflow-clip">
          <main className="flex-1 h-full w-full bg-gray-100 overflow-auto">
            hello world
          </main>

          {/* Sidebar */}
          <SideBar/>
        </div>
      </div>
    </div>
  );
}
