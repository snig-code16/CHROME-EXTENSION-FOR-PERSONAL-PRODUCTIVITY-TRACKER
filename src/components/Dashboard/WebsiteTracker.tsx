
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebsiteTracking } from "@/hooks/useWebsiteTracking";
import { WebsiteUsage } from "@/utils/mockData";
import { Clock, Monitor, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const WebsiteTracker = () => {
  const { websiteData, isLoading } = useWebsiteTracking();

  // Format time for display (convert minutes to hours and minutes)
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  // Calculate total time
  const totalTime = websiteData.reduce((acc, site) => acc + site.timeSpent, 0);
  
  // Prepare data for pie chart
  const pieData = websiteData.map(site => ({
    name: site.domain,
    value: site.timeSpent,
    color: site.color,
    category: site.category,
  }));

  return (
    <Card className="h-full glass card-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex gap-2 items-center">
          <Monitor className="h-5 w-5 text-flowstate-purple" />
          <span>Website Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          </div>
        ) : websiteData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Monitor className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium">No websites tracked yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
              Start browsing, and FlowState will automatically track your website usage.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="h-[180px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={700}
                    animationBegin={200}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        className={cn(
                          "transition-all duration-300 hover:opacity-80",
                          entry.category === 'productive' ? 'opacity-100' : 'opacity-70'
                        )}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${formatTime(value)}`, 'Time Spent']} 
                    labelFormatter={(label) => label}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground">
                <Clock className="inline-block mr-1 h-4 w-4" />
                Total time tracked today: <span className="font-semibold">{formatTime(totalTime)}</span>
              </p>
            </div>
            
            <div className="space-y-3 w-full max-h-[140px] overflow-auto pr-1">
              {websiteData.sort((a, b) => b.timeSpent - a.timeSpent).map((site, index) => (
                <WebsiteItem key={site.domain} site={site} index={index} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface WebsiteItemProps {
  site: WebsiteUsage;
  index: number;
}

const WebsiteItem = ({ site, index }: WebsiteItemProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div 
      className="flex items-center justify-between p-2 rounded-md border border-border/40 transition-all animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: site.color }}
        ></div>
        <span className="text-sm font-medium">{site.domain}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{formatTime(site.timeSpent)}</span>
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded capitalize",
          site.category === 'productive' ? 'bg-green-500/10 text-green-500' : 
          site.category === 'distracting' ? 'bg-red-500/10 text-red-500' : 
          'bg-gray-500/10 text-gray-500'
        )}>
          {site.category}
        </span>
      </div>
    </div>
  );
};

export default WebsiteTracker;
