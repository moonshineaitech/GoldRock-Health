import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Save,
  Sparkles,
  Award,
  PartyPopper,
  Zap,
  Heart
} from "lucide-react";

interface SavedOutcome {
  id: string;
  originalAmount: number;
  finalAmount: number;
  savings: number;
  savingsPercent: number;
  method: string;
  provider: string;
  status: 'pending' | 'negotiating' | 'settled' | 'paid';
  notes: string;
  date: Date;
}

interface OutcomeTrackerProps {
  onClose?: () => void;
  initialBillAmount?: number;
  providerName?: string;
}

export function OutcomeTracker({ onClose, initialBillAmount, providerName }: OutcomeTrackerProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [outcomes, setOutcomes] = useState<SavedOutcome[]>([
    {
      id: '1',
      originalAmount: 12450,
      finalAmount: 4980,
      savings: 7470,
      savingsPercent: 60,
      method: 'Charity Care Application',
      provider: 'Memorial Hospital',
      status: 'settled',
      notes: 'Applied for financial assistance, qualified for 60% reduction',
      date: new Date('2024-12-01')
    },
    {
      id: '2',
      originalAmount: 3200,
      finalAmount: 1920,
      savings: 1280,
      savingsPercent: 40,
      method: 'Insurance Appeal',
      provider: 'Aetna',
      status: 'settled',
      notes: 'Appeal letter with medical necessity documentation',
      date: new Date('2024-11-15')
    },
    {
      id: '3',
      originalAmount: 8500,
      finalAmount: 5500,
      savings: 3000,
      savingsPercent: 35,
      method: 'Direct Negotiation',
      provider: 'City Medical Center',
      status: 'negotiating',
      notes: 'Payment plan with cash discount offered',
      date: new Date('2024-12-05')
    }
  ]);

  type OutcomeStatus = 'pending' | 'negotiating' | 'settled' | 'paid';
  
  const [formData, setFormData] = useState<{
    originalAmount: string;
    finalAmount: string;
    method: string;
    provider: string;
    status: OutcomeStatus;
    notes: string;
  }>({
    originalAmount: initialBillAmount?.toString() || '',
    finalAmount: '',
    method: '',
    provider: providerName || '',
    status: 'pending',
    notes: ''
  });

  const totalSavings = outcomes.reduce((sum, o) => sum + o.savings, 0);
  const totalOriginal = outcomes.reduce((sum, o) => sum + o.originalAmount, 0);
  const avgSavingsPercent = totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;
  const settledCount = outcomes.filter(o => o.status === 'settled').length;

  const handleSubmit = () => {
    const original = parseFloat(formData.originalAmount);
    const final = parseFloat(formData.finalAmount);
    
    if (isNaN(original) || isNaN(final)) {
      toast({
        title: "Invalid amounts",
        description: "Please enter valid dollar amounts",
        variant: "destructive"
      });
      return;
    }

    const savings = original - final;
    const savingsPercent = Math.round((savings / original) * 100);

    const newOutcome: SavedOutcome = {
      id: Date.now().toString(),
      originalAmount: original,
      finalAmount: final,
      savings,
      savingsPercent,
      method: formData.method,
      provider: formData.provider,
      status: formData.status,
      notes: formData.notes,
      date: new Date()
    };

    setOutcomes([newOutcome, ...outcomes]);
    setShowForm(false);
    setFormData({
      originalAmount: '',
      finalAmount: '',
      method: '',
      provider: '',
      status: 'pending',
      notes: ''
    });

    toast({
      title: "Outcome saved! 🎉",
      description: `You saved $${savings.toLocaleString()} (${savingsPercent}%)`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled': return 'bg-emerald-100 text-emerald-700';
      case 'paid': return 'bg-blue-100 text-blue-700';
      case 'negotiating': return 'bg-amber-100 text-amber-700';
      case 'pending': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'settled': return <CheckCircle className="h-3 w-3" />;
      case 'paid': return <DollarSign className="h-3 w-3" />;
      case 'negotiating': return <Clock className="h-3 w-3" />;
      case 'pending': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4" data-testid="outcome-tracker">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Savings Tracker</h2>
            <p className="text-xs text-gray-500">Track your bill reduction wins</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <motion.div 
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-emerald-600 font-medium">Total Saved</span>
          </div>
          <p className="text-xl font-bold text-emerald-700">${totalSavings.toLocaleString()}</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Avg Savings</span>
          </div>
          <p className="text-xl font-bold text-blue-700">{avgSavingsPercent}%</p>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Settled</span>
          </div>
          <p className="text-xl font-bold text-purple-700">{settledCount}</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Record a Win
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Original Bill</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="12,450"
                        className="pl-7 text-sm"
                        value={formData.originalAmount}
                        onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                        data-testid="input-original-amount"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Final Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="4,980"
                        className="pl-7 text-sm"
                        value={formData.finalAmount}
                        onChange={(e) => setFormData({ ...formData, finalAmount: e.target.value })}
                        data-testid="input-final-amount"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Provider</Label>
                    <Input
                      placeholder="Hospital or insurer name"
                      className="text-sm"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      data-testid="input-provider"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Method Used</Label>
                    <Select 
                      value={formData.method}
                      onValueChange={(value) => setFormData({ ...formData, method: value })}
                    >
                      <SelectTrigger className="text-sm" data-testid="select-method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Charity Care">Charity Care</SelectItem>
                        <SelectItem value="Insurance Appeal">Insurance Appeal</SelectItem>
                        <SelectItem value="Direct Negotiation">Direct Negotiation</SelectItem>
                        <SelectItem value="Payment Plan">Payment Plan</SelectItem>
                        <SelectItem value="Billing Error">Billing Error</SelectItem>
                        <SelectItem value="Hardship Application">Hardship Application</SelectItem>
                        <SelectItem value="No Surprises Act">No Surprises Act</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Status</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as OutcomeStatus })}
                  >
                    <SelectTrigger className="text-sm" data-testid="select-status">
                      <SelectValue placeholder="Current status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="negotiating">Negotiating</SelectItem>
                      <SelectItem value="settled">Settled</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Notes</Label>
                  <Textarea
                    placeholder="What worked? What would you do differently?"
                    className="text-sm resize-none"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    data-testid="input-notes"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600"
                    data-testid="button-save-outcome"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Outcome
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    data-testid="button-cancel-outcome"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <Button 
          onClick={() => setShowForm(true)}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
          data-testid="button-record-win"
        >
          <PartyPopper className="h-4 w-4 mr-2" />
          Record a Win
        </Button>
      )}

      <div className="space-y-3">
        <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          Your Wins
        </h3>

        {outcomes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No outcomes recorded yet</p>
            <p className="text-xs text-gray-400">Track your savings to see your progress</p>
          </div>
        ) : (
          <div className="space-y-2">
            {outcomes.map((outcome, index) => (
              <motion.div
                key={outcome.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{outcome.provider}</h4>
                        <p className="text-xs text-gray-500">{outcome.method}</p>
                      </div>
                      <Badge className={getStatusColor(outcome.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(outcome.status)}
                          {outcome.status.charAt(0).toUpperCase() + outcome.status.slice(1)}
                        </span>
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-xs text-gray-400 line-through">${outcome.originalAmount.toLocaleString()}</p>
                          <p className="text-sm font-medium text-gray-700">${outcome.finalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-bold text-emerald-600">
                            -{outcome.savingsPercent}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Saved</p>
                        <p className="text-sm font-bold text-emerald-600">${outcome.savings.toLocaleString()}</p>
                      </div>
                    </div>

                    <Progress 
                      value={outcome.savingsPercent} 
                      className="h-1.5 bg-gray-100"
                    />

                    {outcome.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">"{outcome.notes}"</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
