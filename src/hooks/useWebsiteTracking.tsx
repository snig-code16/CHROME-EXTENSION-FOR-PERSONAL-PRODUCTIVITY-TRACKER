import { useState, useEffect } from 'react';
import { WebsiteUsage, mockWebsiteUsage, DailyProductivity, mockProductivityData } from '@/utils/mockData';

// Add Chrome extension API type declarations
declare global {
  interface Window {
    chrome?: {
      storage?: {
        local?: {
          get: (keys: string[], callback: (result: any) => void) => void;
          set: (items: Record<string, any>, callback?: () => void) => void;
        };
        onChanged?: {
          addListener: (callback: (changes: any, namespace: string) => void) => void;
        };
      };
      runtime?: {
        id?: string;
        sendMessage: (message: any) => void;
      };
    };
  }
}

export const useWebsiteTracking = () => {
  const [websiteData, setWebsiteData] = useState<WebsiteUsage[]>([]);
  const [productivityData, setProductivityData] = useState<DailyProductivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data from Chrome storage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Check if in Chrome extension environment
        const isExtension = !!(window.chrome && window.chrome.runtime && window.chrome.runtime.id);
        
        if (isExtension && window.chrome?.storage?.local) {
          // We're in a Chrome extension, use chrome.storage
          window.chrome.storage.local.get(['flowstate-tracking-data'], function(result) {
            const trackingData = result['flowstate-tracking-data'] || {};
            processTrackingData(trackingData);
          });
        } else {
          // We're in development, use localStorage or mock data
          const storedData = localStorage.getItem('flowstate-tracking-data');
          if (storedData) {
            processTrackingData(JSON.parse(storedData));
          } else {
            // Use mock data as fallback
            setWebsiteData(mockWebsiteUsage);
            setProductivityData(mockProductivityData);
          }
        }
      } catch (error) {
        console.error('Error loading tracking data:', error);
        // Fallback to mock data
        setWebsiteData(mockWebsiteUsage);
        setProductivityData(mockProductivityData);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up a listener for storage changes if in extension
    if (window.chrome?.storage?.onChanged) {
      window.chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && changes['flowstate-tracking-data']) {
          processTrackingData(changes['flowstate-tracking-data'].newValue);
        }
      });
    }
  }, []);
  
  // Process raw tracking data from chrome.storage into our app format
  const processTrackingData = (trackingData: Record<string, any>) => {
    if (!trackingData) return;
    
    // Convert tracking data to WebsiteUsage[]
    const websiteUsages: WebsiteUsage[] = [];
    const productivityEntries: DailyProductivity[] = [];
    
    // Process last 30 days of data
    const dates = Object.keys(trackingData).sort();
    dates.slice(-30).forEach(date => {
      const dayData = trackingData[date];
      
      // Process domains for this day
      if (dayData.domains) {
        Object.entries(dayData.domains).forEach(([domain, data]: [string, any]) => {
          // Find if domain already exists in our list
          const existingDomain = websiteUsages.find(site => site.domain === domain);
          
          if (existingDomain) {
            existingDomain.timeSpent += data.timeSpent;
          } else {
            const getRandomColor = () => {
              const colors = ['#2da44e', '#f48024', '#ff0000', '#1da1f2', '#4285f4', '#8bb0d6', '#ea4c89', '#7E69AB'];
              return colors[Math.floor(Math.random() * colors.length)];
            };
            
            websiteUsages.push({
              domain,
              timeSpent: data.timeSpent,
              category: data.category,
              color: getRandomColor()
            });
          }
        });
      }
      
      // Create productivity entry
      const totalMinutes = dayData.productiveMinutes + dayData.distractingMinutes + dayData.neutralMinutes;
      const productivityScore = totalMinutes > 0 ? 
        Math.round((dayData.productiveMinutes / totalMinutes) * 100) : 0;
      
      productivityEntries.push({
        date,
        productiveMinutes: dayData.productiveMinutes,
        distractingMinutes: dayData.distractingMinutes,
        tasksCompleted: dayData.tasksCompleted,
        productivityScore
      });
    });
    
    setWebsiteData(websiteUsages);
    setProductivityData(productivityEntries);
  };
  
  // Calculate summary statistics
  const calculateStats = () => {
    if (productivityData.length === 0) return null;
    
    const today = productivityData[productivityData.length - 1];
    const yesterday = productivityData.length > 1 ? productivityData[productivityData.length - 2] : null;
    
    const productiveHours = today.productiveMinutes / 60;
    const distractingHours = today.distractingMinutes / 60;
    
    // Calculate change in productivity score compared to yesterday
    const productivityChange = yesterday 
      ? today.productivityScore - yesterday.productivityScore 
      : 0;
    
    // Calculate most used productive and distracting websites
    const mostProductiveWebsite = [...websiteData]
      .filter(site => site.category === 'productive')
      .sort((a, b) => b.timeSpent - a.timeSpent)[0];
      
    const mostDistractingWebsite = [...websiteData]
      .filter(site => site.category === 'distracting')
      .sort((a, b) => b.timeSpent - a.timeSpent)[0];
    
    return {
      productiveHours,
      distractingHours,
      totalTrackedHours: productiveHours + distractingHours,
      productivityScore: today.productivityScore,
      productivityChange,
      tasksCompleted: today.tasksCompleted,
      mostProductiveWebsite,
      mostDistractingWebsite,
    };
  };
  
  // Track website visit - this would connect to the background script in a real extension
  const trackWebsiteVisit = (domain: string, timeSpent: number, category: 'productive' | 'neutral' | 'distracting') => {
    // In a real extension, this would send a message to the background script
    // For now, we'll update the local state
    
    // Check if the domain already exists in the data
    const existingWebsite = websiteData.find(site => site.domain === domain);
    
    if (existingWebsite) {
      // Update existing domain's time
      setWebsiteData(prev => prev.map(site => 
        site.domain === domain 
          ? { ...site, timeSpent: site.timeSpent + timeSpent } 
          : site
      ));
    } else {
      // Add new domain
      setWebsiteData(prev => [...prev, {
        domain,
        timeSpent,
        category,
        color: getRandomColor(),
      }]);
    }
    
    // Update today's productivity data
    updateTodayProductivity({
      [category === 'productive' ? 'productiveMinutes' : 'distractingMinutes']: timeSpent
    });
  };
  
  // Helper to update today's productivity metrics
  const updateTodayProductivity = (updates: Partial<Omit<DailyProductivity, 'date'>>) => {
    setProductivityData(prev => {
      const today = new Date().toISOString().split('T')[0];
      const todayIndex = prev.findIndex(day => day.date === today);
      
      if (todayIndex >= 0) {
        // Update existing day
        const updatedDay = { ...prev[todayIndex], ...updates };
        
        // Recalculate productivity score
        if (updates.productiveMinutes || updates.distractingMinutes) {
          const totalMinutes = updatedDay.productiveMinutes + updatedDay.distractingMinutes;
          updatedDay.productivityScore = Math.round((updatedDay.productiveMinutes / totalMinutes) * 100);
        }
        
        const updatedData = [...prev];
        updatedData[todayIndex] = updatedDay;
        return updatedData;
      } else {
        // Create new day
        return [...prev, {
          date: today,
          productiveMinutes: updates.productiveMinutes || 0,
          distractingMinutes: updates.distractingMinutes || 0,
          tasksCompleted: updates.tasksCompleted || 0,
          productivityScore: updates.productivityScore || 0,
        }];
      }
    });
  };
  
  // Helper to get a random color for new websites
  const getRandomColor = () => {
    const colors = ['#2da44e', '#f48024', '#ff0000', '#1da1f2', '#4285f4', '#8bb0d6', '#ea4c89', '#7E69AB'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Update task completion count
  const updateTasksCompleted = (count: number) => {
    updateTodayProductivity({ tasksCompleted: count });
    
    // If in extension, notify background script
    if (window.chrome?.runtime) {
      window.chrome.runtime.sendMessage({ action: 'taskCompleted' });
    }
  };
  
  return {
    websiteData,
    productivityData,
    isLoading,
    stats: calculateStats(),
    trackWebsiteVisit,
    updateTasksCompleted,
  };
};
