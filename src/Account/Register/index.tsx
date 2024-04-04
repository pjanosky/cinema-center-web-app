import { useState } from "react";
import { useNavigate } from "react-router";
import { useRefreshUser } from "../hooks";
import * as client from "../client";
import { isAxiosError } from "axios";
import { Role } from "../../types";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.css";

export default function Register() {
  const navigate = useNavigate();
  const refreshUser = useRefreshUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("user");
  const [error, setError] = useState(undefined as string | undefined);

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
      refreshUser();
      navigate("/home");
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
              <Button
                onClick={() => setShowPassword((show) => !show)}
                variant="secondary"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
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
          <Button
            variant="primary"
            onClick={register}
            style={{ width: "100%" }}
          >
            Register
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
