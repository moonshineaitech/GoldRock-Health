import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dna, FlaskConical, ArrowLeft } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to GoldRock
            </Button>
          </Link>
          <div className="h-6 w-px bg-white/15" />
          <Link href="/lunafold">
            <div className="flex items-center gap-2 cursor-pointer">
              <Dna className="w-6 h-6 text-gold" />
              <span className="text-xl font-bold font-serif luxury-text-gradient">
                LunaFold
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex items-center gap-3">
          <Link href="/lunafold">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-gold hover:bg-white/5">
              <Dna className="w-4 h-4 mr-2" />
              Structure
            </Button>
          </Link>
          <Link href="/lunafold-lab">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-gold hover:bg-white/5">
              <FlaskConical className="w-4 h-4 mr-2" />
              Virtual Lab
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
