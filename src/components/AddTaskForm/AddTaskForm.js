// src/components/AddTaskForm/AddTaskForm.js
import React, { useState } from 'react';
import { callGeminiApi } from '../../services/geminiApi'; // Adjusted import path
import { PlusCircleIcon, SparklesIcon } from '../icons'; // Adjusted import path

const AddTaskForm = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

    const handleGenerateDescription = async () => {
        if (!title.trim()) { setError('Please enter a title first.'); return; }
        setError(''); setIsGeneratingDesc(true);
        try {
            const prompt = `Generate a concise task description (around 20-40 words) for the task titled: "${title}". Focus on action items or key objectives.`;
            const generatedDesc = await callGeminiApi(prompt);
            setDescription(generatedDesc);
        } catch (apiError) { console.error("Error generating description:", apiError); setError('Failed to generate description. ' + apiError.message); }
        finally { setIsGeneratingDesc(false); }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) { setError('Title is required.'); return; }
        setError(''); onAddTask({ title, description }); setTitle(''); setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-5 bg-slate-800 shadow-xl rounded-xl mb-8 border border-slate-700">
            <h2 className="text-2xl font-semibold mb-5 text-slate-100">Create New Task</h2>
            {error && <p className="text-rose-400 text-sm mb-3 bg-rose-500/10 p-2 rounded-md">{error}</p>}
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Task Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2.5 bg-slate-700 text-slate-200 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="e.g., Design new homepage" />
            </div>
            <div className="mb-5">
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-300">Details</label>
                    <button type="button" onClick={handleGenerateDescription} disabled={isGeneratingDesc || !title.trim()} className="text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium py-1.5 px-3 rounded-md transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5">
                        {isGeneratingDesc ? <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <SparklesIcon className="w-3.5 h-3.5" />}
                        Generate
                    </button>
                </div>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2.5 bg-slate-700 text-slate-200 border border-slate-600 rounded-md h-28 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors custom-scrollbar" placeholder="Add more details or let AI generate them..." />
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 flex items-center justify-center gap-2">
                <PlusCircleIcon /> Add Task
            </button>
        </form>
    );
};
export default AddTaskForm;

