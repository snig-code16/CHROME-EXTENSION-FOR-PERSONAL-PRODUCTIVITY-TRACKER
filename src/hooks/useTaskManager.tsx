
import { useState, useEffect } from 'react';
import { Task, mockTasks } from '@/utils/mockData';
import { toast } from '@/components/ui/sonner';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch tasks from storage or API
    // For now, we'll use mock data with a simulated delay
    const fetchTasks = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Try to load from localStorage first
        const storedTasks = localStorage.getItem('flowstate-tasks');
        
        if (storedTasks) {
          // Parse stored tasks and convert date strings back to Date objects
          const parsedTasks = JSON.parse(storedTasks).map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }));
          setTasks(parsedTasks);
        } else {
          // Use mock data as fallback
          setTasks(mockTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load tasks');
        setTasks(mockTasks); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    if (!isLoading) {
      localStorage.setItem('flowstate-tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const addTask = (title: string, priority: Task['priority'] = 'medium') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      createdAt: new Date(),
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    toast.success('Task added');
    return newTask;
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTaskPriority = (taskId: string, priority: Task['priority']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, priority } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.info('Task deleted');
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    const result = Array.from(tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTasks(result);
  };

  return {
    tasks,
    isLoading,
    addTask,
    toggleTaskCompletion,
    updateTaskPriority,
    deleteTask,
    reorderTasks,
  };
};
