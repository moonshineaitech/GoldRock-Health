import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";

export function Navigation() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="text-white h-4 w-4" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MedTrainer AI
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/training" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">
              Training
            </Link>
            <a href="#progress" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">
              Progress
            </a>
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
              <Link href="/training">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
