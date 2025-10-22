import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { CheckCircle2, Clock, AlertTriangle, ListTodo, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockTasks, mockUsers, mockActivities } from '../lib/mock-data';

export function OverviewDashboard() {
  const completedTasks = mockTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = mockTasks.filter(t => t.status === 'In Progress').length;
  const blockerTasks = mockTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
  const totalTasks = mockTasks.length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  // Chart data
  const statusData = [
    { name: 'Completed', value: mockTasks.filter(t => t.status === 'Completed').length, color: '#10B981' },
    { name: 'In Progress', value: mockTasks.filter(t => t.status === 'In Progress').length, color: '#F59E0B' },
    { name: 'In Review', value: mockTasks.filter(t => t.status === 'In Review').length, color: '#3B82F6' },
    { name: 'Pending', value: mockTasks.filter(t => t.status === 'Pending').length, color: '#9CA3AF' },
  ];

  const burndownData = [
    { week: 'Week 1', planned: 40, actual: 38 },
    { week: 'Week 2', planned: 32, actual: 30 },
    { week: 'Week 3', planned: 24, actual: 22 },
    { week: 'Week 4', planned: 16, actual: 18 },
    { week: 'Week 5', planned: 8, actual: 10 },
    { week: 'Week 6', planned: 0, actual: 5 },
  ];

  const moduleData = [
    { module: 'AI/ML', tasks: mockTasks.filter(t => t.module === 'AI/ML').length },
    { module: 'Backend', tasks: mockTasks.filter(t => t.module === 'Database').length },
    { module: 'Frontend', tasks: mockTasks.filter(t => t.module === 'UI/UX').length },
    { module: 'Auth', tasks: mockTasks.filter(t => t.module === 'Authentication').length },
    { module: 'Docs', tasks: mockTasks.filter(t => t.module === 'Documentation').length },
  ];

  const getRecentActivities = () => {
    return mockActivities.map(activity => {
      const user = mockUsers.find(u => u.id === activity.userId);
      const task = activity.taskId ? mockTasks.find(t => t.id === activity.taskId) : null;
      return { ...activity, user, task };
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
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
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div>
        <h1>Project Overview</h1>
        <p className="text-muted-foreground mt-2">
          Track your team's progress and key metrics at a glance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Out of {totalTasks} total tasks
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Currently being worked on
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{blockerTasks}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution Doughnut */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Task Distribution</CardTitle>
            <CardDescription>Tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Burndown Chart */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Burndown Chart</CardTitle>
            <CardDescription>Progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#9CA3AF" strokeWidth={2} name="Planned" />
                <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Module Tasks Bar Chart */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>Tasks by Module</CardTitle>
          <CardDescription>Distribution across project modules</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moduleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="module" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity & Team Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest team updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getRecentActivities().map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.user?.avatar} />
                    <AvatarFallback>{activity.user?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user?.name}</span>
                      {' '}{activity.action}{' '}
                      {activity.task && (
                        <span className="text-primary">"{activity.task.title}"</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Activity Cards */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Team Workload
            </CardTitle>
            <CardDescription>Current task assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.slice(0, 4).map((user) => {
                const userTasks = mockTasks.filter(t => t.assigneeId === user.id);
                const completedCount = userTasks.filter(t => t.status === 'Completed').length;
                const progress = userTasks.length > 0 ? Math.round((completedCount / userTasks.length) * 100) : 0;

                return (
                  <div key={user.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{userTasks.length} tasks</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{progress}%</Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
