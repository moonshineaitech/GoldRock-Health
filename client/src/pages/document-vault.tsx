import { useState, useCallback } from "react";
import { useHealthcareConsent, HealthcareConsentModal } from "@/components/healthcare-consent-modal";
import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Upload, Trash2, Download, Eye, Search, Filter,
  Shield, Lock, Clock, Image, File, AlertCircle, CheckCircle2,
  FolderOpen, Tag, Loader2, X, Plus, StickyNote
} from "lucide-react";
import type { BillDocument } from "@shared/schema";

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  bill: { label: "Medical Bill", color: "bg-secondary text-muted-foreground", icon: FileText },
  eob: { label: "EOB", color: "bg-secondary text-muted-foreground", icon: File },
  insurance: { label: "Insurance", color: "bg-secondary text-muted-foreground", icon: Shield },
  receipt: { label: "Receipt", color: "bg-secondary text-muted-foreground", icon: Tag },
  correspondence: { label: "Letter", color: "bg-secondary text-muted-foreground", icon: StickyNote },
  other: { label: "Other", color: "bg-secondary text-muted-foreground", icon: FolderOpen },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"
  });
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return Image;
  if (fileType === "application/pdf") return FileText;
  return File;
}

function UploadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState("bill");
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Only JPEG, PNG, WebP images and PDF files are allowed.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(10);

    try {
      setUploadProgress(20);
      const urlResponse = await apiRequest("POST", "/api/documents/upload-url", {
        name: selectedFile.name,
        size: selectedFile.size,
        contentType: selectedFile.type,
      });
      const { uploadURL, objectPath } = urlResponse as any;

      setUploadProgress(40);
      await fetch(uploadURL, {
        method: "PUT",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });

      setUploadProgress(70);
      await apiRequest("POST", "/api/documents", {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: String(selectedFile.size),
        objectPath,
        category,
        notes: notes || null,
      });

      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Document uploaded", description: `${selectedFile.name} has been securely stored.` });
      setSelectedFile(null);
      setCategory("bill");
      setNotes("");
      onClose();
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <Upload className="w-5 h-5 text-gold" />
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
            {selectedFile ? (
              <div className="flex items-center gap-3">
                {(() => { const Icon = getFileIcon(selectedFile.type); return <Icon className="w-8 h-8 text-gold" />; })()}
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm truncate text-foreground">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Click to select a file</p>
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP, or PDF (max 10MB)</p>
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.pdf" onChange={handleFileSelect} />
              </label>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this document..."
              className="mt-1"
              rows={2}
            />
          </div>

          {uploading && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {uploadProgress < 40 ? "Preparing secure upload..." : uploadProgress < 70 ? "Uploading to secure storage..." : "Saving document..."}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <Lock className="w-4 h-4 text-gold flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your documents are encrypted and stored securely. Only you can access them.
            </p>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4 mr-2" /> Upload Securely</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DocumentCard({ doc, onDelete, onPreview }: {
  doc: BillDocument;
  onDelete: (id: string) => void;
  onPreview: (doc: BillDocument) => void;
}) {
  const config = CATEGORY_CONFIG[doc.category || "other"] || CATEGORY_CONFIG.other;
  const FileIcon = getFileIcon(doc.fileType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="luxury-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <FileIcon className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate text-foreground">{doc.fileName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${config.color}`}>
                  {config.label}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{formatFileSize(doc.fileSize)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onPreview(doc)}>
                <Eye className="w-3.5 h-3.5" />
              </Button>
              <a href={`/api/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </a>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => onDelete(doc.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {doc.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{doc.notes}</p>
          )}

          <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            {doc.uploadedAt ? formatDate(doc.uploadedAt) : "Unknown date"}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PreviewDialog({ doc, open, onClose }: { doc: BillDocument | null; open: boolean; onClose: () => void }) {
  if (!doc) return null;

  const isImage = doc.fileType.startsWith("image/");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-serif">
            <Eye className="w-4 h-4 text-gold" />
            {doc.fileName}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh] rounded-lg bg-secondary">
          {isImage ? (
            <img
              src={`/api/documents/${doc.id}/download`}
              alt={doc.fileName}
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground">{doc.fileName}</p>
              <p className="text-xs text-muted-foreground mt-1">PDF preview not available in browser</p>
              <a href={`/api/documents/${doc.id}/download`} target="_blank" rel="noopener noreferrer">
                <Button className="mt-4" variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" /> Open PDF
                </Button>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DocumentVault() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const { showModal, setShowModal, giveConsent, requestConsent } = useHealthcareConsent();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [previewDoc, setPreviewDoc] = useState<BillDocument | null>(null);

  const { data: documents = [], isLoading } = useQuery<BillDocument[]>({
    queryKey: ["/api/documents"],
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({ title: "Document deleted", description: "The document has been permanently removed." });
    },
    onError: () => {
      toast({ title: "Delete failed", description: "Could not delete the document. Please try again.", variant: "destructive" });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this document? This cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = documents.filter((doc) => {
    const matchesSearch = !searchQuery ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: documents.length,
    totalSize: documents.reduce((sum, d) => sum + d.fileSize, 0),
    categories: Object.entries(
      documents.reduce((acc, d) => {
        const cat = d.category || "other";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ),
  };

  if (authLoading) {
    return (
      <MobileLayout title="Document Vault" showBackButton>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return (
      <MobileLayout title="Document Vault" showBackButton>
        <div className="text-center py-16 px-6">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold mb-2 text-foreground">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Sign in to securely upload and manage your medical documents.</p>
          <Button onClick={() => window.location.href = "/api/login"}>
            Sign In
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Document Vault" showBackButton>
      <div className="p-4 space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="luxury-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-xl font-serif font-bold flex items-center gap-2 text-foreground">
                  <Shield className="w-5 h-5 text-gold" /> Document Vault
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Securely store and manage your medical documents</p>
              </div>
              <Button
                onClick={() => {
                  if (requestConsent()) {
                    setShowUpload(true);
                  }
                }}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" /> Upload
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-[10px] text-muted-foreground">Documents</p>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{formatFileSize(stats.totalSize)}</p>
                <p className="text-[10px] text-muted-foreground">Storage Used</p>
              </div>
              <div className="bg-secondary rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.categories.length}</p>
                <p className="text-[10px] text-muted-foreground">Categories</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[120px]">
              <Filter className="w-3.5 h-3.5 mr-1" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
          <Shield className="w-4 h-4 text-gold flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            All documents are encrypted at rest and in transit. Only you can view your files.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
              {documents.length === 0 ? "No documents yet" : "No matching documents"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {documents.length === 0
                ? "Upload your first medical bill, EOB, or insurance document to get started."
                : "Try adjusting your search or filter."}
            </p>
            {documents.length === 0 && (
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" /> Upload Your First Document
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map(doc => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  onDelete={handleDelete}
                  onPreview={setPreviewDoc}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        <UploadDialog open={showUpload} onClose={() => setShowUpload(false)} />
        <PreviewDialog doc={previewDoc} open={!!previewDoc} onClose={() => setPreviewDoc(null)} />
        <HealthcareConsentModal
          open={showModal}
          onAccept={() => { giveConsent(); setShowUpload(true); }}
          onClose={() => setShowModal(false)}
        />
      </div>
    </MobileLayout>
  );
}
