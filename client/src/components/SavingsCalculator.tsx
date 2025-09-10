import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  CheckCircle2,
  Zap,
  Calculator,
  PiggyBank,
  Award,
  Star,
  Trophy,
  Crown,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface SavingsCalculatorProps {
  billAmount?: string;
  provider?: string;
  isVisible: boolean;
  analysisStage: 'scanning' | 'analyzing' | 'calculating' | 'complete';
}

interface SavingsMetric {
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export function SavingsCalculator({ billAmount, provider, isVisible, analysisStage }: SavingsCalculatorProps) {
  const [calculatedSavings, setCalculatedSavings] = useState<SavingsMetric[]>([]);
  const [totalPotentialSavings, setTotalPotentialSavings] = useState('$0');
  const [animatedValue, setAnimatedValue] = useState(0);
  const [successStories, setSuccessStories] = useState<string[]>([]);

  // Simulated realistic calculation based on bill amount
  useEffect(() => {
    if (!billAmount || analysisStage === 'scanning') return;

    const amount = parseFloat(billAmount.replace(/[$,]/g, '')) || 0;
    
    // Calculate conservative savings estimates based on industry data
    const calculations: SavingsMetric[] = [
      {
        label: 'Billing Error Detection',
        value: `$${Math.round(amount * 0.08).toLocaleString()} - $${Math.round(amount * 0.15).toLocaleString()}`,
        description: 'Studies show 80% of bills contain errors. Conservative estimate: 8-15%',
        icon: CheckCircle2,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100'
      },
      {
        label: 'Payment Plan Negotiation',
        value: `$${Math.round(amount * 0.12).toLocaleString()} - $${Math.round(amount * 0.25).toLocaleString()}`,
        description: 'Typical negotiated reductions range 12-25% with proper approach',
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        label: 'Insurance Appeals (if applicable)',
        value: `$${Math.round(amount * 0.30).toLocaleString()} - $${Math.round(amount * 0.65).toLocaleString()}`,
        description: 'Professional appeals have 65-78% success rate for valid claims',
        icon: Award,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        label: 'Financial Assistance Programs',
        value: `$${Math.round(amount * 0.40).toLocaleString()} - $${Math.round(amount * 0.85).toLocaleString()}`,
        description: 'Hospital charity care: 40-85% reduction based on income qualification',
        icon: PiggyBank,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      },
      {
        label: 'Fair Price Analysis',
        value: `$${Math.round(amount * 0.20).toLocaleString()} - $${Math.round(amount * 0.45).toLocaleString()}`,
        description: 'Medicare rates often 20-45% of billed charges for same services',
        icon: Calculator,
        color: 'text-cyan-600',
        bgColor: 'bg-cyan-100'
      }
    ];

    setCalculatedSavings(calculations);

    // Calculate highest potential savings (using max of ranges)
    const maxSavings = Math.max(...calculations.map(calc => {
      const matches = calc.value.match(/\$(\d{1,3}(?:,\d{3})*)(?:\s*-\s*\$(\d{1,3}(?:,\d{3})*))?/);
      if (matches && matches[2]) {
        return parseFloat(matches[2].replace(/,/g, ''));
      } else if (matches && matches[1]) {
        return parseFloat(matches[1].replace(/,/g, ''));
      }
      return 0;
    }));
    setTotalPotentialSavings(`$${maxSavings.toLocaleString()}`);

    // Animate the total value
    let current = 0;
    const target = maxSavings;
    const increment = target / 30; // 30 steps for smooth animation
    
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setAnimatedValue(Math.round(current));
    }, 50);

    return () => clearInterval(interval);
  }, [billAmount, analysisStage]);

  // Demo success stories (clearly marked as examples)
  useEffect(() => {
    const stories = [
      `Example: Patient saved $8,400 on emergency surgery bill through error detection`,
      `Case study: Family reduced cancer treatment bill by 65% using financial assistance`,
      `Demo scenario: $4,750 saved on imaging charges by identifying billing errors`,
      `Sample: Insurance appeal recovered $12,000 in previously denied coverage`,
      `Example: Negotiation reduced ambulance bill from $8,500 to $2,100`,
      `Case study: Charity care reduced cardiac procedure charges by 75%`
    ];
    setSuccessStories(stories);
  }, []);

  if (!isVisible || analysisStage === 'scanning') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="space-y-4"
    >
      {/* Hero Savings Display */}
      <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
          >
            <DollarSign className="h-8 w-8 text-white" />
          </motion.div>
          
          <div className="mb-2">
            <span className="text-sm font-medium text-emerald-700">Estimated Maximum Potential</span>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-4xl font-bold text-emerald-700 mb-2"
          >
            ${animatedValue.toLocaleString()}
          </motion.div>
          
          <p className="text-sm text-emerald-600">
            Based on bill amount of {billAmount || '$0'} (Demo calculation)
          </p>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-600">Conservative estimates - Results vary by case</span>
          </div>
        </div>
      </Card>

      {/* Savings Breakdown */}
      {analysisStage === 'calculating' || analysisStage === 'complete' ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-700">Savings Opportunities Identified</span>
          </div>
          
          {calculatedSavings.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + (index * 0.1) }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${metric.color}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {metric.label}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {metric.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${metric.color}`}>
                        {metric.value}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Potential
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : null}

      {/* Success Stories */}
      {analysisStage === 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">Success Story Examples</span>
            <Badge variant="secondary" className="text-xs">Demo Cases</Badge>
          </div>
          
          <div className="grid gap-2">
            {successStories.slice(0, 3).map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + (index * 0.1) }}
                className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    {story}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">Important Disclaimer</span>
            </div>
            <p className="text-xs text-yellow-800">
              These are estimate ranges for demonstration. Actual results depend on bill complexity, 
              insurance status, provider policies, and individual circumstances. No guarantee of specific savings amounts.
            </p>
          </div>
        </motion.div>
      )}

      {/* Progress Indicator */}
      {analysisStage !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4"
        >
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Analysis Progress</span>
            <span>
              {analysisStage === 'analyzing' ? '60%' : '90%'}
            </span>
          </div>
          <Progress 
            value={
              analysisStage === 'analyzing' ? 60 : 90
            } 
            className="h-2" 
          />
        </motion.div>
      )}
    </motion.div>
  );
}