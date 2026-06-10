import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Zap, 
  TrendingUp,
  Shield,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Award,
  Brain,
  Target
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PremiumFeatureShowcaseProps {
  isSubscribed: boolean;
  onUpgrade: () => void;
  savingsAmount?: string;
}

const premiumFeatures = [
  {
    icon: Brain,
    title: 'AI Expert Analysis',
    description: 'Advanced AI algorithms detect 87% more billing errors than basic scans',
    value: 'Avg. $12,400 additional savings',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Market Pricing',
    description: 'Live database of 50,000+ procedure costs across all major hospitals',
    value: '78% negotiation success rate',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    icon: Shield,
    title: 'Legal Protection Suite',
    description: 'Regulatory compliance checks and violation reporting assistance',
    value: 'Full legal backing included',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    icon: Target,
    title: 'Custom Strategy Generation',
    description: 'Personalized dispute letters and negotiation scripts for your specific situation',
    value: 'Tailored to your exact case',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    icon: Clock,
    title: 'Priority Expert Support',
    description: '24/7 access to medical billing advocates and rapid response guarantee',
    value: '<2 hour response time',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  },
  {
    icon: DollarSign,
    title: 'Unlimited Bill Analysis',
    description: 'Analyze unlimited medical bills with no restrictions or usage limits',
    value: 'Save on every medical bill',
    color: 'text-muted-foreground',
    bgColor: 'bg-secondary'
  }
];

export function PremiumFeatureShowcase({ isSubscribed, onUpgrade, savingsAmount }: PremiumFeatureShowcaseProps) {
  const [selectedFeature, setSelectedFeature] = useState(0);

  if (isSubscribed) {
    return (
      <Card className="p-4 bg-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-4 w-4 text-gold" />
          <span className="text-sm font-semibold text-foreground">Premium Member</span>
          <Badge className="bg-gold text-white text-xs">ACTIVE</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          You have access to all premium features including unlimited AI analysis, expert support, and advanced savings strategies.
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Premium Upgrade Hero */}
      <Card className="p-4 bg-card border border-border shadow-sm">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          >
            <Crown className="h-6 w-6 text-white" />
          </div>
          
          <h3 className="text-lg font-bold font-serif text-foreground mb-1">Unlock Premium Savings</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Premium users save an average of <strong>${savingsAmount || '12,400'} more</strong> per medical bill
          </p>
          
          <Button 
            onClick={onUpgrade}
            className="w-full text-white font-semibold shadow-sm hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Premium Features Grid */}
      <div className="grid grid-cols-1 gap-3">
        {premiumFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          const isSelected = selectedFeature === index;
          
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => setSelectedFeature(index)}
              className="cursor-pointer"
            >
              <Card className={`p-3 transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-[var(--gold)] shadow-sm' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">
                        {feature.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gold">
                      {feature.value}
                    </div>
                    <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                      Premium
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Success Guarantee */}
      <Card className="p-3 bg-card border border-border">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Money-Back Guarantee</span>
        </div>
        <p className="text-xs text-muted-foreground">
          If we don't save you at least <strong>10x your subscription cost</strong> within 30 days, 
          get a full refund plus $100 for your time.
        </p>
      </Card>
    </motion.div>
  );
}