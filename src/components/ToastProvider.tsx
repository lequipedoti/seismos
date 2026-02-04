"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
    const { id, type, title, description, duration = 5000 } = toast;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onRemove(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onRemove]);

    const icons = {
        success: CheckCircle2,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const colors = {
        success: {
            bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
            border: 'border-emerald-500/30',
            icon: 'text-emerald-500',
            text: 'text-emerald-900 dark:text-emerald-100',
        },
        error: {
            bg: 'bg-red-500/10 dark:bg-red-500/20',
            border: 'border-red-500/30',
            icon: 'text-red-500',
            text: 'text-red-900 dark:text-red-100',
        },
        warning: {
            bg: 'bg-amber-500/10 dark:bg-amber-500/20',
            border: 'border-amber-500/30',
            icon: 'text-amber-500',
            text: 'text-amber-900 dark:text-amber-100',
        },
        info: {
            bg: 'bg-blue-500/10 dark:bg-blue-500/20',
            border: 'border-blue-500/30',
            icon: 'text-blue-500',
            text: 'text-blue-900 dark:text-blue-100',
        },
    };

    const Icon = icons[type];
    const colorScheme = colors[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`relative w-full max-w-sm overflow-hidden rounded-xl border backdrop-blur-xl ${colorScheme.bg} ${colorScheme.border} shadow-2xl`}
        >
            <div className="relative p-4">
                <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${colorScheme.icon}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-semibold ${colorScheme.text}`}>
                            {title}
                        </h3>
                        {description && (
                            <p className={`mt-1 text-xs ${colorScheme.text} opacity-80`}>
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(id)}
                        className={`flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${colorScheme.text}`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                {duration > 0 && (
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: duration / 1000, ease: 'linear' }}
                        className={`absolute bottom-0 left-0 h-1 w-full origin-left ${colorScheme.icon.replace('text-', 'bg-')} opacity-50`}
                    />
                )}
            </div>
        </motion.div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex flex-col items-end gap-3 p-4">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onRemove={removeToast} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((title: string, description?: string) => {
        addToast({ type: 'success', title, description });
    }, [addToast]);

    const error = useCallback((title: string, description?: string) => {
        addToast({ type: 'error', title, description });
    }, [addToast]);

    const warning = useCallback((title: string, description?: string) => {
        addToast({ type: 'warning', title, description });
    }, [addToast]);

    const info = useCallback((title: string, description?: string) => {
        addToast({ type: 'info', title, description });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};
