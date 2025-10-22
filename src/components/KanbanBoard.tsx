import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Calendar, MoreVertical, GripVertical, Plus, UserPlus, ArrowRight, Code } from 'lucide-react';
import { Task, TaskStatus } from '../lib/types';
import { mockTasks, mockUsers } from '../lib/mock-data';

interface KanbanBoardProps {
  onOpenTaskModal: (task?: Task) => void;
}

export function KanbanBoard({ onOpenTaskModal }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'Pending', label: 'Pending', color: 'bg-gray-100' },
    { status: 'In Progress', label: 'In Progress', color: 'bg-amber-50' },
    { status: 'In Review', label: 'In Review', color: 'bg-blue-50' },
    { status: 'Completed', label: 'Completed', color: 'bg-emerald-50' },
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask) {
      setTasks(tasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status } 
          : task
      ));
      setDraggedTask(null);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getAssignee = (assigneeId: string) => {
    return mockUsers.find(user => user.id === assigneeId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && draggedTask?.status !== 'Completed';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Kanban Board</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Kanban Board</h1>
          <p className="text-muted-foreground mt-2">
            Manage tasks with drag-and-drop workflow
          </p>
        </div>
        <Button onClick={() => onOpenTaskModal()} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          
          return (
            <div
              key={column.status}
              className="flex flex-col gap-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.status)}
            >
              {/* Column Header */}
              <div className={`${column.color} rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">{column.label}</h3>
                  <Badge variant="secondary">{columnTasks.length}</Badge>
                </div>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 min-h-[200px]">
                {columnTasks.map((task) => {
                  const assignee = getAssignee(task.assigneeId);
                  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
                  const totalSubtasks = task.subtasks.length;

                  return (
                    <Card
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      className="cursor-move hover:shadow-lg transition-shadow rounded-xl"
                      onClick={() => onOpenTaskModal(task)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 flex-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <CardTitle className="text-sm leading-snug cursor-pointer">
                              {task.title}
                            </CardTitle>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={() => onOpenTaskModal(task)}>
                                Edit Task
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Reassign
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Move to...
                              </DropdownMenuItem>
                              {task.status === 'In Review' && (
                                <DropdownMenuItem>
                                  <Code className="mr-2 h-4 w-4" />
                                  AI Code Review
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Priority & Module */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.module}
                          </Badge>
                        </div>

                        {/* Subtasks Progress */}
                        {totalSubtasks > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
                            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-primary h-1.5 rounded-full transition-all"
                                style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue(task.dueDate) ? 'text-destructive' : ''}>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                          {assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={assignee.avatar} />
                              <AvatarFallback className="text-xs">
                                {assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Add Task Button */}
                {columnTasks.length === 0 && (
                  <Button
                    variant="ghost"
                    className="w-full border-2 border-dashed h-24 hover:bg-muted/50"
                    onClick={() => onOpenTaskModal()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
