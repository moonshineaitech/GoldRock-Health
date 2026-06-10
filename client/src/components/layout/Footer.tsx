import { Dna, ExternalLink, Shield, FileText, Mail, HelpCircle } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-white/10 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Dna className="w-5 h-5 text-gold" />
            <span className="text-lg font-bold font-serif luxury-text-gradient">
              LunaFold
            </span>
            <span className="text-white/40 text-sm">by GoldRock Health</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a 
              href="https://alphafold.ebi.ac.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gold flex items-center gap-1 transition-colors"
            >
              AlphaFold DB
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://www.uniprot.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-gold flex items-center gap-1 transition-colors"
            >
              UniProt
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-white/40">
              Powered by 200M+ pre-computed structures
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm">
          <Link href="/privacy-policy">
            <a className="flex items-center gap-1.5 text-white/60 hover:text-gold transition-colors" data-testid="footer-link-privacy">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </a>
          </Link>
          <span className="text-white/30">•</span>
          <Link href="/terms-of-service">
            <a className="flex items-center gap-1.5 text-white/60 hover:text-gold transition-colors" data-testid="footer-link-terms">
              <FileText className="w-4 h-4" />
              Terms of Service
            </a>
          </Link>
          <span className="text-white/30">•</span>
          <Link href="/support">
            <a className="flex items-center gap-1.5 text-white/60 hover:text-gold transition-colors" data-testid="footer-link-support">
              <HelpCircle className="w-4 h-4" />
              Support
            </a>
          </Link>
          <span className="text-white/30">•</span>
          <a 
            href="mailto:contact@goldrock.ai" 
            className="flex items-center gap-1.5 text-white/60 hover:text-gold transition-colors"
            data-testid="footer-link-email"
          >
            <Mail className="w-4 h-4" />
            Contact
          </a>
        </div>
        
        <div className="pt-4 border-t border-white/10 text-center text-xs text-white/45">
          <p>Educational use only. Not for clinical diagnosis or treatment decisions.</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} GoldRock Health by Eldest AI LLC. All rights reserved.</p>
          <p className="mt-1 text-white/35">State of Incorporation: Colorado, USA</p>
        </div>
      </div>
    </footer>
  );
}
