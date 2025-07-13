import "../globals.css";
import Navbar from "@/components/landing/Navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="w-full">
        <Navbar />
        <div className="px-4">{children}</div>
      </main>
    </div>
  );
}
