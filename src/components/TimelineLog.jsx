import { motion, AnimatePresence } from 'framer-motion';
import LogEntry from './LogEntry';

function TimelineLog({ logs, aiPromptCount, onClose }) {
    return (
        <>
            <motion.div
                className="sidebar-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
            />
            <motion.aside
                className="timeline-sidebar"
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
                transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            >
                <div className="sidebar-header">
                    <div className="sidebar-header-left">
                        <span className="sidebar-header-icon">📡</span>
                        <span className="sidebar-title">Timeline Log</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="sidebar-version">v.2.04</span>
                        <button className="sidebar-close" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="sidebar-logs">
                    {logs.length === 0 ? (
                        <div className="empty-log">
                            <div className="empty-log-icon">📡</div>
                            <div className="empty-log-text">No Events Logged</div>
                            <div className="empty-log-hint">
                                Press <span className="key-hint">C</span> <span className="key-hint">E</span> <span className="key-hint">S</span> <span className="key-hint">T</span> <span className="key-hint">R</span> to trigger commands
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {logs.map((log) => (
                                <LogEntry key={log.id} log={log} aiPromptCount={aiPromptCount} />
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                <div className="sidebar-footer">
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span className="sidebar-footer-label">Quantum Protocol</span>
                            <span className="sidebar-footer-status">Authorized</span>
                        </div>
                        <div className="sidebar-footer-bar">
                            <div
                                className="sidebar-footer-bar-fill"
                                style={{ width: `${Math.min(100, logs.length * 8 + 15)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

export default TimelineLog;
