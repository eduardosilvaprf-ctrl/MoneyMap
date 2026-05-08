import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  closestCorners,
} from '@dnd-kit/core';
import { useKanbanStore } from '../store/useKanbanStore';
import { Task, TaskStatus, Column as ColumnType } from '../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

const COLUMNS: ColumnType[] = [
  { id: TaskStatus.PENDING, title: 'Pending' },
  { id: TaskStatus.OVERDUE, title: 'Overdue' },
  { id: TaskStatus.PAID, title: 'Paid' },
];

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function KanbanBoard({ onEditTask, onDeleteTask }: KanbanBoardProps) {
  const { tasks, reorderTasks, moveTask } = useKanbanStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = COLUMNS.some(col => col.id === overId);

    if (!isActiveATask) return;

    // Dropping a task over another task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex(t => t.id === activeId);
      const overIndex = tasks.findIndex(t => t.id === overId);

      if (tasks[activeIndex].status !== tasks[overIndex].status) {
        moveTask(activeId as string, tasks[overIndex].status);
      }
      
      reorderTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    // Dropping a task over a column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex(t => t.id === activeId);
      moveTask(activeId as string, overId as TaskStatus);
      reorderTasks(arrayMove(tasks, activeIndex, activeIndex));
    }
  };

  const onDragEnd = () => {
    setActiveTask(null);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-8 h-full p-8 overflow-x-auto pb-12 items-start justify-center min-w-max">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter((t) => t.status === col.id)}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeTask ? (
              <div className="w-[300px]">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
