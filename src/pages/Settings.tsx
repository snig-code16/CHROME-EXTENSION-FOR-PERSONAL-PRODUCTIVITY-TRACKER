
import React, { useState } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, SlidersHorizontal, Bell, Clock, Database, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoStart, setAutoStart] = useState(false);
  const [idleThreshold, setIdleThreshold] = useState(5);
  const [productivityThreshold, setProductivityThreshold] = useState(50);
  const [dataRetention, setDataRetention] = useState("30");
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real extension, these would persist in chrome.storage
    localStorage.setItem('flowstate-settings', JSON.stringify({
      notificationsEnabled,
      autoStart,
      idleThreshold,
      productivityThreshold,
      dataRetention
    }));

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-6 space-y-6 max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-flowstate-purple" />
            Settings
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass card-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-flowstate-purple" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Enable notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for productivity milestones and goals
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-start">Auto-start tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start tracking when browser opens
                    </p>
                  </div>
                  <Switch
                    id="auto-start"
                    checked={autoStart}
                    onCheckedChange={setAutoStart}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass card-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-flowstate-purple" />
                  Tracking Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="idle-threshold">Idle detection threshold</Label>
                    <span className="text-sm text-muted-foreground">{idleThreshold} minutes</span>
                  </div>
                  <Slider
                    id="idle-threshold"
                    min={1}
                    max={30}
                    step={1}
                    value={[idleThreshold]}
                    onValueChange={(values) => setIdleThreshold(values[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pause tracking after being idle for this duration
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="productivity-threshold">Productivity threshold</Label>
                    <span className="text-sm text-muted-foreground">{productivityThreshold}%</span>
                  </div>
                  <Slider
                    id="productivity-threshold"
                    min={0}
                    max={100}
                    step={5}
                    value={[productivityThreshold]}
                    onValueChange={(values) => setProductivityThreshold(values[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Target productivity score to achieve daily
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass card-shadow md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-flowstate-purple" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data retention period</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How long to keep your productivity data
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="export-data">Export your data</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">Export as CSV</Button>
                      <Button variant="outline" className="w-full">Export as JSON</Button>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="pt-2 flex justify-end">
                  <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <footer className="py-4 border-t border-border/40">
          <div className="container text-center text-sm text-muted-foreground">
            FlowState Productivity Assistant © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default SettingsPage;
