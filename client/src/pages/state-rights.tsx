import { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Shield, MapPin, Search, Scale, FileText, AlertTriangle,
  CheckCircle2, ExternalLink, Phone, BookOpen, Gavel,
  Building2, Heart, DollarSign, Clock
} from "lucide-react";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
];

const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",
  DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",
  KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",
  MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",
  NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",
  TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",
  WY:"Wyoming",DC:"District of Columbia"
};

const CATEGORY_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  surprise_billing: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  credit_reporting: { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  collections: { icon: Gavel, color: "text-purple-600", bg: "bg-purple-50" },
  charity_care: { icon: Heart, color: "text-pink-600", bg: "bg-pink-50" },
  price_transparency: { icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
  statute_of_limitations: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  patient_rights: { icon: Shield, color: "text-indigo-600", bg: "bg-indigo-50" },
  insurance_protections: { icon: Building2, color: "text-teal-600", bg: "bg-teal-50" },
};

function RightCard({ right }: { right: any }) {
  const config = CATEGORY_CONFIG[right.category] || CATEGORY_CONFIG.patient_rights;
  const Icon = config.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <AccordionItem value={right.id} className="border rounded-xl mb-3 overflow-hidden">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-start gap-3 text-left">
            <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">{right.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px]">{right.category.replace(/_/g, ' ')}</Badge>
                {right.legalCitation && <span className="text-[10px] text-gray-400">{right.legalCitation}</span>}
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <p className="text-sm text-gray-600 mb-3">{right.description}</p>

          {right.keyProtections?.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1"><Shield className="w-3 h-3" />Key Protections</h4>
              <ul className="space-y-1">
                {right.keyProtections.map((p: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />{p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {right.actionSteps?.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1"><FileText className="w-3 h-3" />What You Can Do</h4>
              <ol className="space-y-1">
                {right.actionSteps.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{i+1}</span>{s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {right.resources?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1"><BookOpen className="w-3 h-3" />Resources</h4>
              <div className="space-y-1">
                {right.resources.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><ExternalLink className="w-3 h-3" />{r.name}</a>}
                    {!r.url && <span className="text-gray-600">{r.name}</span>}
                    {r.phone && <span className="text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
}

export default function StateRights() {
  const [selectedState, setSelectedState] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: rights = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/state-rights", selectedState],
    enabled: !!selectedState,
  });

  const { data: federalRights = [] } = useQuery<any[]>({
    queryKey: ["/api/state-rights/federal"],
  });

  const filteredRights = categoryFilter === "all" ? rights : rights.filter((r: any) => r.category === categoryFilter);
  const categories = [...new Set(rights.map((r: any) => r.category))];

  return (
    <MobileLayout title="Your Legal Rights" >
      <div className="space-y-6 pb-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <Scale className="w-8 h-8 mb-2 text-indigo-200" />
          <h2 className="text-xl font-bold mb-1">Know Your Rights</h2>
          <p className="text-indigo-200 text-sm">Every state has different laws protecting you from unfair medical billing. Select your state to see what protections apply to you.</p>
        </motion.div>

        <div className="flex gap-2">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="flex-1 bg-white">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s} value={s}>{STATE_NAMES[s]} ({s})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {categories.length > 0 && (
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c.replace(/_/g, ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {!selectedState ? (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">Select Your State</h3>
              <p className="text-sm text-gray-500">Choose your state above to see the specific medical debt protections that apply to you</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{STATE_NAMES[selectedState]}</h3>
              <Badge className="bg-indigo-100 text-indigo-700">{filteredRights.length} protections</Badge>
            </div>

            {filteredRights.length === 0 ? (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="py-6 text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto text-amber-400 mb-2" />
                  <h3 className="font-semibold text-amber-800 mb-1">Limited State Data</h3>
                  <p className="text-sm text-amber-600">We're still building our database for {STATE_NAMES[selectedState]}. Federal protections below still apply to you.</p>
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple">
                {filteredRights.map((right: any) => (
                  <RightCard key={right.id} right={right} />
                ))}
              </Accordion>
            )}
          </>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />Federal Protections (Apply Everywhere)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: "No Surprises Act (2022)", desc: "Protects against surprise medical bills from out-of-network providers at in-network facilities", icon: AlertTriangle },
                { title: "Fair Debt Collection Practices Act", desc: "Limits how debt collectors can contact you and what they can say", icon: Gavel },
                { title: "Medical Debt Credit Reporting (2023)", desc: "Medical debts under $500 cannot appear on credit reports; paid medical debts must be removed", icon: FileText },
                { title: "EMTALA", desc: "Emergency rooms must treat you regardless of ability to pay", icon: Heart },
                { title: "Hospital Price Transparency Rule", desc: "Hospitals must publish their prices publicly, including negotiated rates with insurers", icon: DollarSign },
                { title: "Good Faith Estimate", desc: "Uninsured patients have the right to receive a cost estimate before scheduled services", icon: Scale },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <f.icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{f.title}</h4>
                    <p className="text-xs text-gray-600">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}