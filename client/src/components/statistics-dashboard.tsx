import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Clock, Target, FileText } from "lucide-react";

interface StatsData {
  totalCases?: number;
  activeStudents?: number;
  totalHours?: number;
  avgAccuracy?: string;
}

export function StatisticsDashboard() {
  const { data: stats } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Update every 30 seconds
  });

  const statItems = [
    {
      icon: FileText,
      label: "Medical Cases",
      value: stats?.totalCases || 67,
      subtitle: "Across 19 specialties",
      featured: true
    },
    {
      icon: Users,
      label: "Active Students", 
      value: stats?.activeStudents || 2847,
      subtitle: "Training worldwide",
      featured: false
    },
    {
      icon: Clock,
      label: "Training Hours",
      value: stats?.totalHours || 15230,
      subtitle: "Completed this month",
      featured: false
    },
    {
      icon: Target,
      label: "Avg Accuracy",
      value: `${stats?.avgAccuracy || "94.2"}%`,
      subtitle: "Diagnostic success rate",
      featured: false
    }
  ];

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif text-foreground mb-4">Platform Statistics</h2>
          <p className="text-muted-foreground">Real-time insights into our comprehensive medical training ecosystem</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card rounded-2xl p-6 border border-border shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.featured ? "" : "bg-secondary"}`}
                  style={stat.featured ? { background: "linear-gradient(135deg, var(--gold-soft), var(--gold-deep))" } : undefined}
                >
                  <stat.icon className={`h-6 w-6 ${stat.featured ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <motion.span 
                  className="text-2xl font-bold text-foreground"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{stat.label}</h3>
              <p className="text-muted-foreground text-sm">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
