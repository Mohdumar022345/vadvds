import Link from "next/link";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { PenSquareIcon } from "lucide-react";

export default function Navbar() {
  return (
    <div className="fixed w-full flex items-center justify-between px-4 py-2 bg-white shadow-md">
      <SidebarTrigger />
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Reseach-o-Bot
      </span>
      <Button variant="ghost" size="icon">
        <Link href="/">
          <div className="flex text-base font-semibold items-center gap-2">
            <PenSquareIcon className="size-5" />
          </div>
        </Link>
      </Button>
    </div>
  );
}
