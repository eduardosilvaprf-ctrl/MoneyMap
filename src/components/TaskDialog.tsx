import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useKanbanStore } from '../store/useKanbanStore';
import { Task, TaskStatus } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import React from 'react';

interface TaskDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus?: TaskStatus;
}

export function TaskDialog({ task, open, onOpenChange, defaultStatus }: TaskDialogProps) {
  const { t } = useTranslation();
  const { addTask, updateTask } = useKanbanStore();
  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    dueDate: '',
    notes: '',
    status: TaskStatus.PENDING,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        amount: task.amount.toString(),
        dueDate: task.dueDate,
        notes: task.notes,
        status: task.status,
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        dueDate: new Date().toISOString().split('T')[0],
        notes: '',
        status: defaultStatus || TaskStatus.PENDING,
      });
    }
  }, [task, open, defaultStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      name: formData.name,
      amount: parseFloat(formData.amount) || 0,
      dueDate: formData.dueDate,
      notes: formData.notes,
      status: formData.status as TaskStatus,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground font-bold tracking-tight">
            {task ? t('kanban.editTask') : t('kanban.addTask')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name" className="text-muted-foreground text-xs font-bold uppercase">{t('task.name')}</Label>
            <Input
              id="name"
              required
              className="bg-muted border-border focus:border-primary transition-colors"
              placeholder={t('task.placeholders.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount" className="text-muted-foreground text-xs font-bold uppercase">{t('task.amount')}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                required
                className="bg-muted border-border focus:border-primary transition-colors"
                placeholder={t('task.placeholders.amount')}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="dueDate" className="text-muted-foreground text-xs font-bold uppercase">{t('task.dueDate')}</Label>
              <Input
                id="dueDate"
                type="date"
                required
                className="bg-muted border-border focus:border-primary transition-colors"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="status" className="text-muted-foreground text-xs font-bold uppercase">{t('task.status')}</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => setFormData({ ...formData, status: val as TaskStatus })}
            >
              <SelectTrigger className="bg-muted border-border focus:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.PENDING}>{t('kanban.columns.pending')}</SelectItem>
                <SelectItem value={TaskStatus.OVERDUE}>{t('kanban.columns.overdue')}</SelectItem>
                <SelectItem value={TaskStatus.PAID}>{t('kanban.columns.paid')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="notes" className="text-muted-foreground text-xs font-bold uppercase">{t('task.notes')}</Label>
            <textarea
              id="notes"
              className="bg-muted border-border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={t('task.placeholders.notes')}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="border-border hover:bg-accent" onClick={() => onOpenChange(false)}>
              {t('task.cancel')}
            </Button>
            <Button type="submit" className="bg-primary hover:opacity-90 text-primary-foreground font-bold">{t('task.save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
