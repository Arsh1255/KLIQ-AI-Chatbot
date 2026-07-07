// --- components/ContextPopup.jsx ---

import React from 'react';

// Define the available personas (must match the PERSONAS object in Chat.jsx)
const PERSONAS_OPTIONS = [
    { value: "normal", label: "Normal Assistant" },
    { value: "mentor", label: "Patient Mentor" },
    { value: "pirate", label: "Pirate" },
    { value: "sarcastic", label: "Sarcastic Helper" }
];

export default function ContextPopup({ 
    persona, 
    setPersona, 
    customContext, 
    setCustomContext, 
    onClose 
}) {
    
    // --- Styles for the Modal Overlay and Content ---

    // The modal overlay (darkens background)
    const overlayStyle = {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    // The modal card (Applies the deep glass style)
    const cardStyle = {
        width: '90%',
        maxWidth: '400px',
        padding: '30px',
        borderRadius: '16px',
        
        // Deep Glass Effect 
        background: 'rgba(0, 0, 0, 0.2)', 
        backdropFilter: 'blur(30px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
        
        border: '1px solid transparent',
        borderTopColor: 'rgba(255, 255, 255, 0.6)',
        borderLeftColor: 'rgba(255, 255, 255, 0.6)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
        color: '#e0e0ff',
    };

    const saveButtonStyle = {
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        // Mini-glass effect for the button
        background: 'rgba(0, 191, 255, 0.4)', 
        color: 'white',
        cursor: 'pointer',
        transition: 'background 0.2s',
        float: 'right',
    };


    return (
        <div style={overlayStyle}>
            <div style={cardStyle}>
                
                {/* Header */}
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="mr-2">⚙️</span> Context and Persona Settings
                </h2>

                {/* Custom Context Input */}
                <label className="block text-sm font-medium mb-1">Custom Context:</label>
                <input
                    type="text"
                    className="context-control" // <-- USING NEW CLASS
                    placeholder="Input custom context (e.g., 'I am studying B.Tech CSE at I...')"
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                />

                {/* Persona Selector */}
                <label className="block text-sm font-medium mb-1">Select Persona:</label>
                <select
                    className="context-control" // <-- USING NEW CLASS
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                >
                    {PERSONAS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Save & Close Button */}
                <button 
                    style={saveButtonStyle}
                    onClick={onClose}
                    className="save-close-btn"
                >
                    Save & Close
                </button>
            </div>
        </div>
    );
}