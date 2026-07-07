/* Auth.jsx */
import React, { useState } from "react";
import { signup, login } from "../api";
import "./Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isLogin) {
        const res = await login(email, password);
        localStorage.setItem("token", res.token);
        window.location.reload(); 
      } else {
        await signup(email, password);
        alert("Signup successful. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const toggleMode = () => setIsLogin((prev) => !prev);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* Left Side: AI Visuals */}
        <div className="visual-side">
          <svg className="ai-bot-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 22 12 2ZM12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4ZM7 10C7.552 10 8 10.448 8 11C8 11.552 7.552 12 7 12C6.448 12 6 11.552 6 11C6 10.448 6.448 10 7 10ZM17 10C17.552 10 18 10.448 18 11C18 11.552 17.552 12 17 12C16.448 12 16 11.552 16 11C16 10.448 16.448 10 17 10ZM9 15H15C15 16.657 13.657 18 12 18C10.343 18 9 16.657 9 15Z" fill="url(#paint0_linear)"/>
            <defs>
              <linearGradient id="paint0_linear" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8A63FF"/>
                <stop offset="1" stopColor="#00d2ff"/>
              </linearGradient>
            </defs>
          </svg>
          <h3 className="visual-text">KLIQ AI</h3>
        </div>

        {/* Right Side: Form */}
        <div className="form-side">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="subtitle">
            {isLogin ? "Enter your credentials to access your account." : "Begin your journey into the future."}
          </p>

          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn-primary" onClick={handleSubmit}>
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="auth-footer-text">
            {isLogin ? (
              <>
                Don't have an account? <span onClick={toggleMode}>Sign Up</span>
              </>
            ) : (
              <>
                Already have an account? <span onClick={toggleMode}>Login</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}