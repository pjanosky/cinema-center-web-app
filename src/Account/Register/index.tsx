import { useState } from "react";
import { useNavigate } from "react-router";
import { useRefreshUser } from "../hooks";
import * as client from "../client";
import { isAxiosError } from "axios";
import { Role } from "../../types";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import "./index.css";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refreshUser = useRefreshUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("user");
  const [error, setError] = useState(undefined as string | undefined);

  const redirect = searchParams.get("redirect");
  const redirectParams = Array.from(searchParams.entries())
    .filter(([key, value]) => key !== "redirect")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const showPasswordError =
    password && confirmPassword && password !== confirmPassword;
  const register = async () => {
    setError(undefined);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await client.register({ username, password, name, email, role });
      await refreshUser();
      if (redirect) {
        navigate(`${redirect}?${redirectParams}`, { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setError(error.response.data);
      }
    }
  };

  return (
    <div className="cc-register">
      <div className="p-4" style={{ maxWidth: "500px" }}>
        <h1>Register</h1>
        <div className="mb-3">
          <label>
            Name
            <input
              type="text"
              spellCheck={false}
              autoComplete="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </div>
        <div className="mb-3">
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
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
                autoComplete="new-password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <label>
            Confirm Password
            <InputGroup>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPassword((show) => !show)}
                className="btn btn-secondary"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </InputGroup>
            {showPasswordError && (
              <Form.Text muted>Passwords do not match</Form.Text>
            )}
          </label>
        </div>
        <div className="mb-3">
          <label>
            Role
            <Form.Select
              aria-label="Default select example"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
            </Form.Select>
          </label>
        </div>
        <div className="mb-3">
          <button className="btn btn-primary" onClick={register}>
            Register
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
