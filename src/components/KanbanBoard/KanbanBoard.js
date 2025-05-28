// src/components/KanbanBoard/KanbanBoard.js
import React, { useMemo } from 'react';
import Column from '../Column/Column'; // Adjusted import path

const KanbanBoard = ({ tasks, onUpdateTaskStatus, onDeleteTask, onSuggestSubtasks }) => {
    const todoTasks = useMemo(() => tasks.filter(task => task.status === 'todo'), [tasks]);
    const inProgressTasks = useMemo(() => tasks.filter(task => task.status === 'inprogress'), [tasks]);
    const doneTasks = useMemo(() => tasks.filter(task => task.status === 'done'), [tasks]);

    const handleDragStart = (e, taskId) => { e.dataTransfer.setData("taskId", taskId); };
    const handleDragOver = (e) => { e.preventDefault(); };
    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== targetStatus) { onUpdateTaskStatus(taskId, targetStatus); }
    };

    return (
        <div className="flex flex-col md:flex-row gap-5 p-4 md:p-1 bg-slate-900/0 min-h-[calc(100vh-200px)]">
            <Column title="Pending" tasks={todoTasks} columnId="todo" onUpdateTaskStatus={onUpdateTaskStatus} onDeleteTask={onDeleteTask} onSuggestSubtasks={onSuggestSubtasks} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />
            <Column title="Active" tasks={inProgressTasks} columnId="inprogress" onUpdateTaskStatus={onUpdateTaskStatus} onDeleteTask={onDeleteTask} onSuggestSubtasks={onSuggestSubtasks} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />
            <Column title="Completed" tasks={doneTasks} columnId="done" onUpdateTaskStatus={onUpdateTaskStatus} onDeleteTask={onDeleteTask} onSuggestSubtasks={onSuggestSubtasks} handleDragStart={handleDragStart} handleDragOver={handleDragOver} handleDrop={handleDrop} />
        </div>
    );
};
export default KanbanBoard;