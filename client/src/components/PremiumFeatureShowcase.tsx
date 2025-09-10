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
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Market Pricing',
    description: 'Live database of 50,000+ procedure costs across all major hospitals',
    value: '78% negotiation success rate',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    icon: Shield,
    title: 'Legal Protection Suite',
    description: 'Regulatory compliance checks and violation reporting assistance',
    value: 'Full legal backing included',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    icon: Target,
    title: 'Custom Strategy Generation',
    description: 'Personalized dispute letters and negotiation scripts for your specific situation',
    value: 'Tailored to your exact case',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    icon: Clock,
    title: 'Priority Expert Support',
    description: '24/7 access to medical billing advocates and rapid response guarantee',
    value: '<2 hour response time',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  {
    icon: DollarSign,
    title: 'Unlimited Bill Analysis',
    description: 'Analyze unlimited medical bills with no restrictions or usage limits',
    value: 'Save on every medical bill',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
];

export function PremiumFeatureShowcase({ isSubscribed, onUpgrade, savingsAmount }: PremiumFeatureShowcaseProps) {
  const [selectedFeature, setSelectedFeature] = useState(0);

  if (isSubscribed) {
    return (
      <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">Premium Member</span>
          <Badge className="bg-emerald-600 text-white text-xs">ACTIVE</Badge>
        </div>
        <p className="text-xs text-emerald-800">
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
      <Card className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-amber-200 shadow-lg">
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-lg"
          >
            <Crown className="h-6 w-6 text-white" />
          </motion.div>
          
          <h3 className="text-lg font-bold text-amber-800 mb-1">Unlock Premium Savings</h3>
          <p className="text-sm text-amber-700 mb-3">
            Premium users save an average of <strong>${savingsAmount || '12,400'} more</strong> per medical bill
          </p>
          
          <Button 
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg"
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
              <Card className={`p-3 transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-amber-300 shadow-lg' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {feature.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-amber-600">
                      {feature.value}
                    </div>
                    <Badge variant="outline" className="text-xs border-amber-200 text-amber-700">
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
      <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">Money-Back Guarantee</span>
        </div>
        <p className="text-xs text-green-800">
          If we don't save you at least <strong>10x your subscription cost</strong> within 30 days, 
          get a full refund plus $100 for your time.
        </p>
      </Card>
    </motion.div>
  );
}