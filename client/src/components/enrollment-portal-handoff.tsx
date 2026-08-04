import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  FileText,
  FolderLock,
  Info,
  Landmark,
  LockKeyhole,
  Phone,
  Printer,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { EnrollmentAnswerMap, ValidationIssue } from "@shared/enrollment-workflow";
import {
  buildHandoffPlan,
  type DocumentChecklistItem,
  type HandoffField,
  type HandoffGate,
  type PortalDestination
} from "@shared/enrollment-handoff";

interface EnrollmentPortalHandoffProps {
  answers: EnrollmentAnswerMap;
  issues: ValidationIssue[];
}

function GateRow({ gate }: { gate: HandoffGate }) {
  const complete = gate.status === "complete";
  const required = gate.status === "required";

  return (
    <div className="flex items-start gap-3 py-3">
      <span
        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
          complete
            ? "bg-emerald-100 text-emerald-700"
            : gate.blocking
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-600"
        }`}
      >
        {complete ? (
          <Check className="h-4 w-4" />
        ) : required ? (
          <Circle className="h-3 w-3" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{gate.label}</p>
          {gate.blocking && !complete && (
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
              Required before completion
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{gate.description}</p>
      </div>
    </div>
  );
}

function DestinationCard({
  destination,
  primary = false
}: {
  destination: PortalDestination;
  primary?: boolean;
}) {
  const [confirmedDomain, setConfirmedDomain] = useState(false);

  return (
    <Card className={primary ? "border-2 border-primary/30" : ""}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Landmark className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{destination.name}</h3>
                {primary && <Badge>Recommended handoff</Badge>}
                {destination.governmentOperated && (
                  <Badge variant="outline">Official government destination</Badge>
                )}
              </div>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {destination.owner}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {destination.description}
        </p>

        {destination.warning && (
          <div className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {destination.warning}
          </div>
        )}

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-3">
          <input
            type="checkbox"
            checked={confirmedDomain}
            onChange={(event) => setConfirmedDomain(event.target.checked)}
            className="mt-0.5 h-4 w-4"
          />
          <span className="text-sm">
            <span className="font-medium">I verified the destination and domain.</span>
            <span className="mt-1 block break-all text-xs text-muted-foreground">
              {destination.url}
            </span>
          </span>
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild disabled={!confirmedDomain}>
            <a href={confirmedDomain ? destination.url : undefined} target="_blank" rel="noreferrer">
              Open official destination
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          {destination.phone && (
            <Button variant="outline" asChild>
              <a href={`tel:${destination.phone.replace(/[^\d+]/g, "")}`}>
                <Phone className="mr-2 h-4 w-4" />
                {destination.phone}
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FieldTransferRow({ field }: { field: HandoffField }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

  const copyValue = async () => {
    await navigator.clipboard.writeText(field.value);
    toast({ title: "Field copied", description: `${field.label} is ready to paste.` });
  };

  return (
    <div className="border-b last:border-b-0">
      <div className="grid items-center gap-3 px-4 py-4 sm:grid-cols-[200px_1fr_auto]">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium">
            {field.label}
            {field.sensitive && <LockKeyhole className="h-3.5 w-3.5 text-emerald-700" />}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{field.destinationSection}</p>
        </div>
        <div className="min-w-0">
          <p className={field.sensitive ? "font-medium blur-[3px] transition hover:blur-none" : "font-medium"}>
            {field.value}
          </p>
          {field.requiresApplicantVerification && (
            <p className="mt-1 text-xs text-amber-700">Applicant must verify before submission</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={copyValue} aria-label={`Copy ${field.label}`}>
            <Clipboard className="h-4 w-4" />
          </Button>
          {field.notes && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setExpanded((current) => !current)}
              aria-label={`Show notes for ${field.label}`}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
      {expanded && field.notes && (
        <div className="border-t bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          <Info className="mr-2 inline h-4 w-4" />
          {field.notes}
        </div>
      )}
    </div>
  );
}

function DocumentRow({ document }: { document: DocumentChecklistItem }) {
  const statusClasses = {
    ready: "bg-emerald-100 text-emerald-800",
    needed: "bg-amber-100 text-amber-800",
    "not-applicable": "bg-slate-100 text-slate-600"
  };

  return (
    <div className="flex gap-4 border-b py-4 last:border-b-0">
      <span
        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
          document.status === "ready"
            ? "bg-emerald-100 text-emerald-700"
            : document.status === "needed"
              ? "bg-amber-100 text-amber-700"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        {document.sensitive ? <FolderLock className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{document.title}</p>
          <Badge className={statusClasses[document.status]}>
            {document.status === "not-applicable" ? "Not applicable" : document.status}
          </Badge>
          {document.required && <Badge variant="outline">Required</Badge>}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{document.reason}</p>
        <p className="mt-2 rounded-lg bg-muted/50 p-2 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-700" />
          {document.collectionRule}
        </p>
      </div>
    </div>
  );
}

export function EnrollmentPortalHandoff({
  answers,
  issues
}: EnrollmentPortalHandoffProps) {
  const plan = useMemo(() => buildHandoffPlan(answers, issues), [answers, issues]);
  const [activeTab, setActiveTab] = useState("destination");
  const completedGates = plan.gates.filter((gate) => gate.status === "complete").length;
  const gateProgress = Math.round((completedGates / plan.gates.length) * 100);

  return (
    <div className="mt-8">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            Portal handoff center
          </Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Move from conversation to an official destination
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            GoldRock organizes the fields, documents, safety gates, and next steps.
            The applicant controls protected identifiers, final attestation, and submission.
          </p>
        </div>
        <div className="w-full rounded-xl border bg-muted/30 p-3 sm:w-56">
          <div className="flex justify-between text-xs">
            <span>Handoff gates</span>
            <span>{completedGates}/{plan.gates.length}</span>
          </div>
          <Progress value={gateProgress} className="mt-2" />
        </div>
      </div>

      <Alert className="mb-5 border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>GoldRock has not submitted an application</AlertTitle>
        <AlertDescription>
          A downloaded packet, copied field, or opened portal does not prove enrollment.
          Only the official destination can issue a valid confirmation receipt.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-xl p-1 sm:grid-cols-5">
          <TabsTrigger value="destination" className="py-2.5">
            <Landmark className="mr-2 h-4 w-4" /> Destination
          </TabsTrigger>
          <TabsTrigger value="fields" className="py-2.5">
            <ClipboardCheck className="mr-2 h-4 w-4" /> Fields
          </TabsTrigger>
          <TabsTrigger value="documents" className="py-2.5">
            <FolderLock className="mr-2 h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="timeline" className="py-2.5">
            <FileCheck2 className="mr-2 h-4 w-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="safety" className="py-2.5">
            <ShieldCheck className="mr-2 h-4 w-4" /> Safety gates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="destination" className="mt-5 space-y-4">
          <DestinationCard destination={plan.destination} primary />
          {plan.alternateDestinations.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Additional assistance pathways</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {plan.alternateDestinations.map((destination) => (
                  <DestinationCard key={destination.id} destination={destination} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="fields" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                Portal-ready field map
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Copy one field at a time inside the applicant-controlled portal.
                Sensitive values are blurred until intentionally viewed.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              {plan.fields.map((field) => (
                <FieldTransferRow key={field.key} field={field} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderLock className="h-5 w-5 text-primary" />
                Local document checklist
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Prepare source documents without placing full document images or identifiers
                into the AI conversation.
              </p>
            </CardHeader>
            <CardContent>
              {plan.documents.map((document) => (
                <DocumentRow key={document.id} document={document} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Applicant-controlled submission timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {plan.timeline.map((step, index) => (
                  <div key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                    {index < plan.timeline.length - 1 && (
                      <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-border" />
                    )}
                    <span
                      className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        step.completed
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {step.completed ? <Check className="h-4 w-4" /> : step.order}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{step.title}</p>
                        <Badge variant="outline" className="capitalize">
                          {step.owner.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      <p className="mt-2 text-xs font-medium text-primary">{step.dueLabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Submission safety gates
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {plan.gates.map((gate) => (
                <GateRow key={gate.id} gate={gate} />
              ))}
            </CardContent>
          </Card>

          <div className="mt-4 rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-300">
            <div className="flex items-center gap-2 font-semibold text-white">
              <UserCheck className="h-5 w-5 text-emerald-400" />
              Non-delegable applicant actions
            </div>
            <p className="mt-2">
              The applicant—or a legally authorized representative—must verify identity,
              review transferred fields, accept destination-specific terms, make any plan
              selection, attest to accuracy, and retain the official confirmation.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <p className="mt-5 text-xs leading-5 text-muted-foreground">{plan.disclaimer}</p>
    </div>
  );
}
