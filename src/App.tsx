import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewDashboard } from './components/OverviewDashboard';
import { KanbanBoard } from './components/KanbanBoard';
import { TimelineView } from './components/TimelineView';
import { TeamPage } from './components/TeamPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { SettingsPage } from './components/SettingsPage';
import { ChatPage } from './components/ChatPage';
import { TaskModal } from './components/TaskModal';
import { Toaster } from './components/ui/sonner';
import { Task } from './lib/types';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState('overview');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
      }

      if (session?.access_token) {
        setAccessToken(session.access_token);
        setCurrentUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name,
          role: session.user.user_metadata?.role,
        });
        setIsLoggedIn(true);
        toast.success('Welcome back!');
      }
    } catch (err) {
      console.error('Error checking session:', err);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleLogin = (token: string, user: any) => {
    setAccessToken(token);
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setAccessToken('');
      setCurrentUser(null);
      setCurrentPage('overview');
      toast.success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Logout failed');
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleOpenTaskModal = (task?: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    // In a real app, this would save to the database
    console.log('Saving task:', taskData);
    handleCloseTaskModal();
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewDashboard />;
      case 'kanban':
        return <KanbanBoard onOpenTaskModal={handleOpenTaskModal} />;
      case 'timeline':
        return <TimelineView />;
      case 'team':
        return <TeamPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'chat':
        return <ChatPage accessToken={accessToken} currentUser={currentUser} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <>
      <DashboardLayout
        currentPage={currentPage}
        currentUser={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onCreateTask={() => handleOpenTaskModal()}
      >
        {renderPage()}
      </DashboardLayout>

      <TaskModal
        open={taskModalOpen}
        onOpenChange={handleCloseTaskModal}
        task={editingTask}
        onSave={handleSaveTask}
      />

      <Toaster position="top-right" />
    </>
  );
}
