import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2,
  Award,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DemoStatsPanelProps {
  isVisible: boolean;
}

const impressiveStats = [
  {
    icon: DollarSign,
    label: 'Total Savings Generated',
    value: '$47,382,947',
    description: 'Saved for our users this year',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    increment: 1247
  },
  {
    icon: Users,
    label: 'Bills Successfully Disputed',
    value: '12,847',
    description: 'Billing errors corrected',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    increment: 3
  },
  {
    icon: TrendingUp,
    label: 'Average Savings Per User',
    value: '$8,524',
    description: 'Typical savings amount',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    increment: 12
  },
  {
    icon: Award,
    label: 'Success Rate',
    value: '87.3%',
    description: 'Of bills reduced or eliminated',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    increment: 0.1
  }
];

const liveUpdates = [
  "Sarah from Denver saved $23,400 on emergency surgery bill",
  "Mike from Austin reduced cancer treatment bill by 78%",
  "Jennifer from Miami eliminated $15,600 in billing errors",
  "Carlos from Phoenix negotiated 65% reduction on MRI charges",
  "Lisa from Boston got $31,200 charity care approval",
  "David from Seattle successfully appealed $18,900 insurance denial"
];

export function DemoStatsPanel({ isVisible }: DemoStatsPanelProps) {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [stats, setStats] = useState(impressiveStats);

  // Rotate live updates
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentUpdateIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Animate stat increments for demo effect
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          if (stat.increment === 0) return stat;
          
          const currentValue = parseFloat(stat.value.replace(/[$,%]/g, ''));
          const newValue = currentValue + stat.increment;
          
          let formattedValue = stat.value;
          if (stat.label.includes('Total Savings')) {
            formattedValue = `$${Math.round(newValue).toLocaleString()}`;
          } else if (stat.label.includes('Bills Successfully')) {
            formattedValue = Math.round(newValue).toLocaleString();
          } else if (stat.label.includes('Average Savings')) {
            formattedValue = `$${Math.round(newValue).toLocaleString()}`;
          } else if (stat.label.includes('Success Rate')) {
            formattedValue = `${Math.min(newValue, 99.9).toFixed(1)}%`;
          }
          
          return { ...stat, value: formattedValue };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Demo Disclaimer Header */}
      <Card className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Demo Showcase</span>
          </div>
          <Badge className="bg-blue-600 text-white text-xs">SIMULATED DATA</Badge>
        </div>
        <p className="text-xs text-blue-700 mt-2">
          The following metrics demonstrate our platform capabilities using simulated success data.
        </p>
      </Card>

      {/* Live Success Feed */}
      <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-500 rounded-full"
          />
          <span className="text-sm font-semibold text-emerald-700">Success Story Examples</span>
          <Badge className="bg-emerald-600 text-white text-xs">DEMO</Badge>
        </div>
        
        <motion.div
          key={currentUpdateIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">
            {liveUpdates[currentUpdateIndex]}
          </p>
        </motion.div>
      </Card>

      {/* Demo Statistics Grid */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Platform Performance Metrics</span>
          <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">DEMO DATA</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-3 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`h-3 w-3 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {stat.label}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <motion.div 
                    className={`text-lg font-bold ${stat.color}`}
                    key={stat.value} // Re-trigger animation on value change
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-xs text-gray-600">
                    {stat.description}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500">
                    Simulated
                  </Badge>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Social Proof Section */}
      <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-700">Trusted by Healthcare Advocates</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-3 w-3 text-yellow-500 fill-current" />
            ))}
            <span className="text-xs text-yellow-700 ml-1">4.9/5 from 2,847 reviews</span>
          </div>
          
          <p className="text-xs text-yellow-800 italic">
            "This AI found $34,000 in billing errors that three human billing advocates missed. 
            It's like having a forensic accountant in your pocket." - Dr. Jennifer Martinez, Patient Advocate
          </p>
          <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-700 mt-2 inline-block">
            Example testimonial for demo
          </Badge>
        </div>
      </Card>

      {/* Urgency Indicator */}
      <motion.div
        animate={{ 
          boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0.4)",
            "0 0 0 10px rgba(239, 68, 68, 0)",
            "0 0 0 0 rgba(239, 68, 68, 0)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="p-3 bg-red-50 border border-red-200 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-red-600" />
          <span className="text-sm font-semibold text-red-700">Time-Sensitive Savings</span>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-red-800">
            Medical bills go to collections in 90-120 days. Every day you wait reduces your negotiation power.
            <strong className="block mt-1">Start saving now before it's too late!</strong>
          </p>
          <Badge variant="outline" className="text-xs border-red-300 text-red-600">
            Demo urgency messaging
          </Badge>
        </div>
      </motion.div>
    </motion.div>
  );
}