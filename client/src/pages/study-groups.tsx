import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Plus,
  Search,
  Settings,
  Trophy,
  MessageCircle,
  BookOpen,
  Clock,
  Crown,
  Shield,
  User,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import type { StudyGroup, StudyGroupMember } from "@shared/schema";

interface CreateGroupForm {
  name: string;
  description: string;
  specialty: string;
  maxMembers: number;
  isPrivate: boolean;
  tags: string[];
}

export default function StudyGroupsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [createForm, setCreateForm] = useState<CreateGroupForm>({
    name: "",
    description: "",
    specialty: "",
    maxMembers: 20,
    isPrivate: false,
    tags: []
  });

  // Fetch study groups
  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ["/api/study-groups", filterSpecialty, searchTerm],
    enabled: !!user
  });

  // Create study group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (data: CreateGroupForm) => {
      return await apiRequest("POST", "/api/study-groups", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-groups"] });
      setShowCreateDialog(false);
      setCreateForm({
        name: "",
        description: "",
        specialty: "",
        maxMembers: 20,
        isPrivate: false,
        tags: []
      });
    }
  });

  // Join study group mutation
  const joinGroupMutation = useMutation({
    mutationFn: async ({ groupId, inviteCode }: { groupId: string; inviteCode?: string }) => {
      return await apiRequest("POST", `/api/study-groups/${groupId}/join`, { inviteCode });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/study-groups"] });
    }
  });

  const filteredGroups = groups.filter((group: StudyGroup) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === "all" || group.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleCreateGroup = () => {
    createGroupMutation.mutate(createForm);
  };

  const handleJoinGroup = (groupId: string, isPrivate: boolean) => {
    if (isPrivate && !joinCode) {
      // Handle private group join with invite code
      const code = prompt("Enter invite code:");
      if (code) {
        joinGroupMutation.mutate({ groupId, inviteCode: code });
      }
    } else {
      joinGroupMutation.mutate({ groupId });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="w-4 h-4 text-yellow-500" />;
      case "moderator": return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const specialties = [
    "Cardiology", "Neurology", "Emergency Medicine", "Internal Medicine",
    "Surgery", "Pediatrics", "Radiology", "Anesthesiology", "Psychiatry"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-testid="study-groups-page">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold">Study Groups</h1>
              </div>
              <Badge variant="outline" className="text-xs">
                Collaborative Learning
              </Badge>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-group">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Group Name</label>
                    <Input
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter group name"
                      data-testid="input-group-name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Description</label>
                    <Textarea
                      value={createForm.description}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your study group"
                      rows={3}
                      data-testid="textarea-group-description"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Specialty</label>
                    <Select 
                      value={createForm.specialty} 
                      onValueChange={(value) => setCreateForm(prev => ({ ...prev, specialty: value }))}
                    >
                      <SelectTrigger data-testid="select-group-specialty">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-1">Max Members</label>
                    <Input
                      type="number"
                      value={createForm.maxMembers}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                      min={5}
                      max={100}
                      data-testid="input-max-members"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="private"
                      checked={createForm.isPrivate}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      data-testid="checkbox-private"
                    />
                    <label htmlFor="private" className="text-sm">Private Group (invite only)</label>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateGroup}
                      disabled={!createForm.name || !createForm.specialty || createGroupMutation.isPending}
                      className="flex-1"
                      data-testid="button-submit-create-group"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-groups"
                />
              </div>
            </div>
            
            <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
              <SelectTrigger className="w-48" data-testid="select-filter-specialty">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Study Groups Grid */}
        {groupsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
                  <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group: StudyGroup, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`group-card-${group.id}`}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{group.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {group.specialty}
                          </Badge>
                          {group.isPrivate && (
                            <Badge variant="secondary" className="text-xs">
                              Private
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{group.currentMembers}/{group.maxMembers}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {group.description}
                    </p>

                    {/* Group Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-3 h-3 text-yellow-500" />
                        <span>Active Challenges</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        <span>Weekly Sessions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-green-500" />
                        <span>Team Goals</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-purple-500" />
                        <span>Study Streaks</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {group.tags && group.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {group.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {group.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{group.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleJoinGroup(group.id, group.isPrivate)}
                        disabled={group.currentMembers >= group.maxMembers || joinGroupMutation.isPending}
                        className="flex-1"
                        data-testid={`button-join-group-${group.id}`}
                      >
                        {group.currentMembers >= group.maxMembers ? "Full" : "Join Group"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {filteredGroups.length === 0 && !groupsLoading && (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No study groups found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to create a study group for your specialty
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Group
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}