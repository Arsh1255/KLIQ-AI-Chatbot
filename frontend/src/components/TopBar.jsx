import React from 'react';
import { Settings, Trash2 } from 'lucide-react'; 

export default function TopBar({ className, onSettings, onClear }) {
    return (
        <header 
            className={className} 
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            
            <style>
                {`
                    @keyframes neonFloat {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                    .neon-bot-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                        animation: neonFloat 3s ease-in-out infinite;
                        flex-shrink: 0;
                    }
                    .neon-bot-logo {
                        filter: drop-shadow(0 0 12px rgba(138, 99, 255, 0.8));
                    }
                    .logo-brand-text {
                        color: white;
                        font-size: 10px;
                        font-weight: 400;
                        letter-spacing: 2px;
                        opacity: 0.9;
                    }
                    .topbar-btn {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    .topbar-btn:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                `}
            </style>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}> 
                
                {/* Logo + Text Branding Group */}
                <div className="neon-bot-container">
                    <svg
                        className="neon-bot-logo"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* EXACT PATH FROM AUTH PAGE IMAGE */}
                        <path 
                            d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4ZM7 10C7.552 10 8 10.448 8 11C8 11.552 7.552 12 7 12C6.448 12 6 11.552 6 11C6 10.448 6.448 10 7 10ZM17 10C17.552 10 18 10.448 18 11C18 11.552 17.552 12 17 12C16.448 12 16 11.552 16 11C16 10.448 16.448 10 17 10ZM9 15H15C15 16.657 13.657 18 12 18C10.343 18 9 16.657 9 15Z" 
                            fill="url(#topBarGradient)"
                        />
                        <defs>
                            <linearGradient id="topBarGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#8A63FF" />
                                <stop offset="1" stopColor="#00d2ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="logo-brand-text">KLIQ AI</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}> 
                    <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '600', margin: 0 }}>Hello there,</h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', margin: 0 }}>How can I assist you today?</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}> 
                <button className="topbar-btn" onClick={onClear} title="Clear Chat">
                    <Trash2 size={18} color="#8A63FF" />
                </button>
                <button className="topbar-btn" onClick={onSettings} title="Settings">
                    <Settings size={18} color="#8A63FF" />
                </button>
            </div>
        </header>
    );
}