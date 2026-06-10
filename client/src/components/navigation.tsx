import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Stethoscope } from "lucide-react";

export function Navigation() {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" }}
              >
                <Stethoscope className="text-white h-4 w-4" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">
                GoldRock <span className="text-gold">Health</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Home
            </Link>
            <div className="relative group">
              <Link href="/training" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Training
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-popover rounded-xl shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <Link href="/training" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Patient Cases</div>
                      <div className="text-sm text-muted-foreground">Interactive simulations</div>
                    </div>
                  </Link>
                  <Link href="/image-analysis" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <i className="fas fa-x-ray text-muted-foreground text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Image Analysis</div>
                      <div className="text-sm text-muted-foreground">X-ray, CT, MRI training</div>
                    </div>
                  </Link>
                  <Link href="/board-exam-prep" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-muted-foreground text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Board Exams</div>
                      <div className="text-sm text-muted-foreground">USMLE & specialty prep</div>
                    </div>
                  </Link>
                  <Link href="/clinical-decision-trees" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <i className="fas fa-sitemap text-muted-foreground text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Decision Trees</div>
                      <div className="text-sm text-muted-foreground">Clinical algorithms</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/progress" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Progress
            </Link>
            <Button asChild className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-medium hover:shadow-md transition-all duration-300">
              <Link href="/training">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
