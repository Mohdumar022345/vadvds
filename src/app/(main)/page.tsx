import ChatInputBox from "@/components/chat/ChatInputBox";
import Navbar from "@/components/Navbar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <div className="w-full block md:hidden">
        <Navbar />
      </div>
      <SidebarTrigger className="absolute left-2 top-2 z-50" />
      <ChatInputBox />
    </main>
  );
}
