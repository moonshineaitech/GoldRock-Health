import { useState, useEffect } from "react";
import { Wifi, WifiOff, CloudOff, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { offlineService } from "@/lib/offline-service";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueStatus, setQueueStatus] = useState({ pending: 0, actions: [] });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      setIsOnline(offlineService.getOnlineStatus());
      setQueueStatus(offlineService.getQueueStatus());
    };

    checkStatus();

    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);

    // Check every 5 seconds for queue updates
    const interval = setInterval(checkStatus, 5000);

    return () => {
      window.removeEventListener('online', checkStatus);
      window.removeEventListener('offline', checkStatus);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && queueStatus.pending === 0) {
    return null; // Don't show anything when online and no pending actions
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-4 pt-2">
          <motion.div
            className={`pointer-events-auto rounded-2xl shadow-xl border backdrop-blur-xl ${
              isOnline
                ? 'bg-blue-500/95 border-blue-400/50'
                : 'bg-amber-500/95 border-amber-400/50'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="px-4 py-3 flex items-center justify-between cursor-pointer">
              <div className="flex items-center space-x-3">
                {isOnline ? (
                  <Wifi className="h-5 w-5 text-white" />
                ) : (
                  <WifiOff className="h-5 w-5 text-white" />
                )}
                <div className="text-white">
                  <div className="font-semibold text-sm">
                    {isOnline ? 'Back Online' : 'Offline Mode'}
                  </div>
                  <div className="text-xs opacity-90">
                    {isOnline
                      ? queueStatus.pending > 0
                        ? `Syncing ${queueStatus.pending} pending action${queueStatus.pending > 1 ? 's' : ''}...`
                        : 'All data synced'
                      : 'Your data will sync when connection is restored'}
                  </div>
                </div>
              </div>
              
              {queueStatus.pending > 0 && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="bg-white/20 p-2 rounded-full"
                >
                  <RefreshCw className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </div>

            {/* Details Panel */}
            <AnimatePresence>
              {showDetails && queueStatus.pending > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/20 px-4 py-3 space-y-2 overflow-hidden"
                >
                  <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
                    Pending Actions
                  </div>
                  {queueStatus.actions.map((action: any, idx: number) => (
                    <div
                      key={action.id}
                      className="text-sm text-white/80 flex items-start space-x-2"
                    >
                      <CloudOff className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium capitalize">
                          {action.type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs opacity-75">
                          Retry {action.retries}/3
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
