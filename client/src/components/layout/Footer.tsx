import { Dna, ExternalLink, Shield, FileText, Mail, HelpCircle } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-cyan-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
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

        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
          <Link href="/privacy-policy">
            <a className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition-colors" data-testid="footer-link-privacy">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </a>
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/terms-of-service">
            <a className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition-colors" data-testid="footer-link-terms">
              <FileText className="w-4 h-4" />
              Terms of Service
            </a>
          </Link>
          <span className="text-gray-600">•</span>
          <Link href="/support">
            <a className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition-colors" data-testid="footer-link-support">
              <HelpCircle className="w-4 h-4" />
              Support
            </a>
          </Link>
          <span className="text-gray-600">•</span>
          <a 
            href="mailto:contact@goldrock.ai" 
            className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
            data-testid="footer-link-email"
          >
            <Mail className="w-4 h-4" />
            Contact
          </a>
        </div>
        
        <div className="pt-4 border-t border-cyan-500/10 text-center text-xs text-gray-500">
          <p>Educational use only. Not for clinical diagnosis or treatment decisions.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Eldest AI LLC (DBA GoldRock AI). All rights reserved.</p>
          <p className="mt-1 text-gray-600">State of Incorporation: Colorado, USA</p>
        </div>
      </div>
    </footer>
  );
}
