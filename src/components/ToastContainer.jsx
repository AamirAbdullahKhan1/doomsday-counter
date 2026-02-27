import { AnimatePresence, motion } from 'framer-motion';

function ToastContainer({ toasts }) {
    return (
        <div className="toast-container">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        className={`toast ${toast.type}`}
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                        <div className="toast-title">{toast.title}</div>
                        <div className="toast-message">{toast.description}</div>
                        {toast.badge && (
                            <div className={`toast-badge`} style={{ color: `var(--accent-${toast.badge.color})` }}>
                                {toast.badge.icon} {toast.badge.text}
                            </div>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default ToastContainer;
