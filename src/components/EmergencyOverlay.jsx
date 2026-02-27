import { motion } from 'framer-motion';

function EmergencyOverlay() {
    return (
        <motion.div
            className="emergency-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        />
    );
}

export default EmergencyOverlay;
