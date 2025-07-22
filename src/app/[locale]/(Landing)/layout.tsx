import "../globals.css";
import { HeroHeader } from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="w-full">
        <HeroHeader />
        <div className="px-4">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
