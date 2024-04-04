import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { InputGroup, Button, Alert, Form } from "react-bootstrap";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useAssertUser, useRefreshUser } from "../../Account/hooks";
import * as client from "../../Account/client";
import "./index.css";
import { useParams } from "react-router";

export default function Account() {
  const user = useAssertUser();
  const { id } = useParams();
  const refreshUser = useRefreshUser();
  const [account, setAccount] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profileAlert, setProfileAlert] = useState({
    message: "",
    variant: "danger",
  });
  const [passwordAlert, setPasswordAlert] = useState({
    message: "",
    variant: "danger",
  });
  useEffect(() => {
    setAccount((account) => {
      return {
        ...account,
        name: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",
      };
    });
  }, [user]);

  const showPasswordError =
    account.newPassword &&
    account.confirmPassword &&
    account.newPassword !== account.confirmPassword;
  const updateProfile = async () => {
    setProfileAlert({ message: "", variant: "" });
    try {
      await client.updateProfile(account);
      refreshUser();
      setProfileAlert({
        message: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setProfileAlert({
          message: error.response.data,
          variant: "danger",
        });
      }
    }
  };
  const updatePassword = async () => {
    setPasswordAlert({ message: "", variant: "" });
    if (account.newPassword !== account.confirmPassword) {
      setPasswordAlert({
        message: "Passwords do not match",
        variant: "danger",
      });
      return;
    }
    try {
      await client.updatePassword(account);
      setPasswordAlert({
        message: "Password updated",
        variant: "success",
      });
      refreshUser();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        setPasswordAlert({
          message: error.response.data,
          variant: "danger",
        });
      }
    }
  };

  if (id !== user?._id) {
    return <div></div>;
  }

  return (
    <div className="cc-profile-account" style={{ maxWidth: "500px" }}>
      <h2>Account</h2>
      <h3>Information</h3>
      <div className="mb-3">
        <label>
          Name
          <input
            type="text"
            spellCheck={false}
            autoComplete="name"
            className="form-control"
            value={account.name}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
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
            value={account.email}
            onChange={(e) => setAccount({ ...account, email: e.target.value })}
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
            value={account.username}
            onChange={(e) =>
              setAccount({ ...account, username: e.target.value })
            }
          />
        </label>
      </div>
      <div className="mb-3">
        <label>
          Role
          <input
            className="form-control"
            disabled={true}
            value={user?.role === "user" ? "User" : "Editor"}
          />
        </label>
      </div>
      <div className="mb-3">
        <Button
          variant="primary"
          onClick={updateProfile}
          style={{ width: "100%" }}
        >
          Save Changes
        </Button>
      </div>
      {profileAlert.message && (
        <Alert variant={profileAlert.variant}>{profileAlert.message}</Alert>
      )}
      <h3 className="pt-4">Password</h3>
      <div className="mb-3">
        <label>
          Old Password
          <InputGroup>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="form-control"
              value={account.oldPassword}
              onChange={(e) =>
                setAccount({ ...account, oldPassword: e.target.value })
              }
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
          New Password
          <InputGroup>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="form-control"
              value={account.newPassword}
              onChange={(e) =>
                setAccount({ ...account, newPassword: e.target.value })
              }
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
              value={account.confirmPassword}
              onChange={(e) =>
                setAccount({ ...account, confirmPassword: e.target.value })
              }
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
        <Button
          variant="primary"
          onClick={updatePassword}
          style={{ width: "100%" }}
        >
          Change Password
        </Button>
      </div>
      {passwordAlert.message && (
        <Alert variant={passwordAlert.variant}>{passwordAlert.message}</Alert>
      )}
    </div>
  );
}
