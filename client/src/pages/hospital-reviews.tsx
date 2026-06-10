import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Building2, 
  Star, 
  MessageSquare, 
  ThumbsUp,
  DollarSign,
  Phone,
  Shield,
  Search,
  Plus,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEOHead } from "@/components/seo-head";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HospitalReview {
  id: string;
  hospitalName: string;
  overallRating: number;
  billingTransparency: number;
  responsiveness: number;
  financialAssistance: number;
  reviewTitle: string;
  reviewText: string;
  procedureType: string;
  createdAt: string;
}

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${star <= rating ? 'text-gold fill-current' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

function RatingInput({ 
  value, 
  onChange, 
  label 
}: { 
  value: number; 
  onChange: (v: number) => void; 
  label: string;
}) {
  return (
    <div>
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= value ? 'text-gold fill-current' : 'text-muted-foreground hover:text-gold'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HospitalReviews() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    hospitalName: "",
    overallRating: 0,
    billingTransparency: 0,
    responsiveness: 0,
    financialAssistance: 0,
    reviewTitle: "",
    reviewText: "",
    procedureType: ""
  });

  const { data: reviews, isLoading } = useQuery<HospitalReview[]>({
    queryKey: ['/api/hospital-reviews'],
  });

  const submitMutation = useMutation({
    mutationFn: async (review: typeof newReview) => {
      return apiRequest('/api/hospital-reviews', {
        method: 'POST',
        body: JSON.stringify(review)
      });
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted for moderation.",
      });
      setIsDialogOpen(false);
      setNewReview({
        hospitalName: "",
        overallRating: 0,
        billingTransparency: 0,
        responsiveness: 0,
        financialAssistance: 0,
        reviewTitle: "",
        reviewText: "",
        procedureType: ""
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hospital-reviews'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.hospitalName || !newReview.overallRating || !newReview.reviewText) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    submitMutation.mutate(newReview);
  };

  const filteredReviews = reviews?.filter(review =>
    review.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.reviewTitle.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <>
      <SEOHead
        title="Hospital Billing Reviews - Rate Hospital Billing Practices | GoldRock Health"
        description="Read and share reviews of hospital billing practices. Find out which hospitals have transparent billing, good financial assistance, and responsive billing departments."
        keywords="hospital billing reviews, hospital ratings, medical billing complaints, hospital financial assistance, billing transparency"
        canonicalUrl="https://goldrockhealth.com/hospital-reviews"
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg, var(--gold-soft), var(--gold-deep))' }}
              >
                <Building2 className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Hospital Billing <span className="text-gold">Reviews</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Share your experience and help others find hospitals with fair, transparent billing practices.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                data-testid="input-search-reviews"
                placeholder="Search hospitals or reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-write-review" className="bg-primary text-primary-foreground hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" /> Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-popover border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Write a Hospital Billing Review</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Share your experience with a hospital's billing practices to help others.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="hospitalName" className="text-muted-foreground">Hospital Name *</Label>
                    <Input
                      id="hospitalName"
                      data-testid="input-hospital-name"
                      placeholder="Enter hospital name"
                      value={newReview.hospitalName}
                      onChange={(e) => setNewReview({ ...newReview, hospitalName: e.target.value })}
                      className="mt-1 bg-card border-border text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <RatingInput
                      value={newReview.overallRating}
                      onChange={(v) => setNewReview({ ...newReview, overallRating: v })}
                      label="Overall Rating *"
                    />
                    <div>
                      <Label className="text-muted-foreground text-sm">Procedure Type</Label>
                      <Select
                        value={newReview.procedureType}
                        onValueChange={(v) => setNewReview({ ...newReview, procedureType: v })}
                      >
                        <SelectTrigger className="mt-1 bg-card border-border text-foreground">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency">Emergency Room</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="outpatient">Outpatient</SelectItem>
                          <SelectItem value="imaging">Imaging/Labs</SelectItem>
                          <SelectItem value="maternity">Maternity</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <RatingInput
                      value={newReview.billingTransparency}
                      onChange={(v) => setNewReview({ ...newReview, billingTransparency: v })}
                      label="Billing Transparency"
                    />
                    <RatingInput
                      value={newReview.responsiveness}
                      onChange={(v) => setNewReview({ ...newReview, responsiveness: v })}
                      label="Responsiveness"
                    />
                    <RatingInput
                      value={newReview.financialAssistance}
                      onChange={(v) => setNewReview({ ...newReview, financialAssistance: v })}
                      label="Financial Help"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reviewTitle" className="text-muted-foreground">Review Title</Label>
                    <Input
                      id="reviewTitle"
                      data-testid="input-review-title"
                      placeholder="Summarize your experience"
                      value={newReview.reviewTitle}
                      onChange={(e) => setNewReview({ ...newReview, reviewTitle: e.target.value })}
                      className="mt-1 bg-card border-border text-foreground"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reviewText" className="text-muted-foreground">Your Review *</Label>
                    <Textarea
                      id="reviewText"
                      data-testid="textarea-review"
                      placeholder="Describe your experience with billing..."
                      value={newReview.reviewText}
                      onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                      className="mt-1 bg-card border-border text-foreground min-h-[120px]"
                    />
                  </div>

                  <Button 
                    type="submit"
                    data-testid="button-submit-review"
                    className="w-full bg-primary text-primary-foreground hover:opacity-90"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <Card className="luxury-card">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-foreground font-medium">Billing Transparency</div>
                <div className="text-sm text-muted-foreground">Were charges clear and itemized?</div>
              </CardContent>
            </Card>
            <Card className="luxury-card">
              <CardContent className="p-4 text-center">
                <Phone className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-foreground font-medium">Responsiveness</div>
                <div className="text-sm text-muted-foreground">Did they answer your questions?</div>
              </CardContent>
            </Card>
            <Card className="luxury-card">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-foreground font-medium">Financial Assistance</div>
                <div className="text-sm text-muted-foreground">Did they offer payment options?</div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="luxury-card animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="luxury-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-foreground flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            {review.hospitalName}
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-2">
                            <StarRating rating={review.overallRating} />
                            {review.procedureType && (
                              <Badge variant="outline" className="text-muted-foreground border-border">
                                {review.procedureType}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {review.reviewTitle && (
                        <h3 className="text-foreground font-medium mb-2">{review.reviewTitle}</h3>
                      )}
                      <p className="text-muted-foreground mb-4">{review.reviewText}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        {review.billingTransparency > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Transparency:</span>
                            <StarRating rating={review.billingTransparency} size="sm" />
                          </div>
                        )}
                        {review.responsiveness > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Responsiveness:</span>
                            <StarRating rating={review.responsiveness} size="sm" />
                          </div>
                        )}
                        {review.financialAssistance > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Financial Help:</span>
                            <StarRating rating={review.financialAssistance} size="sm" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">Be the first to share your experience!</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-primary text-primary-foreground hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Write a Review
                  </Button>
                </div>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 max-w-4xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-foreground font-semibold mb-2">Review Guidelines</h3>
                <p className="text-muted-foreground text-sm">
                  Reviews are moderated before publishing. Please focus on your billing experience, 
                  not medical care quality. Avoid sharing personal health information or identifying details 
                  about staff members.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
