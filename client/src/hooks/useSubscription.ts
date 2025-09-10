import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useSubscription() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["/api/subscription-status"],
    retry: false,
  });

  const createSubscription = useMutation({
    mutationFn: async ({ planType, priceId }: { planType: string; priceId?: string }) => {
      const response = await apiRequest("POST", "/api/create-subscription", { planType, priceId });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-status"] });
      toast({
        title: "Subscription Created",
        description: "Your premium subscription is now active!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Subscription Failed",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    subscription,
    isLoading,
    isSubscribed: (subscription as any)?.isSubscribed || false,
    createSubscription,
  };
}