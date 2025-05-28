// src/components/TaskCard/TaskCard.js
import React from 'react';
import { SparklesIcon, Trash2Icon } from '../icons'; // Adjusted import path

const TaskCard = ({ task, onUpdateTaskStatus, onDeleteTask, onSuggestSubtasks, handleDragStart }) => {
    const { id, title, description, status } = task;
    const handleStatusChange = (e) => onUpdateTaskStatus(id, e.target.value);

    const statusColors = {
        todo: "border-l-rose-500",
        inprogress: "border-l-amber-500",
        done: "border-l-emerald-500",
    };

    return (
        <div
            draggable={true}
            onDragStart={(e) => handleDragStart(e, id)}
            className={`bg-slate-800 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${statusColors[status] || 'border-l-slate-600'} border border-slate-700 hover:border-slate-600 cursor-grab active:cursor-grabbing`}
        >
            <h3 className="font-semibold text-lg mb-2 text-slate-100">{title}</h3>
            <p className="text-slate-400 text-sm mb-4 whitespace-pre-wrap break-words">{description || "No description."}</p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <select value={status} onChange={handleStatusChange} className="w-full sm:w-auto bg-slate-700 text-slate-200 p-2 border border-slate-600 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors">
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                </select>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => onSuggestSubtasks(task)} className="flex-1 sm:flex-none text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-1.5">
                        <SparklesIcon className="w-4 h-4" /> Sub-tasks
                    </button>
                    <button onClick={() => onDeleteTask(id)} className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/20 rounded-md transition-colors">
                        <Trash2Icon />
                    </button>
                </div>
            </div>
        </div>
    );
};
export default TaskCard;
