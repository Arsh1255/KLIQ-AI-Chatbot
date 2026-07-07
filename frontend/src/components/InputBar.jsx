// --- components/InputBar.jsx ---

import React, { useState } from 'react';
import { Plus, Send, Loader2, Search } from 'lucide-react'; 

export default function InputBar({ input, setInput, handleSend, disabled, className }) {
    
    // State to hold the selected image URL or data
    const [image, setImage] = useState(null); 

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Set the state to the data URL (Base64) for immediate preview and sending
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerSend = () => {
        // Pass both the text and the image data to the Chat component's handleSend
        handleSend(input, image); 
        
        // Clear both the text input and the image data after sending
        setInput(""); 
        setImage(null);
    }
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !disabled && (input.trim() || image)) {
            triggerSend();
        }
    };

    const isSendDisabled = disabled || (!input.trim() && !image);

    return (
        <div className={className}>
            <div className="glass-input-wrapper">
                
                {/* Hidden File Input */}
                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={disabled}
                />
                
                {/* Attachment Button (Deep Glass Style) - Now triggers hidden input */}
                <label 
                    htmlFor="image-upload" 
                    className="input-icon-left attach-btn-glass" 
                    aria-label="Attach media or files"
                    style={disabled ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                >
                    <Plus size={20} color="white" />
                </label>

                {/* Optional Image Preview/Clear */}
                {image && (
                    <div className="image-preview-tag">
                        Image Attached! 
                        <button onClick={() => setImage(null)}>x</button>
                    </div>
                )}


                {/* Input Field: CRITICAL LINES FOR FUNCTIONALITY */}
                <input
                    type="text"
                    className="glass-input"
                    placeholder={image ? "Add caption or press send..." : "Enter your text or attach media..."}
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                />

                <div className="input-icon-right">
                    <Search size={20} color="white" />
                </div>
            </div>
            
            {/* Send Button */}
            <button 
                className="send-btn-glass"
                onClick={triggerSend} 
                disabled={isSendDisabled}
                aria-label="Send message"
            >
                {disabled ? (
                    <Loader2 size={20} color="white" className="animate-spin" />
                ) : (
                    <Send size={20} color="white" />
                )}
            </button>
        </div>
    );
}