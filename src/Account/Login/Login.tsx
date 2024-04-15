import { useState } from "react";
import { useNavigate } from "react-router";
import { useRefetchUser } from "../hooks";
import { useSearchParams } from "react-router-dom";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import usersClient from "../../API/Users/client";
import { InputGroup } from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refreshUser = useRefetchUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(undefined as string | undefined);

  const redirect = searchParams.get("redirect");
  const redirectParams = Array.from(searchParams.entries())
    .filter(([key, value]) => key !== "redirect")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const login = async () => {
    setError(undefined);
    try {
      await usersClient.login(username, password);
      await refreshUser();
      if (redirect) {
        navigate(`/${redirect}?${redirectParams}`, { replace: true });
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
            <div className="alert alert-danger">{error}</div>
          </div>
        )}
      </div>
    </div>
  );
}
