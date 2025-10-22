import { ReactNode, useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  GanttChart, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  LogOut, 
  User,
  Heart,
  Command,
  Menu,
  X,
  MessageSquare
} from 'lucide-react';
import { mockUsers } from '../lib/mock-data';
import { AICommandBar } from './AICommandBar';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  currentUser?: any;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onCreateTask: () => void;
}

export function DashboardLayout({ children, currentPage, currentUser, onNavigate, onLogout, onCreateTask }: DashboardLayoutProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const displayUser = currentUser || mockUsers[0]; // Fallback to mock user

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'kanban', label: 'Kanban Board', icon: KanbanSquare },
    { id: 'timeline', label: 'Timeline', icon: GanttChart },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:inline-block">AyuDost</span>
          </div>

          {/* Search / Command Bar Trigger */}
          <Button
            variant="outline"
            className="hidden md:flex items-center gap-2 w-64 justify-start text-muted-foreground"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span>Search or command...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] opacity-100">
              <Command className="h-3 w-3" />K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p>Task assigned to you</p>
                  <p className="text-xs text-muted-foreground">Rithesh assigned "AI Model Training" - 2h ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p>Deadline approaching</p>
                  <p className="text-xs text-muted-foreground">"Database Schema" due in 3 days</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p>New comment</p>
                  <p className="text-xs text-muted-foreground">Rajath commented on "Supabase Auth" - 5h ago</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                  <AvatarFallback>{displayUser.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p>{displayUser.name}</p>
                  <p className="text-xs text-muted-foreground">{displayUser.email}</p>
                  <Badge variant="secondary" className="w-fit mt-1">{displayUser.role}</Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 border-r bg-card min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start ${isActive ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm lg:hidden">
            <aside className="fixed left-0 top-16 w-64 border-r bg-card h-[calc(100vh-4rem)] overflow-y-auto">
              <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start ${isActive ? 'bg-primary text-white hover:bg-primary/90' : ''}`}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* AI Command Bar */}
      <AICommandBar 
        open={commandOpen} 
        onOpenChange={setCommandOpen}
        onCreateTask={onCreateTask}
        onNavigate={onNavigate}
      />
    </div>
  );
}
