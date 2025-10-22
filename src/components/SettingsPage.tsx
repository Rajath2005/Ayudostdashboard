import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Database, Bell, Users, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [taskUpdates, setTaskUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
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
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Header */}
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage project settings and integrations
        </p>
      </div>

      <Tabs defaultValue="project" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        {/* Project Settings */}
        <TabsContent value="project" className="space-y-4">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                Basic project configuration and details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input 
                  id="project-name" 
                  defaultValue="AyuDost Dashboard"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-desc">Description</Label>
                <Input 
                  id="project-desc" 
                  defaultValue="Health-Tech Project Management Dashboard"
                  className="h-11"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date"
                    defaultValue="2025-10-01"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date" 
                    type="date"
                    defaultValue="2025-12-15"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guide">Project Guide</Label>
                <Input 
                  id="guide" 
                  defaultValue="Prof. Mohan A R"
                  className="h-11"
                />
              </div>

              <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Integration
              </CardTitle>
              <CardDescription>
                Configure Supabase or Firebase connection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Backend Provider</Label>
                <Select defaultValue="supabase">
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">Supabase</SelectItem>
                    <SelectItem value="firebase">Firebase</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  For security, API keys are stored securely and not displayed here.
                  Connect your project below to configure authentication.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="supabase-url">Supabase Project URL</Label>
                <Input 
                  id="supabase-url" 
                  placeholder="https://xxxxx.supabase.co"
                  type="password"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supabase-key">Supabase Anon Key</Label>
                <Input 
                  id="supabase-key" 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  type="password"
                  className="h-11"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button className="bg-primary hover:bg-primary/90">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button variant="outline">
                  Save Integration
                </Button>
              </div>

              <Separator />

              <div>
                <h4 className="mb-3">Connection Status</h4>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span>Connected to mock data (for demo purposes)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                REST API endpoints for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm">GET /api/tasks</p>
                    <p className="text-xs text-muted-foreground">Retrieve all tasks</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm">POST /api/tasks</p>
                    <p className="text-xs text-muted-foreground">Create new task</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm">GET /api/users</p>
                    <p className="text-xs text-muted-foreground">Get team members</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Example payload structure available in developer documentation.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates for important events
                  </p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get browser notifications for updates
                  </p>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when tasks are assigned or updated
                  </p>
                </div>
                <Switch 
                  checked={taskUpdates}
                  onCheckedChange={setTaskUpdates}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary every Monday
                  </p>
                </div>
                <Switch 
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                />
              </div>

              <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management */}
        <TabsContent value="team" className="space-y-4">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Management
              </CardTitle>
              <CardDescription>
                Manage team member permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Only Team Leaders can modify role permissions.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4>Team Leader</h4>
                      <p className="text-sm text-muted-foreground">Full access to all features</p>
                    </div>
                    <Badge>Admin</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Manage team members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Edit project settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Delete tasks</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4>Team Member</h4>
                      <p className="text-sm text-muted-foreground">Standard access</p>
                    </div>
                    <Badge variant="secondary">Member</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Create and edit own tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>View team tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Comment on tasks</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4>Stakeholder</h4>
                      <p className="text-sm text-muted-foreground">View-only access</p>
                    </div>
                    <Badge variant="outline">Viewer</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>View all tasks and reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Generate reports</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
