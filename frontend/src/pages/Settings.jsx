import React, { useState } from "react";
import { Save, Bell, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const [settings, setSettings] = useState({
    email: "user@example.com",
    emailNotifications: true,
    pushNotifications: false,
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light"
  });

  const [showSavedMessage, setShowSavedMessage] = useState(false);

  React.useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [settings.theme]);

  const handleSave = () => {
    // Save settings logic
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your preferences and notifications
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Email Address */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Email Address</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Stay updated with the latest news</p>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-slate-900 dark:text-white">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#2563EB] focus:ring-[#2563EB]/20 rounded-[12px]"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Control how you receive notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Email notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive email updates about your activity</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Push notifications</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, pushNotifications: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Appearance</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customize the look and feel</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-slate-900 dark:text-white mb-3 block">
                Theme
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, theme: "light" })}
                  className={`p-4 border-2 rounded-[12px] transition-all ${settings.theme === "light"
                    ? "border-[#2563EB] bg-white"
                    : "border-slate-200 dark:border-slate-700 bg-white/10 hover:bg-white/20"
                    }`}
                >
                  <div className="w-full h-12 bg-slate-50 border border-slate-200 rounded-[8px] mb-2"></div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Light</p>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: "dark" })}
                  className={`p-4 border-2 rounded-[12px] transition-all ${settings.theme === "dark"
                    ? "border-[#2563EB] bg-slate-900"
                    : "border-slate-200 dark:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60"
                    }`}
                >
                  <div className="w-full h-12 bg-slate-900 border border-slate-700 rounded-[8px] mb-2"></div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Dark</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-end gap-4">
          {showSavedMessage && (
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in slide-in-from-right-4 duration-300">
              Settings updated successfully!
            </span>
          )}
          <Button
            onClick={handleSave}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-medium h-10 px-6 rounded-[10px] shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}