import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import * as client from "../client";
import { useRefreshUser, useUser } from "../hooks";
import { Alert, Button, InputGroup } from "react-bootstrap";
import "./index.css";
import { useSearchParams } from "react-router-dom";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const redirect = searchParams.get("redirect");
  const redirectParams = Array.from(searchParams.entries())
    .filter(([key, value]) => key !== "redirect")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const login = async () => {
    setError(undefined);
    try {
      await client.login(username, password);
      await refreshUser();
      if (redirect) {
        navigate(`${redirect}?${redirectParams}`, { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
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
              onKeyDown={(e) => e.key === "Enter" && login()}
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
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
              <button
                onClick={() => setShowPassword((show) => !show)}
                className="btn btn-secondary"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </InputGroup>
          </label>
        </div>
        <div className="mb-3">
          <button className="btn btn-primary" onClick={login}>
            Login
          </button>
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
