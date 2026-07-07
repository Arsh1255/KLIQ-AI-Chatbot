// Chat.jsx (FINAL Layout and Logic Fix)
import { useState, useEffect, useRef } from "react";
import { sendMessage, clearHistory, fetchHistory } from "../api";

import UserBubble from "../components/UserBubble";
import AiReplyBubble from "../components/AiReplyBubble";
import InputBar from "../components/InputBar";
import TopBar from "../components/TopBar";
import ContextPopup from "../components/ContextPopup";

const PERSONAS = {
  normal: "You are a helpful and clear assistant.",
  mentor: "You are a patient mentor who explains step by step.",
  pirate: "You speak like a pirate.",
  sarcastic: "You use light sarcasm but remain helpful."
};

// ---- FINAL CHAT COMPONENT (API Integrated & Stabilized) ----
export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [persona, setPersona] = useState("normal");
  const [customContext, setCustomContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  
  // Ref for auto-scrolling (Fixes F-4)
  const messagesEndRef = useRef(null);

  // Auto-scroll effect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* FETCH HISTORY ON LOAD (Fixes F-3) */
  useEffect(() => {
    const loadHistory = async () => {
        try {
            const rawHistory = await fetchHistory();
            // Normalize every message fetched from DB
            const normalizedHistory = rawHistory.map(normalizeAI); 
            setMessages(normalizedHistory);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load chat history:", error);
            setMessages([{ id: Date.now(), role: "assistant", text: "Error connecting to the chat history service.", code: null }]);
        }
    };
    loadHistory();
  }, []); 
  
  // Scroll whenever messages change (Fixes F-4)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  /* SEND MESSAGE - Now supports image (Required Fixes 2) */
  // handleSend now accepts image parameter from InputBar
  const handleSend = async (messageToSend, imageToSend) => {
    
    if (!messageToSend.trim() && !imageToSend) return;
    
    // Context Compilation
    const personaContext = PERSONAS[persona];
    
    // Compiling context string as an array of defined parts, then joining
    const finalContext = [
        personaContext,
        customContext
    ].filter(Boolean).join("\n\n").trim();


    // Create User Message Object
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: messageToSend,
      image: imageToSend, // Pass image data
      code: null,
      createdAt: Date.now()
    };
    
    const loadingMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Thinking...",
        isLoading: true,
        code: null
    };

    // Optimistic UI updates
    setMessages(prev => [...prev, userMsg]);
    setInput(""); 
    setMessages(prev => [...prev, loadingMsg]);
    setLoading(true);

    try {
      // Send API Request (Forward image data to backend)
      const res = await sendMessage(messageToSend, imageToSend, finalContext);
      
      const rawReply = res.reply || res.text || "";

      // FIX: Update the existing loading message instead of filtering and appending
      setMessages(prev => prev.map(m => {
        if (m.isLoading) {
          // Pass the rawReply as content to normalizeAI. The role must be set manually 
          // since the API response structure is unclear (e.g., just a string reply).
          const finalContent = normalizeAI({ content: rawReply, role: "assistant" });
          return {
            ...finalContent,
            isLoading: false, // Turn off loading
            id: m.id // Preserve the original placeholder ID
          };
        }
        return m;
      }));

    } catch (err) {
      console.error("Send failed:", err);
      setMessages(prev => prev.filter(m => !m.isLoading)); 
      setMessages(prev => [...prev, { id: Date.now() + 2, role: "assistant", text: "Error: Could not reach the service. Check console.", code: null }]);
    } finally {
      setLoading(false);
    }
  };

  /* CLEAR HISTORY */
  const handleClear = async () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
        await clearHistory();
        setMessages([]);
    }
  };

  /* ---- AI RESPONSE NORMALIZER (Preserves Image Data - Required Fixes 4) ---- */
  function normalizeAI(msg) {
  // Ensure we pull text from 'content', 'text', or treat 'msg' as string
  const text = msg.content || msg.text || (typeof msg === 'string' ? msg : "");

  // REMOVED: The regex codeMatch logic. 
  // We now pass the entire raw text (including ``` blocks) to AiReplyBubble
  // because react-markdown handles the parsing beautifully.

  return {
      id: msg.id || msg._id || Date.now(),
      role: msg.role || "assistant",
      text: text, // Pass full markdown text
      image: msg.image || null, 
      code: null, // We no longer extract code separately
      createdAt: msg.createdAt || Date.now()
  };
}
  
return (
  <div className="app-background">
      <div className="glass-chat-container">

          <TopBar
              className="glass-header"
              onSettings={() => setShowPopup(true)}
              onClear={handleClear}
          />

          <div className="chat-area">
              {messages.map(m =>
                  (m.text || m.code || m.image) ? ( 
                      m.role === "user" ? (
                          <UserBubble key={m.id} text={m.text} image={m.image} />
                      ) : (
                          <AiReplyBubble key={m.id} text={m.text} isLoading={m.isLoading} />
                      )
                  ) : null
              )}
              <div ref={messagesEndRef} />
          </div>

          <InputBar 
              className="glass-input-bar"
              handleSend={handleSend}
              disabled={loading}
              input={input}
              setInput={setInput}
          />

          {showPopup && (
              <ContextPopup
                  persona={persona} setPersona={setPersona}
                  customContext={customContext} setCustomContext={setCustomContext}
                  onClose={() => setShowPopup(false)}
              />
          )}
      </div>
  </div>
);
}