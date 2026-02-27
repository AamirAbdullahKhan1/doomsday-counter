import { motion } from 'framer-motion';

function StatusBanner({ isPaused }) {
    return (
        <motion.div
            className={`status-banner ${isPaused ? 'paused' : ''}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            layout
        >
            <div className="status-dot" />
            <span className="status-banner-text">
                {isPaused ? 'Emergency Protocol Active' : 'Incursion Countdown Active'}
            </span>
        </motion.div>
    );
}

export default StatusBanner;
