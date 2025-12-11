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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  Heart,
  Loader2
} from "lucide-react";

interface UserSavingsOutcome {
  id: string;
  userId: string;
  billId?: string;
  originalAmount: string;
  finalAmount?: string;
  totalSaved?: string;
  savingsMethod?: string;
  providerName?: string;
  strategyUsed?: string;
  timeToResolve?: number;
  status: string;
  userNotes?: string;
  verifiedSavings: boolean;
  createdAt: string;
  resolvedAt?: string;
}

interface OutcomeTrackerProps {
  onClose?: () => void;
  initialBillAmount?: number;
  providerName?: string;
}

type OutcomeStatus = 'in_progress' | 'resolved' | 'abandoned';

export function OutcomeTracker({ onClose, initialBillAmount, providerName }: OutcomeTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  
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
    status: 'in_progress',
    notes: ''
  });

  const { data: outcomes = [], isLoading } = useQuery<UserSavingsOutcome[]>({
    queryKey: ['/api/savings-outcomes']
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/savings-outcomes', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/savings-outcomes'] });
      setShowForm(false);
      setFormData({
        originalAmount: '',
        finalAmount: '',
        method: '',
        provider: '',
        status: 'in_progress',
        notes: ''
      });
      toast({
        title: "Outcome saved! 🎉",
        description: "Your savings outcome has been recorded",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save outcome",
        variant: "destructive"
      });
    }
  });

  const totalSavings = outcomes.reduce((sum, o) => sum + parseFloat(o.totalSaved || '0'), 0);
  const totalOriginal = outcomes.reduce((sum, o) => sum + parseFloat(o.originalAmount || '0'), 0);
  const avgSavingsPercent = totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;
  const resolvedCount = outcomes.filter(o => o.status === 'resolved').length;

  const handleSubmit = () => {
    const original = parseFloat(formData.originalAmount);
    const final = parseFloat(formData.finalAmount);
    
    if (isNaN(original)) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid original bill amount",
        variant: "destructive"
      });
      return;
    }

    const savings = isNaN(final) ? 0 : original - final;

    createMutation.mutate({
      originalAmount: original,
      finalAmount: isNaN(final) ? null : final,
      totalSaved: savings,
      savingsMethod: formData.method || null,
      providerName: formData.provider || null,
      strategyUsed: formData.notes || null,
      status: formData.status,
      userNotes: formData.notes || null
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-emerald-100 text-emerald-700';
      case 'in_progress': return 'bg-amber-100 text-amber-700';
      case 'abandoned': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-3 w-3" />;
      case 'in_progress': return <Clock className="h-3 w-3" />;
      case 'abandoned': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'in_progress': return 'In Progress';
      case 'abandoned': return 'Abandoned';
      default: return status;
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
            <span className="text-xs text-purple-600 font-medium">Resolved</span>
          </div>
          <p className="text-xl font-bold text-purple-700">{resolvedCount}</p>
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
                        <SelectItem value="charity_care">Charity Care</SelectItem>
                        <SelectItem value="insurance_appeal">Insurance Appeal</SelectItem>
                        <SelectItem value="negotiation">Direct Negotiation</SelectItem>
                        <SelectItem value="payment_plan">Payment Plan</SelectItem>
                        <SelectItem value="billing_error">Billing Error</SelectItem>
                        <SelectItem value="hardship">Hardship Application</SelectItem>
                        <SelectItem value="no_surprises_act">No Surprises Act</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="abandoned">Abandoned</SelectItem>
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
                    disabled={createMutation.isPending}
                    data-testid="button-save-outcome"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
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

        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 text-emerald-500 mx-auto animate-spin" />
            <p className="text-sm text-gray-500 mt-2">Loading your outcomes...</p>
          </div>
        ) : outcomes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No outcomes recorded yet</p>
            <p className="text-xs text-gray-400">Track your savings to see your progress</p>
          </div>
        ) : (
          <div className="space-y-2">
            {outcomes.map((outcome, index) => {
              const original = parseFloat(outcome.originalAmount || '0');
              const final = parseFloat(outcome.finalAmount || '0');
              const saved = parseFloat(outcome.totalSaved || '0');
              const savingsPercent = original > 0 ? Math.round((saved / original) * 100) : 0;

              return (
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
                          <h4 className="font-medium text-sm text-gray-900">{outcome.providerName || 'Provider'}</h4>
                          <p className="text-xs text-gray-500">{outcome.savingsMethod?.replace('_', ' ') || 'Method not specified'}</p>
                        </div>
                        <Badge className={getStatusColor(outcome.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(outcome.status)}
                            {getStatusLabel(outcome.status)}
                          </span>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs text-gray-400 line-through">${original.toLocaleString()}</p>
                            <p className="text-sm font-medium text-gray-700">${final.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-bold text-emerald-600">
                              -{savingsPercent}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Saved</p>
                          <p className="text-sm font-bold text-emerald-600">${saved.toLocaleString()}</p>
                        </div>
                      </div>

                      <Progress 
                        value={savingsPercent} 
                        className="h-1.5 bg-gray-100"
                      />

                      {outcome.userNotes && (
                        <p className="text-xs text-gray-500 mt-2 italic">"{outcome.userNotes}"</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
