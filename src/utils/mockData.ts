
export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
};

export type WebsiteUsage = {
  domain: string;
  timeSpent: number; // in minutes
  category: 'productive' | 'neutral' | 'distracting';
  icon?: string;
  color: string;
};

export type DailyProductivity = {
  date: string;
  productiveMinutes: number;
  distractingMinutes: number;
  tasksCompleted: number;
  productivityScore: number;
};

// Sample tasks
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Review pull requests',
    completed: true,
    priority: 'medium',
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Prepare for weekly meeting',
    completed: false,
    priority: 'high',
    createdAt: new Date(),
  },
  {
    id: '4',
    title: 'Update portfolio website',
    completed: false,
    priority: 'low',
    createdAt: new Date(),
  },
];

// Sample website usage data
export const mockWebsiteUsage: WebsiteUsage[] = [
  {
    domain: 'github.com',
    timeSpent: 120,
    category: 'productive',
    color: '#2da44e',
  },
  {
    domain: 'stackoverflow.com',
    timeSpent: 45,
    category: 'productive',
    color: '#f48024',
  },
  {
    domain: 'youtube.com',
    timeSpent: 35,
    category: 'distracting',
    color: '#ff0000',
  },
  {
    domain: 'twitter.com',
    timeSpent: 25,
    category: 'distracting',
    color: '#1da1f2',
  },
  {
    domain: 'docs.google.com',
    timeSpent: 40,
    category: 'productive',
    color: '#4285f4',
  },
];

// Generate 7 days of productivity data
export const mockProductivityData: DailyProductivity[] = Array.from({ length: 7 }).map((_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (6 - index));
  
  const productiveMinutes = Math.floor(Math.random() * 180) + 120; // 2-5 hours
  const distractingMinutes = Math.floor(Math.random() * 120) + 30; // 0.5-2.5 hours
  const tasksCompleted = Math.floor(Math.random() * 8) + 1;
  
  // Calculate productivity score (0-100)
  const totalMinutes = productiveMinutes + distractingMinutes;
  const productivityScore = Math.round((productiveMinutes / totalMinutes) * 100);
  
  return {
    date: date.toISOString().split('T')[0],
    productiveMinutes,
    distractingMinutes,
    tasksCompleted,
    productivityScore,
  };
});
