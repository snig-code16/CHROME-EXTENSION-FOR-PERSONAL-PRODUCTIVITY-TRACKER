
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Check, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

const GoalSetting = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Productive Hours',
      target: 6,
      current: 3.5,
      unit: 'hours'
    },
    {
      id: '2',
      title: 'Task Completion',
      target: 10,
      current: 6,
      unit: 'tasks'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    title: '',
    target: 0,
    current: 0,
    unit: 'items'
  });
  
  const { toast } = useToast();
  
  const handleAddGoal = () => {
    if (!newGoal.title || newGoal.target <= 0) {
      toast({
        title: "Invalid goal",
        description: "Please provide a title and a valid target number.",
        variant: "destructive"
      });
      return;
    }
    
    setGoals(prev => [...prev, {
      ...newGoal,
      id: Date.now().toString()
    }]);
    
    setNewGoal({
      title: '',
      target: 0,
      current: 0,
      unit: 'items'
    });
    
    setIsDialogOpen(false);
    toast({
      title: "Goal added",
      description: "Your new goal has been created successfully."
    });
  };

  return (
    <Card className="h-full glass card-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex gap-2 items-center">
            <Target className="h-5 w-5 text-flowstate-purple" />
            <span>Daily Goals</span>
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a new daily goal to track your productivity.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goal-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title}
                    onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goal-target" className="text-right">
                    Target
                  </Label>
                  <Input
                    id="goal-target"
                    type="number"
                    min={1}
                    value={newGoal.target || ''}
                    onChange={e => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goal-unit" className="text-right">
                    Unit
                  </Label>
                  <Input
                    id="goal-unit"
                    value={newGoal.unit}
                    onChange={e => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="hours, tasks, etc."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal}>Create Goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No goals set yet. Add one to get started!
            </div>
          ) : (
            goals.map((goal, index) => {
              const progress = Math.round((goal.current / goal.target) * 100);
              return (
                <div 
                  key={goal.id} 
                  className="space-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">{goal.title}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {progress >= 100 ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      <span className="tabular-nums">
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={progress > 100 ? 100 : progress} 
                    className="h-2 bg-muted/40"
                  />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalSetting;
