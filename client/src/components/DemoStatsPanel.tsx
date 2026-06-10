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
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
    increment: 1247
  },
  {
    icon: Users,
    label: 'Bills Successfully Disputed',
    value: '12,847',
    description: 'Billing errors corrected',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
    increment: 3
  },
  {
    icon: TrendingUp,
    label: 'Average Savings Per User',
    value: '$8,524',
    description: 'Typical savings amount',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
    increment: 12
  },
  {
    icon: Award,
    label: 'Success Rate',
    value: '87.3%',
    description: 'Of bills reduced or eliminated',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary',
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
      <Card className="p-3 bg-secondary border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Demo Showcase</span>
          </div>
          <Badge className="bg-card text-muted-foreground border border-border text-xs">SIMULATED DATA</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          The following metrics demonstrate our platform capabilities using simulated success data.
        </p>
      </Card>

      {/* Live Success Feed */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-emerald-500 rounded-full"
          />
          <span className="text-sm font-semibold text-foreground">Success Story Examples</span>
          <Badge className="bg-card text-muted-foreground border border-border text-xs">DEMO</Badge>
        </div>
        
        <motion.div
          key={currentUpdateIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-foreground font-medium">
            {liveUpdates[currentUpdateIndex]}
          </p>
        </motion.div>
      </Card>

      {/* Demo Statistics Grid */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Platform Performance Metrics</span>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">DEMO DATA</Badge>
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
                  <span className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <motion.div 
                    className="text-lg font-bold text-foreground"
                    key={stat.value} // Re-trigger animation on value change
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <Badge variant="secondary" className="text-xs bg-secondary text-muted-foreground">
                    Simulated
                  </Badge>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Social Proof Section */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-gold" />
          <span className="text-sm font-semibold text-foreground">Trusted by Healthcare Advocates</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-3 w-3 text-gold fill-current" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">4.9/5 from 2,847 reviews</span>
          </div>
          
          <p className="text-xs text-muted-foreground italic">
            "This AI found $34,000 in billing errors that three human billing advocates missed. 
            It's like having a forensic accountant in your pocket." - Dr. Jennifer Martinez, Patient Advocate
          </p>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground mt-2 inline-block">
            Example testimonial for demo
          </Badge>
        </div>
      </Card>

      {/* Urgency Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="p-3 bg-secondary border border-border rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-destructive" />
          <span className="text-sm font-semibold text-destructive">Time-Sensitive Savings</span>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Medical bills go to collections in 90-120 days. Every day you wait reduces your negotiation power.
            <strong className="block mt-1 text-foreground">Start saving now before it's too late!</strong>
          </p>
          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
            Demo urgency messaging
          </Badge>
        </div>
      </motion.div>
    </motion.div>
  );
}