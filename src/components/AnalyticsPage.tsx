import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download, FileText, Sparkles, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockTasks, mockUsers, modules } from '../lib/mock-data';

export function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [reportTone, setReportTone] = useState('concise');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState('');

  // Task distribution by member
  const memberData = mockUsers.filter(u => u.role !== 'Stakeholder').map(user => ({
    name: user.name,
    tasks: mockTasks.filter(t => t.assigneeId === user.id).length,
    completed: mockTasks.filter(t => t.assigneeId === user.id && t.status === 'Completed').length,
  }));

  // Task distribution by priority
  const priorityData = [
    { name: 'High', value: mockTasks.filter(t => t.priority === 'High').length, color: '#EF4444' },
    { name: 'Medium', value: mockTasks.filter(t => t.priority === 'Medium').length, color: '#F59E0B' },
    { name: 'Low', value: mockTasks.filter(t => t.priority === 'Low').length, color: '#3B82F6' },
  ];

  // Module completion data
  const moduleCompletion = modules.map(module => {
    const moduleTasks = mockTasks.filter(t => t.module === module);
    const completed = moduleTasks.filter(t => t.status === 'Completed').length;
    const total = moduleTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      module,
      total,
      completed,
      inProgress: moduleTasks.filter(t => t.status === 'In Progress').length,
      pending: moduleTasks.filter(t => t.status === 'Pending').length,
      percentage,
    };
  });

  // Velocity data (tasks completed per week)
  const velocityData = [
    { week: 'Week 1', completed: 2, planned: 3 },
    { week: 'Week 2', completed: 3, planned: 3 },
    { week: 'Week 3', completed: 2, planned: 2 },
    { week: 'Week 4', completed: 4, planned: 3 },
    { week: 'Week 5', completed: 3, planned: 4 },
    { week: 'Week 6', completed: 4, planned: 4 },
  ];

  const handleGenerateReport = () => {
    setGeneratingReport(true);

    setTimeout(() => {
      const completedTasks = mockTasks.filter(t => t.status === 'Completed').length;
      const totalTasks = mockTasks.length;
      const completionRate = Math.round((completedTasks / totalTasks) * 100);

      let report = '';
      
      if (reportTone === 'concise') {
        report = `Project Status Summary

Overall Progress: ${completionRate}% (${completedTasks}/${totalTasks} tasks)

Key Metrics:
• ${mockTasks.filter(t => t.status === 'Completed').length} tasks completed
• ${mockTasks.filter(t => t.status === 'In Progress').length} tasks in progress
• ${mockTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length} high-priority items pending

Top Performers:
${memberData.sort((a, b) => b.completed - a.completed).slice(0, 2).map(m => `• ${m.name}: ${m.completed} tasks completed`).join('\n')}

Next Steps: Focus on high-priority Authentication and AI/ML modules.`;
      } else if (reportTone === 'detailed') {
        report = `AyuDost Project - Detailed Progress Report
Generated on ${new Date().toLocaleDateString()}

Executive Summary:
The project is currently at ${completionRate}% completion with ${completedTasks} out of ${totalTasks} tasks completed. The team has made significant progress across multiple modules, with particularly strong performance in UI/UX and Database development.

Module Breakdown:
${moduleCompletion.map(m => `• ${m.module}: ${m.percentage}% complete (${m.completed}/${m.total} tasks)`).join('\n')}

Team Performance:
${memberData.map(m => `• ${m.name}: ${m.completed}/${m.tasks} tasks completed (${Math.round((m.completed/m.tasks)*100)}%)`).join('\n')}

Risk Assessment:
• High-priority items: ${mockTasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length} tasks require immediate attention
• Blockers: None currently identified
• Timeline: On track for milestone deliverables

Recommendations:
1. Prioritize Authentication module completion
2. Allocate additional resources to AI/ML model training
3. Maintain current velocity for remaining sprints`;
      } else {
        report = `Professor-Friendly Progress Report
AyuDost Health-Tech Dashboard Project

Dear Prof. Mohan A R,

I am pleased to present the current status of the AyuDost Dashboard project:

Project Overview:
Our team of four students has successfully completed ${completionRate}% of the planned work, with ${completedTasks} tasks finished and ${mockTasks.filter(t => t.status === 'In Progress').length} currently in progress.

Technical Achievements:
1. Database Architecture: Successfully designed and implemented using Supabase
2. User Interface: Responsive dashboard with modern design principles
3. AI/ML Integration: Model training underway with promising initial results
4. Authentication System: Implementation in final stages

Team Contributions:
${memberData.map(m => `• ${m.name}: ${m.completed} deliverables completed`).join('\n')}

Upcoming Milestones:
• Presentation 1: November 1, 2025
• Mid-term Review: November 15, 2025
• Final Submission: December 10, 2025

All milestones are on track for timely completion. The team is maintaining strong collaboration and code quality standards.

Best regards,
AyuDost Development Team`;
      }

      setGeneratedReport(report);
      setGeneratingReport(false);
    }, 2000);
  };

  const handleExport = (format: 'pdf' | 'docx') => {
    // Mock export functionality
    console.log(`Exporting report as ${format}`);
    alert(`Report would be exported as ${format.toUpperCase()}`);
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
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div>
        <h1>Analytics & Reports</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive insights and AI-powered report generation
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {Math.round((mockTasks.filter(t => t.status === 'Completed').length / mockTasks.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Team Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">3.5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks per week
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">On-Time Delivery</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">85%</div>
            <p className="text-xs text-muted-foreground mt-1">
              -5% from target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Distribution by Member */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Task Distribution by Member</CardTitle>
            <CardDescription>Total vs completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={memberData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#9CA3AF" name="Total Tasks" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution by Priority */}
        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Distribution across priority levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Velocity Chart */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>Team Velocity</CardTitle>
          <CardDescription>Completed vs planned tasks per week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#9CA3AF" strokeWidth={2} name="Planned" />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Module Completion Table */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>Module Completion Status</CardTitle>
          <CardDescription>Detailed breakdown by module</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>In Progress</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moduleCompletion.map((module) => (
                <TableRow key={module.module}>
                  <TableCell>{module.module}</TableCell>
                  <TableCell>{module.total}</TableCell>
                  <TableCell className="text-primary">{module.completed}</TableCell>
                  <TableCell className="text-accent">{module.inProgress}</TableCell>
                  <TableCell className="text-muted-foreground">{module.pending}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${module.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {module.percentage}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Report Generator */}
      <Card className="rounded-xl shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Report Generator
          </CardTitle>
          <CardDescription>
            Generate comprehensive reports with customizable timeframe and tone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm">Report Tone</label>
              <Select value={reportTone} onValueChange={setReportTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="professor">Professor-Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="w-full bg-primary hover:bg-primary/90 h-11"
          >
            {generatingReport ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Report
              </>
            )}
          </Button>

          {generatedReport && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4>Generated Report</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport('pdf')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport('docx')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      DOCX
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap text-sm">
                  {generatedReport}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
