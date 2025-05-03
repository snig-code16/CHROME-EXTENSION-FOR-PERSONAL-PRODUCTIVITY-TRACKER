
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebsiteTracking } from "@/hooks/useWebsiteTracking";
import { BarChart } from "lucide-react";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const ProductivityChart = () => {
  const { productivityData, isLoading } = useWebsiteTracking();
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Prepare data for chart
  const chartData = productivityData.map(day => ({
    date: formatDate(day.date),
    Productivity: day.productivityScore,
    'Tasks Completed': day.tasksCompleted,
  }));

  return (
    <Card className="h-full glass card-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex gap-2 items-center">
            <BarChart className="h-5 w-5 text-flowstate-purple" />
            <span>Productivity Trends</span>
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
              className="h-7 px-2 text-xs"
            >
              Area
            </Button>
            <Button 
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="h-7 px-2 text-xs"
            >
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-[220px]">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7E69AB" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7E69AB" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--border)' }}
                    domain={[0, 100]}
                    label={{ 
                      value: '%', 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle', fontSize: 12 }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="Productivity" 
                    stroke="#7E69AB" 
                    fillOpacity={1} 
                    fill="url(#colorProductivity)" 
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </AreaChart>
              ) : (
                <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--border)' }}
                    domain={[0, 100]}
                    label={{ 
                      value: '%', 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle', fontSize: 12 }
                    }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={{ stroke: 'var(--border)' }}
                    domain={[0, 'dataMax + 2']}
                    label={{ 
                      value: 'tasks', 
                      angle: -90, 
                      position: 'insideRight', 
                      style: { textAnchor: 'middle', fontSize: 12 }
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--background)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar 
                    yAxisId="left"
                    dataKey="Productivity" 
                    fill="#7E69AB" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1000}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="Tasks Completed" 
                    fill="#9b87f5" 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1000}
                    animationBegin={300}
                  />
                </RechartsBarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductivityChart;
