import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Medal, Clock, Mic, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AchievementSystem() {
  const { data: achievements } = useQuery({
    queryKey: ["/api/user-achievements"],
    retry: false,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Mock analytics data for display
  const analytics = {
    accuracy: 87,
    speed: 72,
    completion: 43,
    total: 67
  };

  const recentAchievements = [
    {
      title: "Cardiology Expert",
      description: "Completed 10 cardiology cases with 90%+ accuracy",
      icon: Medal,
      date: "2 days ago",
      featured: true
    },
    {
      title: "Speed Demon", 
      description: "Diagnosed 5 cases in under 15 minutes each",
      icon: Clock,
      date: "1 week ago",
      featured: false
    },
    {
      title: "Voice Master",
      description: "Completed 25 cases using voice interactions",
      icon: Mic,
      date: "2 weeks ago", 
      featured: false
    }
  ];

  return (
    <section id="progress" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Track Your Progress</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor your diagnostic skills development with comprehensive analytics and achievement tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-card rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <Target className="text-gold mr-3 h-5 w-5" />
              Learning Analytics
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Overall Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <motion.div 
                      className="h-2 rounded-full"
                      style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${analytics.accuracy}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <span className="font-semibold text-foreground">{analytics.accuracy}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Speed Improvement</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <motion.div 
                      className="bg-foreground h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${analytics.speed}%` }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                    />
                  </div>
                  <span className="font-semibold text-foreground">+{analytics.speed}%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Case Completion</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <motion.div 
                      className="bg-foreground h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(analytics.completion / analytics.total) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.9 }}
                    />
                  </div>
                  <span className="font-semibold text-foreground">{analytics.completion}/{analytics.total}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">Specialty Strengths</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">Cardiology</span>
                    <span className="text-foreground font-bold">94%</span>
                  </div>
                </div>
                <div className="bg-secondary rounded-lg p-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-medium">Neurology</span>
                    <span className="text-foreground font-bold">89%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievement Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground flex items-center">
              <Trophy className="text-gold mr-3 h-5 w-5" />
              Recent Achievements
            </h3>
            
            {recentAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
                className="luxury-card rounded-2xl p-4 transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-secondary"
                    style={achievement.featured ? { background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' } : undefined}
                  >
                    <achievement.icon className={`h-6 w-6 ${achievement.featured ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                    <p className="text-muted-foreground text-sm">{achievement.description}</p>
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">{achievement.date}</span>
                </div>
              </motion.div>
            ))}

            <div className="text-center pt-4">
              <Button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all duration-300">
                View All Achievements
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
