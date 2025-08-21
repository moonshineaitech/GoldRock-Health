import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { AchievementSystem } from "@/components/achievement-system";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Navigation />
      <HeroSection />
      <StatisticsDashboard />
      <AchievementSystem />
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <i className="fas fa-stethoscope text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold">MedTrainer AI</span>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Advanced medical education platform powered by AI, designed for the next generation of healthcare professionals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <i className="fab fa-github text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="/training" className="hover:text-white transition-colors">Training Cases</a></li>
                <li><a href="#progress" className="hover:text-white transition-colors">Progress Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Voice Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-300">
            <p>&copy; 2024 MedTrainer AI. All rights reserved. Built for the future of medical education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
