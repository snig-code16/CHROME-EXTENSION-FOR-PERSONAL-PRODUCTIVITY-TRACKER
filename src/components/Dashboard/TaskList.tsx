
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Plus, Trash2 } from "lucide-react";
import { Task } from '@/utils/mockData';
import { Badge } from "@/components/ui/badge";
import { useTaskManager } from '@/hooks/useTaskManager';
import { cn } from '@/lib/utils';

const TaskList = () => {
  const { tasks, isLoading, addTask, toggleTaskCompletion, deleteTask } = useTaskManager();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <Card className="h-full transition-all glass card-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex gap-2 items-center">
            <ListTodo className="h-5 w-5 text-flowstate-purple" />
            <span>Today's Tasks</span>
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {tasks.filter(t => t.completed).length}/{tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            className="flex-1 border-border/30 focus-visible:ring-primary/30"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!newTaskTitle.trim()}
            className="shrink-0"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </form>

        {isLoading ? (
          <div className="flex flex-col space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-[280px] overflow-auto pr-1">
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No tasks yet. Add one to get started!
              </div>
            ) : (
              tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "group flex items-center justify-between p-2 rounded-md border border-border/40 hover:border-primary/30 transition-all",
                    "animate-fade-in",
                    task.completed && "bg-secondary/50"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <span className={cn(
                      "text-sm transition-all",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
