import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Plus, 
  Save, 
  Trash2, 
  Tag,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Beaker,
  Target,
  Dna,
  Pill,
  Loader2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResearchNotebookProps {
  predictionId: number;
}

interface LabNote {
  id: number;
  title: string;
  content: string | null;
  noteType: "observation" | "hypothesis" | "result" | "protocol" | "todo";
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

const NOTE_TYPES = [
  { id: "observation", label: "Observation", icon: Beaker, color: "bg-blue-500/20 text-blue-400" },
  { id: "hypothesis", label: "Hypothesis", icon: Target, color: "bg-purple-500/20 text-purple-400" },
  { id: "result", label: "Result", icon: Dna, color: "bg-green-500/20 text-green-400" },
  { id: "protocol", label: "Protocol", icon: FileText, color: "bg-orange-500/20 text-orange-400" },
  { id: "todo", label: "To-Do", icon: Pill, color: "bg-pink-500/20 text-pink-400" },
];

export default function ResearchNotebook({ predictionId }: ResearchNotebookProps) {
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    noteType: "observation" as LabNote["noteType"],
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadNotes();
  }, [predictionId]);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/lab/notes?predictionId=${predictionId}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        if (data.length > 0) {
          setExpandedNotes(new Set([data[0].id]));
        }
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title.trim()) return;
    
    setIsSaving(true);
    try {
      const response = await fetch("/api/lab/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predictionId,
          title: newNote.title,
          content: newNote.content || null,
          noteType: newNote.noteType,
          tags: newNote.tags.length > 0 ? newNote.tags : null,
        }),
      });
      
      if (response.ok) {
        const savedNote = await response.json();
        setNotes(prev => [savedNote, ...prev]);
        setNewNote({ title: "", content: "", noteType: "observation", tags: [] });
        setIsCreating(false);
        setExpandedNotes(prev => new Set([...prev, savedNote.id]));
      }
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      const response = await fetch(`/api/lab/notes/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setNotes(prev => prev.filter(n => n.id !== id));
        setExpandedNotes(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newNote.tags.includes(tagInput.trim())) {
      setNewNote(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const toggleExpanded = (id: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const getNoteTypeConfig = (type: LabNote["noteType"]) => {
    return NOTE_TYPES.find(t => t.id === type) || NOTE_TYPES[0];
  };

  const handleExportPDF = () => {
    const content = notes.map(note => 
      `# ${note.title}\nType: ${note.noteType}\nDate: ${formatDate(note.createdAt)}\n\n${note.content || ''}\n\n---\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-notes-${predictionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4" data-testid="research-notebook">
      <div className="luna-card p-4 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Research Notebook</h3>
              <p className="text-xs text-white/50">Notes are saved automatically to the database</p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            size="sm"
            className={isCreating ? "bg-white/10" : "bg-amber-500 hover:bg-amber-600"}
            data-testid="btn-new-note"
          >
            {isCreating ? (
              <>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-1" />
                New Note
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 mb-4 space-y-3">
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Note title..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:border-amber-500 focus:outline-none"
                  data-testid="input-note-title"
                />
                
                <div className="flex gap-1 flex-wrap">
                  {NOTE_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setNewNote(prev => ({ ...prev, noteType: type.id as LabNote["noteType"] }))}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${
                        newNote.noteType === type.id
                          ? type.color + " ring-1 ring-white/20"
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                    >
                      <type.icon className="w-3 h-3" />
                      {type.label}
                    </button>
                  ))}
                </div>
                
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your observations, hypotheses, or results..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:border-amber-500 focus:outline-none resize-none"
                  data-testid="input-note-content"
                />
                
                <div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tags..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/30 focus:border-amber-500 focus:outline-none"
                    />
                    <Button
                      onClick={handleAddTag}
                      size="sm"
                      variant="outline"
                      className="border-white/10"
                    >
                      <Tag className="w-3 h-3" />
                    </Button>
                  </div>
                  {newNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {newNote.tags.map(tag => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-xs"
                        >
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleCreateNote}
                  disabled={!newNote.title.trim() || isSaving}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                  data-testid="btn-save-note"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Note
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:border-primary focus:outline-none"
            data-testid="input-search-notes"
          />
        </div>

        <div className="text-xs text-white/40 mb-2">
          {isLoading ? "Loading..." : `${filteredNotes.length} note${filteredNotes.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      {isLoading ? (
        <div className="luna-card p-8 rounded-xl text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-2" />
          <p className="text-white/50 text-sm">Loading notes...</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="luna-card p-8 rounded-xl text-center">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">No notes yet. Create your first research note!</p>
            </div>
          ) : (
            filteredNotes.map((note, i) => {
              const typeConfig = getNoteTypeConfig(note.noteType);
              const isExpanded = expandedNotes.has(note.id);
              
              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="luna-card rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(note.id)}
                    className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeConfig.color}`}>
                        <typeConfig.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-white font-medium">{note.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                          <Clock className="w-3 h-3" />
                          {formatDate(note.createdAt)}
                          {(note.tags || []).length > 0 && (
                            <>
                              <span>•</span>
                              <span>{(note.tags || []).length} tag{(note.tags || []).length !== 1 ? 's' : ''}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-white/40" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-3">
                          <div className="text-sm text-white/70 whitespace-pre-wrap bg-white/5 rounded-lg p-3">
                            {note.content || <span className="text-white/30 italic">No content</span>}
                          </div>
                          
                          {(note.tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {(note.tags || []).map(tag => (
                                <span
                                  key={tag}
                                  className="bg-white/10 text-white/60 px-2 py-0.5 rounded text-[10px]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      <div className="luna-card p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/40 mb-1">Session Summary</div>
            <div className="text-sm text-white">
              {notes.length} notes • Prediction #{predictionId}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-xs"
            onClick={handleExportPDF}
            data-testid="btn-export-notebook"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
