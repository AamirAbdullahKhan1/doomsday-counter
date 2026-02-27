import { motion } from 'framer-motion';

function LogEntry({ log, aiPromptCount }) {
    const time = log.timestamp.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <motion.div
            className={`log-entry ${log.type}`}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            layout
        >
            <div className="log-entry-header">
                <span className="log-entry-title">{log.title}</span>
                <span className="log-entry-time">{time}</span>
            </div>
            <div className="log-entry-desc">{log.description}</div>
            {log.type === 'engineer' && (
                <div className="log-entry-badge orange">
                    🔶 {aiPromptCount} AI PROMPTS LOGGED
                </div>
            )}
            {log.type === 'stabilizer' && (
                <div className="log-entry-badge purple">
                    💜 MENTOR ONLINE
                </div>
            )}
            {log.type === 'emergency' && (
                <div className="log-entry-badge red">
                    🔴 TIMELINE FROZEN
                </div>
            )}
        </motion.div>
    );
}

export default LogEntry;
