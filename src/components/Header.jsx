import { motion } from 'framer-motion';

const KEYS = ['C', 'E', 'S', 'T', 'R'];

function Header({ activeKey, onKeyClick, onToggleSidebar, isPaused, aiPromptCount }) {
    return (
        <header className="header">
            <div className="header-left">
                <div className="logo-icon">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 4c8.837 0 16 7.163 16 16s-7.163 16-16 16S8 32.837 8 24 15.163 8 24 8z"
                            fill="#00ff6a"
                            opacity="0.3"
                        />
                        <path
                            d="M15 20c0-1.6 1.3-3 3-3s3 1.4 3 3c0 2-3 5-3 5s-3-3-3-5zm12 0c0-1.6 1.3-3 3-3s3 1.4 3 3c0 2-3 5-3 5s-3-3-3-5z"
                            fill="#00ff6a"
                        />
                        <path
                            d="M16 30c0 0 2 4 8 4s8-4 8-4"
                            stroke="#00ff6a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="logo-text">
                    <h1>DEVPLAY'26</h1>
                    <span>Doomsday Clock</span>
                </div>
            </div>

            <div className="header-center">
                <div className="commands-group">
                    <span className="commands-label">Commands</span>
                    {KEYS.map((k) => (
                        <motion.button
                            key={k}
                            className={`cmd-key ${activeKey === k ? 'active' : ''}`}
                            onClick={() => onKeyClick(k)}
                            whileTap={{ scale: 0.9 }}
                            animate={
                                activeKey === k
                                    ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0px rgba(0,255,106,0)', '0 0 20px rgba(0,255,106,0.6)', '0 0 0px rgba(0,255,106,0)'] }
                                    : {}
                            }
                            transition={{ duration: 0.35 }}
                        >
                            {k}
                        </motion.button>
                    ))}
                </div>

                <div className="status-indicators">
                    <div className="status-item">
                        <div className="status-item-label">Timeline Integrity</div>
                        <div className={`status-item-value ${isPaused ? 'orange' : 'green'}`}>
                            {isPaused ? '42.1% UNSTABLE' : '98.4% STABLE'}
                        </div>
                    </div>
                    <div className="status-item">
                        <div className="status-item-label">System Load</div>
                        <div className={`status-item-value ${isPaused ? 'orange' : 'orange'}`}>
                            {isPaused ? 'CRITICAL' : 'OPTIMAL'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="header-right">
                <button className="sidebar-toggle" onClick={onToggleSidebar} title="Toggle Timeline Log">
                    ☰
                </button>
                <div className="profile-orb" title={`AI Prompts: ${aiPromptCount}`} />
            </div>
        </header>
    );
}

export default Header;
