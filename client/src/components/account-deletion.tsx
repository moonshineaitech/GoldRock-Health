import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, ArrowRight, X, Loader2 } from "lucide-react";
import { MobileButton, MobileCard } from "./mobile-layout";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AccountDeletionProps {
  userEmail?: string;
}

export function AccountDeletion({ userEmail }: AccountDeletionProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [step, setStep] = useState<'warning' | 'verify' | 'processing'>('warning');
  const { toast } = useToast();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", "/api/account");
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted.",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete account. Please try again or contact support.",
        variant: "destructive",
      });
      setStep('warning');
    },
  });

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
    setStep('verify');
  };

  const handleConfirmDelete = () => {
    if (confirmationText.toLowerCase() !== 'delete') {
      toast({
        title: "Verification Failed",
        description: "Please type DELETE to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    setStep('processing');
    deleteAccountMutation.mutate();
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationText("");
    setStep('warning');
  };

  return (
    <>
      <MobileCard className="bg-red-50 border-red-200">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-900 mb-1">Delete Account</h3>
              <p className="text-sm text-red-700">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>

          <MobileButton
            variant="ghost"
            className="w-full border border-red-300 text-red-700 hover:bg-red-100"
            onClick={handleDeleteRequest}
            data-testid="button-delete-account"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </MobileButton>
        </div>
      </MobileCard>

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            data-testid="account-deletion-modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                {step === 'verify' && (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Confirm Account Deletion</h2>
                          <p className="text-sm text-gray-600">This cannot be undone</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        data-testid="button-cancel-deletion"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                        <h3 className="font-bold text-red-900 mb-2">The following will be permanently deleted:</h3>
                        <ul className="text-sm text-red-800 space-y-1">
                          <li>• Your account profile and personal information</li>
                          <li>• All uploaded medical bills and analysis results</li>
                          <li>• Training progress, achievements, and statistics</li>
                          <li>• Payment methods and subscription data</li>
                          <li>• All chat history and AI interactions</li>
                        </ul>
                      </div>

                      {userEmail && (
                        <div className="bg-gray-100 rounded-2xl p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Account:</strong> {userEmail}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Type <strong>DELETE</strong> to confirm:
                        </label>
                        <Input
                          type="text"
                          value={confirmationText}
                          onChange={(e) => setConfirmationText(e.target.value)}
                          placeholder="DELETE"
                          className="text-center font-mono text-lg"
                          data-testid="input-delete-confirmation"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <MobileButton
                        variant="ghost"
                        className="flex-1 border border-gray-300"
                        onClick={handleCancel}
                        data-testid="button-cancel"
                      >
                        Cancel
                      </MobileButton>
                      <MobileButton
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleConfirmDelete}
                        disabled={confirmationText.toLowerCase() !== 'delete'}
                        data-testid="button-confirm-delete"
                      >
                        Delete Forever
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </MobileButton>
                    </div>
                  </>
                )}

                {step === 'processing' && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-red-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Deleting Your Account...</h3>
                    <p className="text-sm text-gray-600">
                      Please wait while we securely delete all your data.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
