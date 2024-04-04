import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as client from "../client";
import { useRefreshUser, useUser } from "../hooks";
import { Alert, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.css";

export default function Login() {
  const navigate = useNavigate();
  const refreshUser = useRefreshUser();
  const user = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(undefined as string | undefined);
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [navigate, user]);

  const login = async () => {
    setError(undefined);
    try {
      await client.login(username, password);
      refreshUser();
      navigate("/home", { replace: true });
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="cc-login">
      <div className="p-4" style={{ maxWidth: "500px" }}>
        <h1>Login</h1>
        <div className="mb-3">
          <label>
            Username
            <input
              type="text"
              autoComplete="username"
              spellCheck={false}
              autoCapitalize="off"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div className="mb-3">
          <label>
            Password
            <InputGroup>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                onClick={() => setShowPassword((show) => !show)}
                variant="secondary"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </label>
        </div>
        <div className="mb-3">
          <Button variant="primary" onClick={login} style={{ width: "100%" }}>
            Login
          </Button>
        </div>
        {error && (
          <div className="mb-3">
            <Alert variant="danger">{error}</Alert>
          </div>
        )}
      </div>
    </div>
  );
}
