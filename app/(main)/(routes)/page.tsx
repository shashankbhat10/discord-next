import { ModeToggle } from "@/components/providers/mode-toggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl='/' />
      <ModeToggle />
    </div>
  );
}
