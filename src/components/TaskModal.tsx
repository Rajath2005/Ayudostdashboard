import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Sparkles, Plus, X, CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, Subtask } from '../lib/types';
import { mockUsers, modules } from '../lib/mock-data';
import { format } from '../lib/date-utils';

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSave: (task: Partial<Task>) => void;
}

export function TaskModal({ open, onOpenChange, task, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [module, setModule] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [dueDate, setDueDate] = useState<Date>();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    assignee?: string;
    subtasks?: string[];
    deadline?: Date;
  }>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setModule(task.module);
      setAssigneeId(task.assigneeId);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(new Date(task.dueDate));
      setSubtasks(task.subtasks);
    } else {
      resetForm();
    }
  }, [task, open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setModule('');
    setAssigneeId('');
    setPriority('Medium');
    setStatus('Pending');
    setDueDate(undefined);
    setSubtasks([]);
    setShowAISuggestions(false);
    setAiSuggestions({});
  };

  const handleAISuggestions = () => {
    setAiLoading(true);
    setShowAISuggestions(true);

    // Simulate AI processing
    setTimeout(() => {
      // Smart assignee suggestion based on module
      let suggestedAssignee = '';
      if (module.includes('AI') || module.includes('ML')) {
        suggestedAssignee = '3'; // Rithesh
      } else if (module.includes('Database') || module.includes('Auth')) {
        suggestedAssignee = '2'; // Rajath
      } else if (module.includes('UI') || module.includes('Frontend')) {
        suggestedAssignee = '4'; // Sheethal
      } else {
        suggestedAssignee = '1'; // Sanath for docs/testing
      }

      // Generate subtasks
      const suggestedSubtasks = [
        `Research requirements for ${title.toLowerCase()}`,
        `Design implementation approach`,
        `Write code/documentation`,
        `Test and review`,
        `Deploy and monitor`,
      ];

      // Suggest deadline (7 days from now for high priority, 14 for others)
      const daysToAdd = priority === 'High' ? 7 : 14;
      const suggestedDeadline = new Date();
      suggestedDeadline.setDate(suggestedDeadline.getDate() + daysToAdd);

      setAiSuggestions({
        assignee: suggestedAssignee,
        subtasks: suggestedSubtasks,
        deadline: suggestedDeadline,
      });
      setAiLoading(false);
    }, 1500);
  };

  const applyAISuggestion = (type: 'assignee' | 'subtasks' | 'deadline') => {
    if (type === 'assignee' && aiSuggestions.assignee) {
      setAssigneeId(aiSuggestions.assignee);
    } else if (type === 'subtasks' && aiSuggestions.subtasks) {
      const newSubtasks = aiSuggestions.subtasks.map((title, index) => ({
        id: `${Date.now()}-${index}`,
        title,
        completed: false,
      }));
      setSubtasks([...subtasks, ...newSubtasks]);
    } else if (type === 'deadline' && aiSuggestions.deadline) {
      setDueDate(aiSuggestions.deadline);
    }
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `${Date.now()}`, title: newSubtask, completed: false },
      ]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(st => st.id !== id));
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(st => 
      st.id === id ? { ...st, completed: !st.completed } : st
    ));
  };

  const handleSave = () => {
    const taskData: Partial<Task> = {
      id: task?.id || `${Date.now()}`,
      title,
      description,
      module,
      assigneeId,
      priority,
      status,
      dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : '',
      subtasks,
      updatedAt: new Date().toISOString(),
    };

    if (!task) {
      taskData.createdAt = new Date().toISOString();
    }

    onSave(taskData);
    onOpenChange(false);
  };

  const isValid = title && module && assigneeId && dueDate;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update task details below' : 'Fill in the details to create a new task'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Module & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Module *</Label>
              <Select value={module} onValueChange={setModule}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((mod) => (
                    <SelectItem key={mod} value={mod}>
                      {mod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Assignee *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.filter(u => u.role !== 'Stakeholder').map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-11 justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label>Subtasks</Label>
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => toggleSubtask(subtask.id)}
                  />
                  <span className={`flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {subtask.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeSubtask(subtask.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                  className="h-10"
                />
                <Button onClick={addSubtask} size="icon" className="h-10 w-10">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Suggestions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
              onClick={handleAISuggestions}
              disabled={aiLoading || !title || !module}
            >
              {aiLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating AI Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get AI Suggestions
                </>
              )}
            </Button>

            {showAISuggestions && !aiLoading && (
              <div className="p-4 border rounded-xl bg-primary/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">AI Suggestions</span>
                </div>

                {aiSuggestions.assignee && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Recommended Assignee</p>
                      <p className="text-sm text-muted-foreground">
                        {mockUsers.find(u => u.id === aiSuggestions.assignee)?.name}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => applyAISuggestion('assignee')}
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Apply
                    </Button>
                  </div>
                )}

                {aiSuggestions.subtasks && aiSuggestions.subtasks.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Suggested Subtasks</p>
                      <p className="text-sm text-muted-foreground">
                        {aiSuggestions.subtasks.length} subtasks generated
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => applyAISuggestion('subtasks')}
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Apply
                    </Button>
                  </div>
                )}

                {aiSuggestions.deadline && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Recommended Deadline</p>
                      <p className="text-sm text-muted-foreground">
                        {format(aiSuggestions.deadline, 'PPP')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => applyAISuggestion('deadline')}
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!isValid}
            className="bg-primary hover:bg-primary/90"
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
