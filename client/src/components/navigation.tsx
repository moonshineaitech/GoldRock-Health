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
            <div className="relative group">
              <Link href="/training" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">
                Training
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <Link href="/training" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Patient Cases</div>
                      <div className="text-sm text-gray-500">Interactive simulations</div>
                    </div>
                  </Link>
                  <Link href="/image-analysis" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-x-ray text-purple-600 text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Image Analysis</div>
                      <div className="text-sm text-gray-500">X-ray, CT, MRI training</div>
                    </div>
                  </Link>
                  <Link href="/board-exam-prep" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-green-600 text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Board Exams</div>
                      <div className="text-sm text-gray-500">USMLE & specialty prep</div>
                    </div>
                  </Link>
                  <Link href="/clinical-decision-trees" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-sitemap text-orange-600 text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Decision Trees</div>
                      <div className="text-sm text-gray-500">Clinical algorithms</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/achievements" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">
              Progress
            </Link>
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
              <Link href="/training">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
