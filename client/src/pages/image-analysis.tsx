import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { MedicalImageViewer } from "@/components/medical-image-viewer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Brain,
  Target,
  Clock,
  Trophy,
  Zap,
  Eye,
  BookOpen,
  Award,
  TrendingUp,
  BarChart3
} from "lucide-react";
import type { MedicalImage, ImageAnalysisProgress } from "@shared/schema";

interface Finding {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  userDescription: string;
  confidence: number;
}

export default function ImageAnalysisPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<MedicalImage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(false);

  // Fetch medical images
  const { data: images = [], isLoading: imagesLoading } = useQuery({
    queryKey: ["/api/medical-images", filterType, filterDifficulty],
    enabled: !!user
  });

  // Fetch user's image analysis progress
  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ["/api/image-analysis-progress"],
    enabled: !!user
  });

  // Submit image analysis mutation
  const submitAnalysisMutation = useMutation({
    mutationFn: async (data: {
      imageId: string;
      findings: Finding[];
      diagnosis: string;
      confidence: number;
    }) => {
      return await apiRequest("POST", "/api/image-analysis-progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/image-analysis-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      setSelectedImage(null);
    }
  });

  // Filter images based on search and filters
  const filteredImages = images.filter((image: MedicalImage) => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.bodyRegion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.imageType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || image.imageType === filterType;
    const matchesDifficulty = filterDifficulty === "all" || image.difficulty.toString() === filterDifficulty;
    
    const isCompleted = progress.some((p: ImageAnalysisProgress) => 
      p.imageId === image.id && p.completed
    );
    
    if (showCompleted) {
      return matchesSearch && matchesType && matchesDifficulty && isCompleted;
    } else {
      return matchesSearch && matchesType && matchesDifficulty && !isCompleted;
    }
  });

  // Calculate stats
  const completedCount = progress.filter((p: ImageAnalysisProgress) => p.completed).length;
  const averageAccuracy = progress.length > 0 
    ? progress.reduce((acc: number, p: ImageAnalysisProgress) => acc + (p.accuracy || 0), 0) / progress.length
    : 0;
  const totalTimeSpent = progress.reduce((acc: number, p: ImageAnalysisProgress) => acc + (p.timeElapsed || 0), 0);

  const handleImageComplete = (findings: Finding[], diagnosis: string, confidence: number) => {
    if (!selectedImage) return;

    submitAnalysisMutation.mutate({
      imageId: selectedImage.id,
      findings,
      diagnosis,
      confidence
    });
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 2: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case 3: return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Beginner";
      case 2: return "Intermediate";
      case 3: return "Advanced";
      default: return "Unknown";
    }
  };

  const getImageProgress = (imageId: string) => {
    return progress.find((p: ImageAnalysisProgress) => p.imageId === imageId);
  };

  if (selectedImage) {
    return (
      <div className="h-screen">
        <MedicalImageViewer
          image={selectedImage}
          onComplete={handleImageComplete}
          showHints={true}
          timeLimit={30} // 30 minutes
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" data-testid="image-analysis-page">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold">Medical Image Analysis</h1>
              </div>
              <Badge variant="outline" className="text-xs">
                Radiology Training
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCompleted(!showCompleted)}
                data-testid="button-toggle-completed"
              >
                {showCompleted ? "Show Available" : "Show Completed"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedCount}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Accuracy</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(averageAccuracy)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(totalTimeSpent / 3600)}h
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {images.length - completedCount}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title, body region, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48" data-testid="select-image-type">
                <SelectValue placeholder="Image Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="xray">X-Ray</SelectItem>
                <SelectItem value="ct">CT Scan</SelectItem>
                <SelectItem value="mri">MRI</SelectItem>
                <SelectItem value="ultrasound">Ultrasound</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-48" data-testid="select-difficulty">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1">Beginner</SelectItem>
                <SelectItem value="2">Intermediate</SelectItem>
                <SelectItem value="3">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Image Grid */}
        {imagesLoading || progressLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image: MedicalImage, index) => {
                const imageProgress = getImageProgress(image.id);
                const isCompleted = imageProgress?.completed || false;

                return (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    data-testid={`image-card-${image.id}`}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div 
                        className="relative"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.thumbnailUrl || image.imageUrl}
                          alt={image.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          data-testid={`image-thumbnail-${image.id}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {image.imageType.toUpperCase()}
                          </Badge>
                          <Badge 
                            className={`text-xs ${getDifficultyColor(image.difficulty)}`}
                          >
                            {getDifficultyText(image.difficulty)}
                          </Badge>
                        </div>

                        {/* Completion Status */}
                        {isCompleted && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-green-600 text-white">
                              <Trophy className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                        )}

                        {/* Quick Stats */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-white font-medium text-sm mb-1 truncate">
                            {image.title}
                          </h3>
                          <div className="flex items-center justify-between text-white/80 text-xs">
                            <span>{image.bodyRegion}</span>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {image.keyFindings.length}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                30min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {image.description}
                        </p>

                        {/* Progress for completed images */}
                        {isCompleted && imageProgress && (
                          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                              <span>Accuracy:</span>
                              <span className="font-medium">
                                {Math.round(imageProgress.accuracy || 0)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Time:</span>
                              <span className="font-medium">
                                {Math.round((imageProgress.timeElapsed || 0) / 60)}min
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Score:</span>
                              <span className="font-medium">
                                {imageProgress.score || 0}pts
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Learning Objectives */}
                        {!isCompleted && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Learning Objectives:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {image.learningObjectives.slice(0, 2).map((objective, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {objective}
                                </Badge>
                              ))}
                              {image.learningObjectives.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{image.learningObjectives.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full mt-4"
                          onClick={() => setSelectedImage(image)}
                          data-testid={`button-start-analysis-${image.id}`}
                        >
                          {isCompleted ? (
                            <>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Review Analysis
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Start Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {filteredImages.length === 0 && !imagesLoading && !progressLoading && (
          <Card className="p-12 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No images found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}