import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ZoomIn, ZoomOut, Flag } from 'lucide-react';
import { mockTasks, mockUsers, mockMilestones } from '../lib/mock-data';
import { Task } from '../lib/types';

export function TimelineView() {
  const [zoomLevel, setZoomLevel] = useState<'week' | 'month'>('month');

  const getTaskDuration = (task: Task) => {
    const start = new Date(task.createdAt);
    const end = new Date(task.dueDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTaskPosition = (task: Task) => {
    const projectStart = new Date('2025-10-01');
    const taskStart = new Date(task.createdAt);
    const diffTime = Math.abs(taskStart.getTime() - projectStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = (task: Task) => {
    if (task.status === 'Completed') return 100;
    if (task.subtasks.length === 0) {
      if (task.status === 'In Progress') return 50;
      if (task.status === 'In Review') return 75;
      return 0;
    }
    const completed = task.subtasks.filter(st => st.completed).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-amber-500';
      case 'Low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAssignee = (assigneeId: string) => {
    return mockUsers.find(user => user.id === assigneeId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Generate timeline grid
  const totalDays = zoomLevel === 'week' ? 84 : 90; // ~12 weeks or 3 months
  const dayWidth = zoomLevel === 'week' ? 20 : 10;

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
            <BreadcrumbPage>Timeline</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1>Project Timeline</h1>
          <p className="text-muted-foreground mt-2">
            Visualize task schedules and dependencies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoomLevel('week')}
            className={zoomLevel === 'week' ? 'bg-muted' : ''}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setZoomLevel('month')}
            className={zoomLevel === 'month' ? 'bg-muted' : ''}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Select value={zoomLevel} onValueChange={(v) => setZoomLevel(v as 'week' | 'month')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Milestones */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            Project Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Flag className={`h-4 w-4 ${milestone.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <p className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                      {milestone.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(milestone.date)}
                    </p>
                  </div>
                </div>
                <Badge variant={milestone.completed ? 'default' : 'secondary'}>
                  {milestone.completed ? 'Completed' : 'Upcoming'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gantt Chart */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>Gantt Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="flex mb-4 border-b pb-2">
                <div className="w-64 flex-shrink-0">
                  <p className="text-sm font-medium">Task</p>
                </div>
                <div className="flex-1 flex">
                  {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="flex-1 text-center text-xs text-muted-foreground border-r last:border-r-0"
                    >
                      Week {weekIndex + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Rows */}
              <div className="space-y-3">
                {mockTasks.map((task) => {
                  const assignee = getAssignee(task.assigneeId);
                  const duration = getTaskDuration(task);
                  const position = getTaskPosition(task);
                  const progress = getProgressPercentage(task);

                  return (
                    <div key={task.id} className="flex items-center group">
                      {/* Task Info */}
                      <div className="w-64 flex-shrink-0 pr-4">
                        <div className="flex items-center gap-2">
                          {assignee && (
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={assignee.avatar} />
                              <AvatarFallback className="text-xs">
                                {assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.module}</p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Bar */}
                      <div className="flex-1 relative h-10 bg-muted/30 rounded">
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-6 rounded-lg overflow-hidden group-hover:h-8 transition-all"
                          style={{
                            left: `${(position / totalDays) * 100}%`,
                            width: `${Math.max((duration / totalDays) * 100, 5)}%`,
                          }}
                        >
                          <div
                            className={`h-full ${getPriorityColor(task.priority)} opacity-80 relative`}
                          >
                            <div
                              className="absolute inset-0 bg-primary opacity-30"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10">
                            <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg text-xs whitespace-nowrap border">
                              <p className="font-medium">{task.title}</p>
                              <p className="text-muted-foreground mt-1">
                                {formatDate(task.createdAt)} - {formatDate(task.dueDate)}
                              </p>
                              <p className="mt-1">Progress: {progress}%</p>
                            </div>
                          </div>
                        </div>

                        {/* Dependency lines would go here in a real implementation */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="rounded-xl">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-sm">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-500" />
              <span className="text-sm">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-sm">Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary opacity-30" />
              <span className="text-sm">Progress Overlay</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
