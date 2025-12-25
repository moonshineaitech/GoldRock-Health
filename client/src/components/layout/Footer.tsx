import { Dna, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-cyan-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-cyan-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              LunaFold
            </span>
            <span className="text-gray-500 text-sm">by GoldRock Health</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a 
              href="https://alphafold.ebi.ac.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              AlphaFold DB
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://www.uniprot.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              UniProt
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-gray-500">
              Powered by 200M+ pre-computed structures
            </span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-cyan-500/10 text-center text-xs text-gray-500">
          <p>Educational use only. Not for clinical diagnosis or treatment decisions.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Eldest AI LLC dba GoldRock AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
