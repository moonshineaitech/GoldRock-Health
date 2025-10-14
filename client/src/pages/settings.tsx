import { MobileLayout, MobileCard } from "@/components/mobile-layout";
import { AccountDeletion } from "@/components/account-deletion";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, FileText, HelpCircle, LogOut, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function Settings() {
  const { user } = useAuth();

  const settingsSections = [
    {
      title: "Account",
      icon: User,
      items: [
        { label: "Profile Information", value: user?.email || "Not available", icon: User },
        { label: "Subscription", value: user?.subscriptionStatus === 'active' ? "Premium Active" : "Free Plan", icon: Shield },
      ]
    },
    {
      title: "Privacy & Legal",
      icon: Shield,
      items: [
        { label: "Privacy Policy", link: "/privacy-policy", icon: Shield },
        { label: "Terms of Service", link: "/terms-of-service", icon: FileText },
      ]
    },
    {
      title: "Medical Disclaimer",
      icon: AlertTriangle,
      items: [
        { 
          label: "Important Medical Notice", 
          description: "This app provides educational information and billing analysis only. Not medical advice. Always consult a licensed physician for health decisions.",
          icon: AlertTriangle 
        },
      ]
    }
  ];

  return (
    <MobileLayout title="Settings" showBackButton={true} showBottomNav={true}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </motion.div>

        {/* Settings Sections */}
        {settingsSections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
              {section.title}
            </h2>
            <MobileCard>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIdx) => {
                  const ItemIcon = item.icon;
                  if (item.link) {
                    return (
                      <Link key={itemIdx} href={item.link}>
                        <div
                          className="flex items-center justify-between py-3 px-1 hover:bg-gray-50 transition-colors cursor-pointer"
                          data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                              <ItemIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-900">{item.label}</span>
                          </div>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    );
                  }
                  return (
                    <div key={itemIdx} className="py-3 px-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
                            <ItemIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.label}</div>
                            {item.value && (
                              <div className="text-sm text-gray-500">{item.value}</div>
                            )}
                            {item.description && (
                              <div className="text-sm text-gray-600 mt-1 max-w-md">{item.description}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </MobileCard>
          </motion.div>
        ))}

        {/* Account Deletion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Danger Zone
          </h2>
          <AccountDeletion userEmail={user?.email} />
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <a href="/api/logout" className="block">
            <MobileCard className="hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3 py-1">
                <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">Log Out</h3>
                  <p className="text-sm text-gray-600">Sign out of your account</p>
                </div>
              </div>
            </MobileCard>
          </a>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
