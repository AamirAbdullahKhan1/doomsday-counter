import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import StatusBanner from './components/StatusBanner';
import CountdownDisplay from './components/CountdownDisplay';
import TimelineLog from './components/TimelineLog';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import EmergencyOverlay from './components/EmergencyOverlay';
import DarkVeil from './components/DarkVeil';

const COMMANDS = {
  c: {
    key: 'C',
    type: 'crewmate',
    title: 'Crew Sync',
    delta: 3 * 60 * 1000,
    description: 'Quantum alignment successful. Clock expansion +3m.',
    badge: null,
  },
  e: {
    key: 'E',
    type: 'engineer',
    title: 'Engineer Active',
    delta: 8 * 60 * 1000,
    description: 'Neural AI prompts generated. Integrity +8m.',
    badge: { text: '5 AI PROMPTS FOR ALL TEAMS', color: 'orange', icon: '🔶' },
  },
  s: {
    key: 'S',
    type: 'saboteur',
    title: 'Sabotage Event',
    delta: -2 * 60 * 1000,
    description: 'Temporal feedback loop: -2m penalty applied to clock.',
    badge: null,
  },
  t: {
    key: 'T',
    type: 'stabilizer',
    title: 'Stabilizer Active',
    delta: 5 * 60 * 1000,
    description: 'Mentor status initialized: Chrono-shield deployed. (+5 mins)',
    badge: { text: 'MENTOR ONLINE', color: 'purple', icon: '💜' },
  },
  r: {
    key: 'R',
    type: 'emergency',
    title: 'Emergency Protocol',
    delta: 0,
    description: 'Clock frozen for 10 minutes. All operations halted.',
    badge: { text: 'TIMELINE FROZEN', color: 'red', icon: '🔴' },
  },
};

const INITIAL_TIME = 30 * 60 * 1000; // 30 minutes
const EMERGENCY_DURATION = 10 * 60 * 1000; // 10 minutes
const STORAGE_KEY = 'dp_countdown_state_v1';

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.logs) {
        parsed.logs = parsed.logs.map(log => ({ ...log, timestamp: new Date(log.timestamp) }));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse saved state', e);
  }
  return null;
};

function App() {
  const savedState = loadState() || {};

  const [timeLeft, setTimeLeft] = useState(savedState.timeLeft ?? INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(savedState.isRunning ?? false);
  const [isPaused, setIsPaused] = useState(savedState.isPaused ?? false);
  const [pauseRemaining, setPauseRemaining] = useState(savedState.pauseRemaining ?? 0);
  const [sidebarOpen, setSidebarOpen] = useState(savedState.sidebarOpen ?? true);
  const [logs, setLogs] = useState(savedState.logs ?? []);
  const [toasts, setToasts] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [aiPromptCount, setAiPromptCount] = useState(savedState.aiPromptCount ?? 0);
  const toastIdRef = useRef(0);

  // Storage sync
  useEffect(() => {
    const stateToSave = { timeLeft, isRunning, isPaused, pauseRemaining, sidebarOpen, logs, aiPromptCount };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [timeLeft, isRunning, isPaused, pauseRemaining, sidebarOpen, logs, aiPromptCount]);

  const handleReset = () => {
    if (window.confirm('Reset the entire timeline? All logs and timers will be lost.')) {
      localStorage.removeItem(STORAGE_KEY);
      setTimeLeft(INITIAL_TIME);
      setIsRunning(false);
      setIsPaused(false);
      setPauseRemaining(0);
      setLogs([]);
      setToasts([]);
      setAiPromptCount(0);
    }
  };

  // Countdown tick
  useEffect(() => {
    if (!isRunning || isPaused || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 10));
    }, 10);
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  // Emergency pause countdown
  useEffect(() => {
    if (!isPaused) return;
    const interval = setInterval(() => {
      setPauseRemaining((prev) => {
        if (prev <= 1000) {
          setIsPaused(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const addToast = useCallback((command) => {
    const id = ++toastIdRef.current;
    const toast = { id, ...command, timestamp: new Date() };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const addLog = useCallback((command) => {
    const log = {
      id: Date.now() + Math.random(),
      ...command,
      timestamp: new Date(),
    };
    setLogs((prev) => [log, ...prev]);
  }, []);

  const handleCommand = useCallback(
    (key) => {
      const cmd = COMMANDS[key];
      if (!cmd) return;

      // Visual feedback for key badge
      setActiveKey(cmd.key);
      setTimeout(() => setActiveKey(null), 400);

      if (cmd.type === 'emergency') {
        if (isPaused) return; // Already paused
        setIsPaused(true);
        setPauseRemaining(EMERGENCY_DURATION);
      } else {
        setTimeLeft((prev) => Math.max(0, prev + cmd.delta));
        if (cmd.type === 'engineer') {
          setAiPromptCount((prev) => prev + 5);
        }
      }

      addLog(cmd);
      addToast(cmd);
    },
    [isPaused, addLog, addToast]
  );

  // Keyboard listener
  useEffect(() => {
    const handler = (e) => {
      const key = e.key.toLowerCase();
      if (COMMANDS[key] && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleCommand(key);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleCommand]);

  const handleKeyClick = (key) => {
    handleCommand(key.toLowerCase());
  };

  return (
    <div className="app-layout">
      <DarkVeil color="#00ff6a" warpAmount={0.8} speed={2} scanlineFrequency={2.5} />
      <Header
        activeKey={activeKey}
        onKeyClick={handleKeyClick}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        isPaused={isPaused}
        aiPromptCount={aiPromptCount}
      />

      <div className="main-content">
        <div className="countdown-area">
          <StatusBanner isPaused={isPaused} isRunning={isRunning} />
          <CountdownDisplay timeLeft={timeLeft} isPaused={isPaused} />

          <div className="controls-row">
            <button className={`control-btn ${isRunning && !isPaused ? 'active' : ''}`} onClick={() => setIsRunning(true)}>START ENGINE</button>
            <button className={`control-btn ${!isRunning && !isPaused ? 'active' : ''}`} onClick={() => setIsRunning(false)}>HALT ENGINE</button>
            <button className="control-btn" onClick={handleReset} style={{ borderColor: 'rgba(255, 61, 61, 0.4)', color: 'var(--accent-red)' }}>RESET TIMELINE</button>
          </div>

          {isPaused && (
            <div className="pause-countdown-text">
              Resuming in {Math.ceil(pauseRemaining / 1000)}s
            </div>
          )}
        </div>

        <AnimatePresence>
          {sidebarOpen && (
            <TimelineLog
              logs={logs}
              aiPromptCount={aiPromptCount}
              onClose={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>

      <Footer />

      <ToastContainer toasts={toasts} />

      <AnimatePresence>
        {isPaused && <EmergencyOverlay />}
      </AnimatePresence>
    </div>
  );
}

export default App;
