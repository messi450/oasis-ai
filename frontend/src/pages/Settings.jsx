import React, { useState } from "react";
import { Save, Bell, Lock, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dataSharing: false,
    autoSave: true,
    language: "en",
    theme: "light"
  });

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
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">Account</h2>
                <p className="text-sm text-[#64748B]">Manage your account information</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[#0F172A]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="user@example.com"
                  className="mt-1 border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 rounded-[12px]"
                />
              </div>
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-[#0F172A]">
                  Display Name
                </Label>
                <Input
                  id="name"
                  defaultValue="User Account"
                  className="mt-1 border-[#E2E8F0] focus:border-[#2563EB] focus:ring-[#2563EB]/20 rounded-[12px]"
                />
              </div>
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

          {/* Privacy */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">Privacy</h2>
                <p className="text-sm text-[#64748B]">Manage your data and privacy settings</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Data sharing</p>
                  <p className="text-sm text-[#64748B]">Help improve AI NeuroHub by sharing usage data</p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, dataSharing: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Auto-save chats</p>
                  <p className="text-sm text-[#64748B]">Automatically save your chat history</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoSave: checked })
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
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="language" className="text-sm font-medium text-[#0F172A]">
                  Language
                </Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="mt-1 w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-[12px] text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
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