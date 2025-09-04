import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TestTubeDiagonal, Zap, Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TestOrderingModalProps {
  caseId: string;
  isVisible: boolean;
  onClose: () => void;
}

interface DiagnosticTest {
  name: string;
  category?: string;
  type?: string;
  indication: string;
  normalRange?: string;
  result?: string;
  abnormal?: boolean;
  interpretation?: string;
  findings?: string;
  impression?: string;
  complications?: string;
}

interface TestCategories {
  laboratory: DiagnosticTest[];
  imaging: DiagnosticTest[];
  procedures: DiagnosticTest[];
}

export function TestOrderingModal({ caseId, isVisible, onClose }: TestOrderingModalProps) {
  const [availableTests, setAvailableTests] = useState<TestCategories>({
    laboratory: [],
    imaging: [],
    procedures: []
  });
  const [orderedTests, setOrderedTests] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<DiagnosticTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderingTest, setOrderingTest] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible && caseId) {
      loadAvailableTests();
      loadTestResults();
    }
  }, [isVisible, caseId]);

  const loadAvailableTests = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`/api/cases/${caseId}/available-tests`, {
        method: 'GET'
      });
      const data = await response.json();
      setAvailableTests(data);
    } catch (error) {
      console.error('Error loading available tests:', error);
      toast({
        title: "Error",
        description: "Failed to load available tests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTestResults = async () => {
    try {
      const response = await apiRequest(`/api/cases/${caseId}/test-results`, {
        method: 'GET'
      });
      const data = await response.json();
      setOrderedTests(data.ordered || []);
      setTestResults(data.results || []);
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  };

  const orderTest = async (testName: string, testType: string) => {
    setOrderingTest(testName);
    try {
      const response = await apiRequest(`/api/cases/${caseId}/order-test`, {
        method: 'POST',
        body: JSON.stringify({ testName, testType }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrderedTests(prev => [...prev, testName]);
        setTestResults(prev => [...prev, data.result]);
        toast({
          title: "Test Ordered",
          description: data.message,
        });
      }
    } catch (error) {
      console.error('Error ordering test:', error);
      toast({
        title: "Error",
        description: "Failed to order test",
        variant: "destructive",
      });
    } finally {
      setOrderingTest(null);
    }
  };

  const isTestOrdered = (testName: string) => orderedTests.includes(testName);

  const getTestIcon = (testType: string) => {
    switch (testType) {
      case 'laboratory':
        return TestTubeDiagonal;
      case 'imaging':
        return Zap;
      case 'procedures':
        return Activity;
      default:
        return TestTubeDiagonal;
    }
  };

  const renderTestCard = (test: DiagnosticTest, testType: string) => {
    const Icon = getTestIcon(testType);
    const isOrdered = isTestOrdered(test.name);
    const isOrdering = orderingTest === test.name;

    return (
      <Card key={test.name} className={`${isOrdered ? 'bg-green-50 border-green-200' : 'hover:shadow-md'} transition-all duration-200`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {test.name}
              </CardTitle>
              {test.category && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {test.category}
                </Badge>
              )}
            </div>
            <Button
              onClick={() => orderTest(test.name, testType)}
              disabled={isOrdered || isOrdering}
              size="sm"
              className={isOrdered ? "bg-green-600" : ""}
              data-testid={`button-order-${test.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {isOrdering ? (
                <>
                  <Clock className="h-4 w-4 mr-1 animate-spin" />
                  Ordering...
                </>
              ) : isOrdered ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Ordered
                </>
              ) : (
                "Order Test"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-2">
            <span className="font-medium">Indication:</span> {test.indication}
          </p>
          {test.normalRange && (
            <p className="text-sm text-slate-600">
              <span className="font-medium">Normal Range:</span> {test.normalRange}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderTestResults = () => {
    if (testResults.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
          <TestTubeDiagonal className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p>No test results available yet. Order some tests to see results!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {testResults.map((result, index) => (
          <Card key={index} className={`${result.abnormal ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                {result.abnormal ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {result.name}
                <Badge variant={result.abnormal ? "destructive" : "secondary"}>
                  {result.abnormal ? "Abnormal" : "Normal"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.result && (
                  <div>
                    <h5 className="font-medium text-slate-700 mb-1">Result</h5>
                    <p className="text-sm text-slate-600">{result.result}</p>
                  </div>
                )}
                {result.findings && (
                  <div>
                    <h5 className="font-medium text-slate-700 mb-1">Findings</h5>
                    <p className="text-sm text-slate-600">{result.findings}</p>
                  </div>
                )}
                {result.impression && (
                  <div>
                    <h5 className="font-medium text-slate-700 mb-1">Impression</h5>
                    <p className="text-sm text-slate-600">{result.impression}</p>
                  </div>
                )}
                {result.interpretation && (
                  <div>
                    <h5 className="font-medium text-slate-700 mb-1">Interpretation</h5>
                    <p className="text-sm text-slate-600">{result.interpretation}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-5xl max-h-[85vh] overflow-y-auto"
        style={{
          zIndex: 9999,
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TestTubeDiagonal className="h-6 w-6 text-indigo-600" />
            <span>Diagnostic Test Ordering</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="order-tests" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="order-tests">Order Tests</TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              Results
              {testResults.length > 0 && (
                <Badge variant="secondary">{testResults.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="order-tests">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-slate-600">Loading available tests...</span>
              </div>
            ) : (
              <Tabs defaultValue="laboratory" orientation="horizontal">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="laboratory" className="flex items-center gap-2">
                    <TestTubeDiagonal className="h-4 w-4" />
                    Laboratory ({availableTests.laboratory.length})
                  </TabsTrigger>
                  <TabsTrigger value="imaging" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Imaging ({availableTests.imaging.length})
                  </TabsTrigger>
                  <TabsTrigger value="procedures" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Procedures ({availableTests.procedures.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="laboratory" className="space-y-4 mt-6">
                  <div className="grid gap-4">
                    {availableTests.laboratory.map(test => renderTestCard(test, 'laboratory'))}
                  </div>
                </TabsContent>
                
                <TabsContent value="imaging" className="space-y-4 mt-6">
                  <div className="grid gap-4">
                    {availableTests.imaging.map(test => renderTestCard(test, 'imaging'))}
                  </div>
                </TabsContent>
                
                <TabsContent value="procedures" className="space-y-4 mt-6">
                  <div className="grid gap-4">
                    {availableTests.procedures.map(test => renderTestCard(test, 'procedures'))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            {renderTestResults()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}