// src/components/Modal/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
            <div className="bg-slate-800 p-6 rounded-xl shadow-2xl max-w-lg w-full border border-slate-700 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalEnter" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-slate-100">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-2xl p-1 rounded-full hover:bg-slate-700 transition-colors">&times;</button>
                </div>
                {children}
            </div>
            {/* Note: The keyframes for modalEnter are now in index.css for global availability */}
        </div>
    );
};
export default Modal;