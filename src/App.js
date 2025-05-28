// src/App.js (Main application component - UPDATED)
import React, { useState, useEffect } from 'react';
import { 
    db as firestoreDb, // Renamed to avoid conflict with local 'db' state
    auth as firebaseAuth, // Renamed
    appId, 
    initialAuthToken,
    onAuthStateChanged, 
    signInAnonymously, 
    signInWithCustomToken,
    collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, serverTimestamp
} from './firebase'; // Firebase setup

import { callGeminiApi } from './services/geminiApi';
import AddTaskForm from './components/AddTaskForm/AddTaskForm';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Modal from './components/Modal/Modal';
import ConfettiCannon from './components/ConfettiCannon/ConfettiCannon';
import { PlusCircleIcon } from './components/icons';


function App() {
    const [currentDb, setCurrentDb] = useState(null); // Local state for db instance
    const [currentAuth, setCurrentAuth] = useState(null); // Local state for auth instance
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appError, setAppError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [tasksCollectionPath, setTasksCollectionPath] = useState('');
    const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
    const [currentTaskForSubtasks, setCurrentTaskForSubtasks] = useState(null);
    const [subtaskSuggestions, setSubtaskSuggestions] = useState([]);
    const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);
    const [subtaskError, setSubtaskError] = useState(null);

    useEffect(() => {
        // Check if Firebase was initialized correctly in firebase.js
        if (!firestoreDb || !firebaseAuth) {
            console.warn("Firebase services not available from firebase.js. App might not function correctly.");
            setAppError("Firebase configuration is missing or failed to initialize.");
            setLoading(false);
            setIsAuthReady(true);
            return;
        }
        setCurrentDb(firestoreDb); // Set local state
        setCurrentAuth(firebaseAuth); // Set local state

        const unsubAuth = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                setUserId(user.uid);
                setTasksCollectionPath(`artifacts/${appId}/users/${user.uid}/tasks`);
            } else {
                if (initialAuthToken) {
                    try { await signInWithCustomToken(firebaseAuth, initialAuthToken); }
                    catch (e) { console.error("Custom token sign-in error:", e); setAppError("Authentication failed."); try { await signInAnonymously(firebaseAuth); } catch (eAnon) { console.error(eAnon); setAppError("Failed to sign in anonymously after custom token failure."); } }
                } else {
                    try { await signInAnonymously(firebaseAuth); } catch (eAnon) { console.error(eAnon); setAppError("Failed to sign in anonymously."); }
                }
            }
            setIsAuthReady(true);
        });
        return () => unsubAuth();
    }, []); // Empty dependency array as firebase.js handles initialization

    useEffect(() => {
        if (!isAuthReady || !currentDb || !userId || !tasksCollectionPath) {
            if (isAuthReady && !userId && firestoreDb) { setLoading(false); } // Only stop loading if auth is ready but no user
            return;
        }
        setLoading(true); setAppError(null);
        const q = query(collection(currentDb, tasksCollectionPath));
        const unsubTasks = onSnapshot(q, (snap) => {
            const tasksData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            tasksData.sort((a, b) => {
                const order = { todo: 0, inprogress: 1, done: 2 };
                if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
                return (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0) - (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0);
            });
            setTasks(tasksData); setLoading(false);
        }, (err) => { console.error("Error fetching tasks:", err); setAppError("Failed to fetch tasks. " + err.message); setLoading(false); });
        return () => unsubTasks();
    }, [isAuthReady, currentDb, userId, tasksCollectionPath]);

    const handleAddTask = async (taskData) => {
        if (!currentDb || !userId || !tasksCollectionPath) { setAppError("Cannot add task: Database connection issue."); return; }
        try { await addDoc(collection(currentDb, tasksCollectionPath), { ...taskData, status: 'todo', userId: userId, createdAt: serverTimestamp() }); }
        catch (err) { console.error("Error adding task:", err); setAppError("Failed to add task. " + err.message); }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        if (!currentDb || !tasksCollectionPath) { setAppError("Cannot update task: Database connection issue."); return; }
        try {
            const taskToUpdate = tasks.find(t => t.id === taskId);
            if (taskToUpdate && taskToUpdate.status === newStatus) return;
            await updateDoc(doc(currentDb, tasksCollectionPath, taskId), { status: newStatus });
            if (newStatus === 'done' && (!taskToUpdate || taskToUpdate.status !== 'done')) {
                setShowConfetti(true);
            }
        }
        catch (err) { console.error("Error updating task:", err); setAppError("Failed to update task. " + err.message); }
    };

    const handleDeleteTask = async (taskId) => {
        if (!currentDb || !tasksCollectionPath) { setAppError("Cannot delete task: Database connection issue."); return; }
        try { await deleteDoc(doc(currentDb, tasksCollectionPath, taskId)); }
        catch (err) { console.error("Error deleting task:", err); setAppError("Failed to delete task. " + err.message); }
    };

    const handleSuggestSubtasks = async (task) => {
        setCurrentTaskForSubtasks(task); setIsSubtaskModalOpen(true); setIsGeneratingSubtasks(true); setSubtaskError(null); setSubtaskSuggestions([]);
        try {
            const prompt = `Break down the task: "${task.title}" (Description: "${task.description || 'N/A'}") into 3-5 actionable sub-task titles. Return as JSON: {"suggestions": ["Subtask 1", "Subtask 2", ...]}.`;
            const result = await callGeminiApi(prompt, true);
            if (result?.suggestions && Array.isArray(result.suggestions)) { setSubtaskSuggestions(result.suggestions); }
            else { console.error("Invalid sub-task suggestions format:", result); setSubtaskSuggestions([]); setSubtaskError("Unexpected format for sub-tasks."); }
        } catch (apiError) { console.error("Error generating sub-tasks:", apiError); setSubtaskError('Failed to generate sub-tasks. ' + apiError.message); }
        finally { setIsGeneratingSubtasks(false); }
    };
    
    const handleAddSubtaskAsNewTask = (subtaskTitle) => {
        handleAddTask({ title: subtaskTitle, description: `Sub-task for: "${currentTaskForSubtasks?.title}"` });
    };
    
    if (!isAuthReady && firestoreDb) return <div className="flex justify-center items-center h-screen bg-slate-900 text-slate-300 text-lg">Initializing TaskFlow AI...</div>;
    if (!firestoreDb) return <div className="p-6 text-center text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg m-4">Firebase is not configured. TaskFlow AI cannot save or load data.</div>;

    return (
        <div className="min-h-screen bg-slate-900 font-sans flex flex-col text-slate-200">
            {/* Global styles are now in index.css, including body background */}
            <header className="bg-slate-800/50 backdrop-blur-md text-white p-5 shadow-lg border-b border-slate-700 sticky top-0 z-30">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 mb-2 sm:mb-0">
                        TaskFlow AI
                    </h1>
                    {userId && <p className="text-xs text-slate-400">User: <span className="font-mono bg-slate-700 px-1.5 py-0.5 rounded">{userId.substring(0,12)}...</span></p>}
                </div>
            </header>

            <main className="container mx-auto p-4 md:px-6 md:py-8 flex-grow">
                {appError && <div className="bg-rose-500/20 border border-rose-500/40 text-rose-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                    <strong className="font-bold">Oops! </strong> <span className="block sm:inline">{appError}</span>
                </div>}

                {!userId && firestoreDb && !loading && !appError && (
                     <div className="p-4 text-center text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        Authenticating... Please wait.
                    </div>
                )}

                {userId && <AddTaskForm onAddTask={handleAddTask} />}
                
                {loading && isAuthReady && firestoreDb && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                        <p className="mt-4 text-slate-400">Loading your tasks...</p>
                    </div>
                )}

                {!loading && userId && tasks.length === 0 && firestoreDb && !appError && (
                     <div className="p-6 text-center text-slate-400 bg-slate-800/60 border border-slate-700 rounded-lg">
                        No tasks yet. Create your first task to get started with TaskFlow AI!
                    </div>
                )}
                
                {!loading && userId && tasks.length > 0 && (
                    <KanbanBoard tasks={tasks} onUpdateTaskStatus={handleUpdateTaskStatus} onDeleteTask={handleDeleteTask} onSuggestSubtasks={handleSuggestSubtasks} />
                )}
            </main>
            <ConfettiCannon active={showConfetti} />
            <Modal isOpen={isSubtaskModalOpen} onClose={() => setIsSubtaskModalOpen(false)} title={`AI Sub-task Suggestions for "${currentTaskForSubtasks?.title}"`}>
                {isGeneratingSubtasks && (
                    <div className="flex items-center justify-center p-6">
                        <svg className="animate-spin h-8 w-8 text-purple-400 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="text-slate-300">TaskFlow AI is thinking...</p>
                    </div>
                )}
                {subtaskError && <p className="text-rose-400 text-sm mb-3 bg-rose-500/10 p-2 rounded-md">{subtaskError}</p>}
                {!isGeneratingSubtasks && subtaskSuggestions.length > 0 && (
                    <ul className="space-y-2.5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                        {subtaskSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex justify-between items-center p-3 bg-slate-700/70 rounded-lg hover:bg-slate-700 transition-colors">
                                <span className="text-slate-200 text-sm flex-1 mr-2">{suggestion}</span>
                                <button onClick={() => handleAddSubtaskAsNewTask(suggestion)} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 px-2.5 rounded-md transition-colors flex items-center gap-1">
                                    <PlusCircleIcon /> Add
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {!isGeneratingSubtasks && !subtaskError && subtaskSuggestions.length === 0 && <p className="text-slate-400 text-center py-4">No sub-task suggestions found, or AI couldn't break it down further.</p>}
                 <button onClick={() => setIsSubtaskModalOpen(false)} className="mt-6 w-full bg-slate-600 hover:bg-slate-500 text-slate-200 font-medium py-2 px-4 rounded-md transition-colors">Close</button>
            </Modal>
             <footer className="text-center text-xs text-slate-500 py-5 mt-auto border-t border-slate-700/50">
                TaskFlow AI &copy; {new Date().getFullYear()} - Powered by Gemini & Firebase
            </footer>
        </div>
    );
}

export default App;