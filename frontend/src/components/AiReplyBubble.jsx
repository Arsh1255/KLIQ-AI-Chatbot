// AiReplyBubble.jsx (FINAL CSS-Driven Version)
import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

export default function AiReplyBubble({ text, isLoading }) { 
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => { if (utteranceRef.current) speechSynthesis.cancel(); };
  }, []);

  const speak = () => {
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return; }
    // Clean code blocks before speaking
    const cleanText = text?.replace(/```[\s\S]*?```/g, "Code block omitted.") || "";
    const u = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = u;
    u.onend = () => setSpeaking(false);
    speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="ai-bubble-wrapper bubble-wrapper">
      {/* Added explicit CSS class for markdown styling */}
      <div className={`ai-reply-card-glass ${isLoading ? 'liquid-loading-pulse' : ''}`}>
        
        {isLoading && !text ? (
          <p style={{color: '#aaa', fontStyle: 'italic'}}>Thinking...</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Use standard HTML tags, CSS will style them via .ai-reply-card-glass
              
              // Custom Code Block Renderer
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : 'text';
                const codeString = String(children).replace(/\n$/, '');

                return !inline && match ? (
                  <div className="code-sandbox">
                    {/* Header Bar */}
                    <div className="code-header">
                      <span className="code-lang">{language}</span>
                      <button 
                        onClick={() => handleCopyCode(codeString)}
                        className="code-copy-btn"
                        title="Copy Code"
                      >
                         {/* Simple Copy Icon */}
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                         Copy
                      </button>
                    </div>
                    
                    {/* Syntax Highlighter */}
                    <div className="code-block-wrapper">
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={language}
                        PreTag="div"
                        // Force transparent background so it blends with our container
                        customStyle={{ margin: 0, padding: '15px', background: 'transparent', fontSize: '14px' }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ) : (
                  // Inline Code (handled by CSS)
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>

      {/* Bubble Action Buttons */}
      {!isLoading && (
        <div className="bubble-actions">
          <button 
            className="icon-btn" 
            onClick={() => navigator.clipboard.writeText(text)}
            title="Copy Full Response"
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e0e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          <button 
            className="icon-btn" 
            onClick={speak}
            title="Speak"
          >
            {speaking ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12"></rect></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e0e0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}