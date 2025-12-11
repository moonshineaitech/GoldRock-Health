import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ChevronRight,
  FileText,
  Building2,
  Calendar,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { MedicalBill } from "@shared/schema";

interface BillHistoryDashboardProps {
  onSelectBill: (billId: string) => void;
}

const statusConfig = {
  uploaded: { label: "Uploaded", color: "bg-gray-100 text-gray-700", icon: FileText },
  analyzing: { label: "Analyzing", color: "bg-blue-100 text-blue-700", icon: Clock },
  analyzed: { label: "Analyzed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
  disputed: { label: "In Dispute", color: "bg-amber-100 text-amber-700", icon: AlertCircle },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle }
};

export function BillHistoryDashboard({ onSelectBill }: BillHistoryDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: bills, isLoading } = useQuery<MedicalBill[]>({
    queryKey: ['/api/bills']
  });

  const { data: savingsData } = useQuery<{ totalSaved: number; billsResolved: number }>({
    queryKey: ['/api/user/savings-summary']
  });

  const filteredBills = bills?.filter(bill => {
    const matchesSearch = !searchTerm || 
      bill.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const totalPotentialSavings = bills?.reduce((sum, bill) => {
    return sum + (Number(bill.patientResponsibility) * 0.3); // Estimate 30% savings
  }, 0) || 0;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 opacity-80" />
              <span className="text-sm opacity-80">Total Saved</span>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(savingsData?.totalSaved || 0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 opacity-80" />
              <span className="text-sm opacity-80">Potential Savings</span>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(totalPotentialSavings)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
            data-testid="bill-search-input"
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "uploaded", "analyzed", "disputed", "resolved"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full whitespace-nowrap ${
              statusFilter === status 
                ? "bg-emerald-500 hover:bg-emerald-600" 
                : ""
            }`}
            data-testid={`filter-${status}`}
          >
            {status === "all" ? "All Bills" : statusConfig[status as keyof typeof statusConfig]?.label || status}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBills.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No bills yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Upload your first bill to start saving
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredBills.map((bill, idx) => {
            const status = statusConfig[bill.status as keyof typeof statusConfig] || statusConfig.uploaded;
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => onSelectBill(bill.id)}
                  data-testid={`bill-card-${bill.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <h4 className="font-semibold text-gray-900 truncate">
                            {bill.providerName || bill.title}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(bill.serviceDate)}
                          </span>
                          <Badge className={`${status.color} text-xs`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(bill.patientResponsibility)}
                        </p>
                        <ChevronRight className="w-5 h-5 text-gray-300 ml-auto" />
                      </div>
                    </div>

                    {bill.status === "disputed" && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Dispute Progress</span>
                          <span>60%</span>
                        </div>
                        <Progress value={60} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
