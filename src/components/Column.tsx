import { useTranslation } from 'react-i18next';
import { Column as ColumnType, Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../lib/utils';

interface ColumnProps {
  key?: string;
  column: ColumnType;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function Column({ column, tasks, onEditTask, onDeleteTask }: ColumnProps) {
  const { t } = useTranslation();
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const columnColors = {
    [TaskStatus.PENDING]: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    [TaskStatus.OVERDUE]: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
    [TaskStatus.PAID]: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  };

  return (
    <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px] h-full gap-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", columnColors[column.id])}></span>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {t(`kanban.columns.${column.id}`)}
          </h2>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 min-h-[500px]"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          ) : (
            <div className="h-40 flex items-center justify-center border border-border border-dashed rounded-xl bg-muted/20">
              <p className="text-xs font-medium italic text-muted-foreground/60">{t('kanban.noTasks')}</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
