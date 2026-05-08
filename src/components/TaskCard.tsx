import { useTranslation } from 'react-i18next';
import { Task, TaskStatus } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MoreVertical, Edit, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TaskCardProps {
  key?: string;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const statusThemes = {
    [TaskStatus.PENDING]: 'hover:border-amber-500/50',
    [TaskStatus.OVERDUE]: 'bg-rose-500/5 border-rose-500/20 border-l-4 border-l-rose-500 hover:border-rose-500/50',
    [TaskStatus.PAID]: 'opacity-70 grayscale group hover:opacity-100 hover:grayscale-0 transition-all',
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 h-[140px] rounded-xl border-2 border-dashed border-indigo-500"
      />
    );
  }

  const isOverdue = task.status === TaskStatus.OVERDUE;
  const isPaid = task.status === TaskStatus.PAID;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border border-border p-4 rounded-xl shadow-sm transition-all group dark:bg-slate-900 border-slate-800",
        statusThemes[task.status]
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-start">
          <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors pr-1">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1 items-start">
            <h3 className={cn("font-semibold text-foreground truncate max-w-[150px] md:max-w-[180px]", isPaid && "line-through decoration-muted-foreground text-muted-foreground")}>
              {task.name}
            </h3>
            {isOverdue && (
              <span className="text-[10px] font-bold text-rose-500 uppercase px-1.5 py-0.5 bg-rose-500/10 rounded tracking-wider">Urgent</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {isPaid && (
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md w-6 h-6 text-slate-500 hover:text-foreground hover:bg-muted transition-colors outline-none">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('kanban.editTask')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-rose-500 focus:text-rose-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('kanban.deleteTask')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
        {task.notes || <span className="italic opacity-30">No additional notes provided.</span>}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{t('task.amount')}</span>
          <span className={cn("text-sm font-bold", isOverdue ? "text-rose-400" : isPaid ? "text-muted-foreground" : "text-foreground")}>
            {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(task.amount)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-tight">
            {isPaid ? "Paid On" : t('task.dueDate')}
          </span>
          <span className={cn(
            "text-xs font-medium",
            isOverdue ? "text-rose-500 font-bold" : isPaid ? "text-emerald-600" : "text-muted-foreground"
          )}>
            {isOverdue && "OVERDUE "}
            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
}
