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
    alert("Settings saved successfully!");
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#0F172A] mb-2">Settings</h1>
          <p className="text-sm text-[#64748B]">
            Manage your preferences and notifications
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Email Address */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#0F172A]">Email Address</h2>
              <p className="text-sm text-[#64748B]">Stay updated with the latest news</p>
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#0F172A]">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-1 border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 rounded-[12px]"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">Notifications</h2>
                <p className="text-sm text-[#64748B]">Control how you receive notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Email notifications</p>
                  <p className="text-sm text-[#64748B]">Receive email updates about your activity</p>
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
                  <p className="text-sm font-medium text-[#0F172A]">Push notifications</p>
                  <p className="text-sm text-[#64748B]">Receive push notifications in your browser</p>
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
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">Appearance</h2>
                <p className="text-sm text-[#64748B]">Customize the look and feel</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#0F172A] mb-3 block">
                Theme
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, theme: "light" })}
                  className={`p-4 border-2 rounded-[12px] transition-all ${settings.theme === "light"
                    ? "border-[#2563EB]"
                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                    }`}
                  style={{
                    backgroundColor: settings.theme === "light" ? '#FFFFFF' : 'transparent',
                    color: '#0F172A'
                  }}
                >
                  <div
                    className="w-full h-12 border border-[#E2E8F0] rounded-[8px] mb-2"
                    style={{ backgroundColor: '#FFFFFF' }}
                  ></div>
                  <p className="text-sm font-medium" style={{ color: '#0F172A' }}>Light</p>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: "dark" })}
                  className={`p-4 border-2 rounded-[12px] transition-all ${settings.theme === "dark"
                    ? "border-[#2563EB] bg-[#EFF6FF]"
                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
                    }`}
                >
                  <div className="w-full h-12 bg-[#1E293B] border border-[#334155] rounded-[8px] mb-2"></div>
                  <p className="text-sm font-medium text-[#0F172A]">Dark</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
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