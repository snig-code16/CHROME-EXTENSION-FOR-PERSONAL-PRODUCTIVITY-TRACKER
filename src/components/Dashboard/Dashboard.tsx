
import { useWebsiteTracking } from "@/hooks/useWebsiteTracking";
import ProductivityChart from "./ProductivityChart";
import TaskList from "./TaskList";
import WebsiteTracker from "./WebsiteTracker";
import { ArrowDown, ArrowUp, Clock, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { stats, isLoading } = useWebsiteTracking();
  
  const formatHours = (hours: number) => {
    return hours.toFixed(1);
  };

  return (
    <div className="space-y-3 pb-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2">
        {/* Productive Hours */}
        <StatCard 
          title="Productive Hours"
          value={isLoading ? "-" : formatHours(stats?.productiveHours || 0)}
          trend={stats?.productivityChange || 0}
          trendLabel={`${Math.abs(stats?.productivityChange || 0)}% from yesterday`}
          isLoading={isLoading}
          color="bg-green-500/10 text-green-500"
        />
        
        {/* Distracting Hours */}
        <StatCard 
          title="Distracting Hours"
          value={isLoading ? "-" : formatHours(stats?.distractingHours || 0)}
          trend={0}
          trendLabel=""
          isLoading={isLoading}
          color="bg-red-500/10 text-red-500"
        />
        
        {/* Productivity Score */}
        <StatCard 
          title="Productivity Score"
          value={isLoading ? "-" : `${stats?.productivityScore || 0}%`}
          trend={stats?.productivityChange || 0}
          trendLabel={`${Math.abs(stats?.productivityChange || 0)}% from yesterday`}
          isLoading={isLoading}
          color="bg-purple-500/10 text-purple-500"
        />
        
        {/* Tasks Completed */}
        <StatCard 
          title="Tasks Completed"
          value={isLoading ? "-" : String(stats?.tasksCompleted || 0)}
          trend={0}
          trendLabel=""
          isLoading={isLoading}
          color="bg-blue-500/10 text-blue-500"
          icon={<Database className="h-5 w-5" />}
        />
      </div>
      
      {/* Main content grid - single column for better readability in popup */}
      <div className="grid grid-cols-1 gap-3">
        <ProductivityChart />
        <WebsiteTracker />
        <TaskList />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  isLoading: boolean;
  color: string;
  icon?: React.ReactNode;
}

const StatCard = ({ title, value, trend, trendLabel, isLoading, color, icon }: StatCardProps) => {
  return (
    <Card className="bg-card/90 overflow-hidden border-border/30">
      <CardContent className="p-2">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground mb-0.5">{title}</span>
          <div className="text-xl font-bold">
            {isLoading ? (
              <div className="h-6 w-14 bg-muted/50 rounded animate-pulse" />
            ) : (
              value
            )}
          </div>
          {!isLoading && trend !== 0 && trendLabel && (
            <div className="flex items-center text-xs mt-0.5">
              {trend < 0 ? (
                <div className="flex items-center text-red-500">
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                  <span>{trendLabel}</span>
                </div>
              ) : (
                <div className="flex items-center text-green-500">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  <span>{trendLabel}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
