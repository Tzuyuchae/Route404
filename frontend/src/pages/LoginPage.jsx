import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/LoginPage.css"
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }

      const passwordRules = [
        { test: password.length >= 8, msg: "At least 8 characters" },
        { test: /[0-9]/.test(password), msg: "At least one number" },
        { test: /[A-Z]/.test(password), msg: "At least one uppercase letter" },
        { test: /[^A-Za-z0-9]/.test(password), msg: "At least one special character" }
      ];

      for (const rule of passwordRules) {
        if (!rule.test) {
          setMessage(rule.msg);
          return;
        }
      }
    }

    try {
      const endpoint = isRegister
        ? `${API_BASE}/auth/register`
        : `${API_BASE}/auth/login`;

      const res = await axios.post(endpoint, {
        username: email,
        password,
      });

      setMessage(res.data.message);

      // Redirect only when login (not register) and backend says success
      if (!isRegister && res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        login(res.data.username);
        navigate("/");
        return;
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const passwordChecks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "At least one number", valid: /[0-9]/.test(password) },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least one special character", valid: /[^A-Za-z0-9]/.test(password) }
  ];

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? "Create Account" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="password-field">
            <input
              type="text"
              placeholder="Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="password-field">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="password-field">
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          )}

          {isRegister && (
            <ul className="password-rules">
              {passwordChecks.map((rule, index) => (
                <li key={index} className={rule.valid ? "valid" : "invalid"}>
                  {rule.label}
                </li>
              ))}
              <li className={password === confirmPassword && confirmPassword !== "" ? "valid" : "invalid"}>
                Passwords match
              </li>
            </ul>
          )}

          <button type="submit">{isRegister ? "Create Account" : "Login"}</button>
        </form>

        {message && <p>{message}</p>}

        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setConfirmPassword("");
          }}
          style={{ marginTop: "10px" }}
        >
          {isRegister ? "Already have an account? Login" : "Need an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;