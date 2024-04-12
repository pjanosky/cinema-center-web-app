import { useState } from "react";
import { useNavigate } from "react-router";
import { isAxiosError } from "axios";
import { Alert, Form, InputGroup } from "react-bootstrap";
import "./index.css";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { NewUser, Role } from "../../API/Users/types";
import usersClient from "../../API/Users/client";
import { useRefetchUser } from "../hooks";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refetchUser = useRefetchUser();
  const [user, setUser] = useState<NewUser & { confirmPassword: string }>({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(undefined as string | undefined);

  const redirect = searchParams.get("redirect");
  const redirectParams = Array.from(searchParams.entries())
    .filter(([key, value]) => key !== "redirect")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const showPasswordError =
    user.password &&
    user.confirmPassword &&
    user.password !== user.confirmPassword;

  const register = async () => {
    setError(undefined);
    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await usersClient.createUser(user);
      await refetchUser();
      if (redirect) {
        navigate(`/${redirect}?${redirectParams}`, { replace: true });
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
              value={user.name}
              onChange={(e) =>
                setUser((user) => ({ ...user, name: e.target.value }))
              }
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
              value={user.email}
              onChange={(e) =>
                setUser((user) => ({ ...user, email: e.target.value }))
              }
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
              value={user.username}
              onChange={(e) =>
                setUser((user) => ({ ...user, username: e.target.value }))
              }
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
                value={user.password}
                onChange={(e) =>
                  setUser((user) => ({ ...user, password: e.target.value }))
                }
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
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser((user) => ({
                    ...user,
                    confirmPassword: e.target.value,
                  }))
                }
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
              value={user.role}
              onChange={(e) =>
                setUser((user) => ({ ...user, role: e.target.value as Role }))
              }
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
