// src/components/Column/Column.js
import React, { useState } from 'react';
import TaskCard from '../TaskCard/TaskCard'; // Adjusted import path

const Column = ({ title, tasks, columnId, onUpdateTaskStatus, onDeleteTask, onSuggestSubtasks, handleDragStart, handleDragOver, handleDrop }) => {
    const columnStyles = {
        todo: { bg: "bg-slate-800/50", titleColor: "text-rose-400", borderColor: "border-rose-500/30" },
        inprogress: { bg: "bg-slate-800/50", titleColor: "text-amber-400", borderColor: "border-amber-500/30" },
        done: { bg: "bg-slate-800/50", titleColor: "text-emerald-400", borderColor: "border-emerald-500/30" },
    };
    const styles = columnStyles[columnId] || { bg: "bg-slate-800/50", titleColor: "text-slate-400", borderColor: "border-slate-700" };
    const [isDragOver, setIsDragOver] = useState(false);

    return (
        <div
            className={`flex-1 p-5 rounded-xl shadow-md min-w-[300px] md:min-w-[320px] ${styles.bg} border ${isDragOver ? 'border-purple-500 ring-2 ring-purple-500' : styles.borderColor} flex flex-col transition-all duration-200`}
            onDragOver={(e) => { handleDragOver(e); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => { handleDrop(e, columnId); setIsDragOver(false); }}
        >
            <h2 className={`text-xl font-semibold mb-5 pb-3 border-b-2 ${styles.borderColor} ${styles.titleColor} flex justify-between items-center`}>
                {title} <span className="text-sm font-normal text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </h2>
            <div className="space-y-4 flex-grow h-[calc(100vh-360px)] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No tasks here yet.</p>}
                {tasks.map(task => <TaskCard key={task.id} task={task} onUpdateTaskStatus={onUpdateTaskStatus} onDeleteTask={onDeleteTask} onSuggestSubtasks={onSuggestSubtasks} handleDragStart={handleDragStart} />)}
            </div>
        </div>
    );
};
export default Column;
