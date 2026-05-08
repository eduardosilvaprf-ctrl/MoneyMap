import { useTranslation } from 'react-i18next';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Moon, Sun, Languages, Plus } from 'lucide-react';
import { Language, TaskStatus } from '../types';
import { useKanbanStore } from '../store/useKanbanStore';

interface NavbarProps {
  onAddTask: () => void;
}

export function Navbar({ onAddTask }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { setTheme, theme } = useTheme();
  const { tasks } = useKanbanStore();

  const changeLanguage = (lng: Language) => {
    i18n.changeLanguage(lng);
  };

  const pendingAmount = tasks
    .filter(t => t.status === TaskStatus.PENDING)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const overdueAmount = tasks
    .filter(t => t.status === TaskStatus.OVERDUE)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <nav className="h-16 border-b border-border flex items-center justify-between px-8 shrink-0 bg-background/80 backdrop-blur-xl sticky top-0 z-50 w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground uppercase italic leading-none">
          MoneyMap <span className="text-muted-foreground font-medium text-sm ml-1 lowercase not-italic">{t('kanban.title', 'Kanban')}</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Stats */}
        <div className="hidden lg:flex gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-r border-border pr-6">
          <div className="flex flex-col">
            <span className="text-[10px] opacity-60 leading-tight">{t('kanban.columns.pending')}</span>
            <span className="text-amber-500 font-mono">
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(pendingAmount)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] opacity-60 leading-tight">{t('kanban.columns.overdue')}</span>
            <span className="text-rose-500 font-mono">
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(overdueAmount)}
            </span>
          </div>
        </div>

        {/* Control Bar */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border border-border bg-muted h-9 px-3 text-xs font-medium uppercase text-foreground hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span>{i18n.language}</span>
              <Languages className="ml-2 h-3 w-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('pt')}>Português (BR)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('it')}>Italiano</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>Français</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            size="sm" 
            className="p-2 bg-muted hover:bg-accent border-border text-foreground relative h-9 w-9"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button 
            onClick={onAddTask} 
            className="ml-2 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground text-sm font-medium rounded-md shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('kanban.addTask')}</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
