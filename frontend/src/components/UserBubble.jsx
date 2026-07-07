// --- components/UserBubble.jsx ---

import React from 'react';

export default function UserBubble({ text, image }) {
  const contentToCopy = text || "";
  
  return (
    <div className="user-bubble-wrapper bubble-wrapper">
      <div className="user-bubble-glass">
        
        {/* Image display wrapper: Now renders the attached image */}
        {image && (
          <div className="bubble-image-container">
            <img src={image} alt="User attachment" className="bubble-image" />
          </div>
        )}
        
        {/* Render text only if it exists */}
        {text && <p className="user-text">{text}</p>}
      </div>
      
      <div className="bubble-actions">
        <button
          className="icon-btn"
          onClick={() => navigator.clipboard.writeText(contentToCopy)}
          aria-label="Copy message content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e0e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}