import { useEffect, useState } from 'react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { Sparkles, Plus, FileText, UserPlus, Search, BarChart3, Calendar, MessageSquare } from 'lucide-react';
import { mockUsers, mockTasks } from '../lib/mock-data';

interface AICommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: () => void;
  onNavigate: (page: string) => void;
}

export function AICommandBar({ open, onOpenChange, onCreateTask, onNavigate }: AICommandBarProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleAICommand = (command: string) => {
    onOpenChange(false);
    // Simulate AI processing
    console.log('AI Command:', command);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Type a command or search... (try: /create task, /summarize, /find)" 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading={
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI Commands</span>
          </div>
        }>
          <CommandItem onSelect={() => handleAICommand('create-task')}>
            <Plus className="mr-2 h-4 w-4" />
            <span>/create task - Create a new task with AI assistance</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAICommand('summarize')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>/summarize - Generate weekly summary for stakeholders</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAICommand('assign')}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>/assign - Smart task assignment based on workload</span>
          </CommandItem>
          <CommandItem onSelect={() => handleAICommand('report')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>/generate report - Create detailed progress report</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => {
            onOpenChange(false);
            onCreateTask();
          }}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Task</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            onOpenChange(false);
            onNavigate('kanban');
          }}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Go to Kanban Board</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            onOpenChange(false);
            onNavigate('analytics');
          }}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>View Analytics</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            onOpenChange(false);
            onNavigate('chat');
          }}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Open Team Chat</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Team Members">
          {mockUsers.map((user) => (
            <CommandItem key={user.id} onSelect={() => {
              onOpenChange(false);
              onNavigate('team');
            }}>
              <Search className="mr-2 h-4 w-4" />
              <div className="flex items-center gap-2">
                <span>{user.name}</span>
                <span className="text-xs text-muted-foreground">- {user.role}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Tasks">
          {mockTasks.slice(0, 5).map((task) => (
            <CommandItem key={task.id} onSelect={() => onOpenChange(false)}>
              <Search className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>{task.title}</span>
                <span className="text-xs text-muted-foreground">{task.module}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        {search.startsWith('/') && (
          <>
            <CommandSeparator />
            <CommandGroup heading="AI Command Examples">
              <CommandItem className="text-muted-foreground text-sm">
                Example: /create task "Integrate Supabase Auth" assign Rajath priority high due 2025-10-31
              </CommandItem>
              <CommandItem className="text-muted-foreground text-sm">
                Example: /summarize week for Prof Mohan
              </CommandItem>
              <CommandItem className="text-muted-foreground text-sm">
                Example: /find member with React skills
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
