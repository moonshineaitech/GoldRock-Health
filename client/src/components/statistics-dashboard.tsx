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
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Users,
      label: "Active Students", 
      value: stats?.activeStudents || 2847,
      subtitle: "Training worldwide",
      gradient: "from-purple-500 to-emerald-500"
    },
    {
      icon: Clock,
      label: "Training Hours",
      value: stats?.totalHours || 15230,
      subtitle: "Completed this month",
      gradient: "from-emerald-500 to-indigo-500"
    },
    {
      icon: Target,
      label: "Avg Accuracy",
      value: `${stats?.avgAccuracy || "94.2"}%`,
      subtitle: "Diagnostic success rate",
      gradient: "from-indigo-500 to-rose-500"
    }
  ];

  return (
    <section className="py-16 bg-white/40 backdrop-blur-sm border-y border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Platform Statistics</h2>
          <p className="text-slate-600">Real-time insights into our comprehensive medical training ecosystem</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="text-white h-6 w-6" />
                </div>
                <motion.span 
                  className="text-2xl font-bold text-slate-900"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{stat.label}</h3>
              <p className="text-slate-600 text-sm">{stat.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
