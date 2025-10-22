import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Mail, Phone, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { mockUsers, mockTasks } from '../lib/mock-data';
import { User } from '../lib/types';

export function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const getMemberStats = (userId: string) => {
    const userTasks = mockTasks.filter(t => t.assigneeId === userId);
    const completed = userTasks.filter(t => t.status === 'Completed').length;
    const inProgress = userTasks.filter(t => t.status === 'In Progress').length;
    const total = userTasks.length;
    const workload = Math.round((total / mockTasks.length) * 100);

    return { total, completed, inProgress, workload };
  };

  const getLastActivity = (userId: string) => {
    // Mock last activity
    const activities = [
      'Completed task "Setup Authentication"',
      'Updated task "Database Schema"',
      'Created new task',
      'Commented on review',
      'Started working on new feature',
    ];
    return activities[Math.floor(Math.random() * activities.length)];
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
            <BreadcrumbPage>Team</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div>
        <h1>Team Members</h1>
        <p className="text-muted-foreground mt-2">
          View team members, their roles, and current workload
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUsers.map((user) => {
          const stats = getMemberStats(user.id);
          const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

          return (
            <Card 
              key={user.id} 
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedMember(user)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{user.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant={user.role === 'Team Leader' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Task Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tasks Assigned</span>
                    <span>{stats.total}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="text-primary">{stats.completed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="text-accent">{stats.inProgress}</span>
                  </div>
                </div>

                {/* Workload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Workload</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* View Details Button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMember(user);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Member Detail Sheet */}
      <Sheet open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedMember && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-primary">
                    <AvatarImage src={selectedMember.avatar} />
                    <AvatarFallback className="text-lg">
                      {selectedMember.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xl">{selectedMember.name}</p>
                    <Badge className="mt-1">{selectedMember.role}</Badge>
                  </div>
                </SheetTitle>
                <SheetDescription>
                  Team member details and activity
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Contact Information */}
                <div>
                  <h3 className="mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+91 98765 43210</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Current Tasks */}
                <div>
                  <h3 className="mb-3">Current Tasks</h3>
                  <div className="space-y-3">
                    {mockTasks
                      .filter(t => t.assigneeId === selectedMember.id)
                      .map(task => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm">{task.title}</p>
                              <Badge variant="outline" className="text-xs whitespace-nowrap">
                                {task.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {task.priority}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Activity Summary */}
                <div>
                  <h3 className="mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm">{getLastActivity(selectedMember.id)}</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm">Started working on new task</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
