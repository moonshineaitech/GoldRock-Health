import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dna, FlaskConical, ArrowLeft } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/90 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to GoldRock
            </Button>
          </Link>
          <div className="h-6 w-px bg-cyan-500/30" />
          <Link href="/lunafold">
            <div className="flex items-center gap-2 cursor-pointer">
              <Dna className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                LunaFold
              </span>
            </div>
          </Link>
        </div>
        
        <nav className="flex items-center gap-3">
          <Link href="/lunafold">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10">
              <Dna className="w-4 h-4 mr-2" />
              Structure
            </Button>
          </Link>
          <Link href="/lunafold-lab">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10">
              <FlaskConical className="w-4 h-4 mr-2" />
              Virtual Lab
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
