import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

function CountdownDisplay({ timeLeft, isPaused }) {
    const { minutes, seconds, milliseconds } = useMemo(() => {
        const totalMs = Math.max(0, timeLeft);
        const m = Math.floor(totalMs / 60000);
        const s = Math.floor((totalMs % 60000) / 1000);
        const ms = Math.floor((totalMs % 1000) / 10);
        return {
            minutes: String(m).padStart(2, '0'),
            seconds: String(s).padStart(2, '0'),
            milliseconds: String(ms).padStart(2, '0'),
        };
    }, [timeLeft]);

    return (
        <div className="countdown-container">
            <DigitGroup value={minutes} label="Minutes" isPaused={isPaused} />
            <Separator />
            <DigitGroup value={seconds} label="Seconds" isPaused={isPaused} />
            <Separator />
            <DigitGroup value={milliseconds} label="Milliseconds" isPaused={isPaused} animate={false} />
        </div>
    );
}

function DigitGroup({ value, label, isPaused, animate = true }) {
    return (
        <div className="digit-group">
            <div className="digit-value" style={{ position: 'relative' }}>
                {animate ? (
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={value}
                            initial={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, y: -15, filter: "blur(4px)", transition: { duration: 0.2 } }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{ display: 'inline-block' }}
                        >
                            {value}
                        </motion.span>
                    </AnimatePresence>
                ) : (
                    <span style={{ display: 'inline-block' }}>{value}</span>
                )}
            </div>
            <motion.span
                className="digit-label"
                animate={{ opacity: isPaused ? 0.4 : 1 }}
                transition={{ duration: 0.3 }}
            >
                {label}
            </motion.span>
        </div>
    );
}

function Separator() {
    return (
        <div className="digit-separator">
            <div className="sep-dot" />
            <div className="sep-dot" />
        </div>
    );
}

export default CountdownDisplay;
