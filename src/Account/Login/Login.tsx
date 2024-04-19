import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import usersClient from "../../API/Users/client";
import { useRefetchUser } from "../../Users/Hooks";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refetchUser = useRefetchUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(undefined as string | undefined);

  const redirect = searchParams.get("redirect");
  const redirectParams = Array.from(searchParams.entries())
    .filter(([key]) => key !== "redirect")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const login = async () => {
    setError(undefined);
    try {
      await usersClient.login(username, password);
      await refetchUser();
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
          <label className="w-100">
            Username
            <input
              type="text"
              placeholder="username"
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
          <label className="w-100">
            Password
            <InputGroup>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
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
