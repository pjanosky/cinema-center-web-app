import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { InputGroup, Alert, Form, Modal } from "react-bootstrap";
import {
  useAssertUser,
  useRefreshOnUnauthorized,
  useRefreshUser,
} from "../../Account/hooks";
import * as client from "../../Account/client";
import "./index.css";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Account() {
  const user = useAssertUser();
  const { id } = useParams();
  const refreshUser = useRefreshUser();
  const navigate = useNavigate();
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
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const refreshOnUnauthorized = useRefreshOnUnauthorized();

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
      await refreshUser();
      setProfileAlert({
        message: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      refreshOnUnauthorized(error);
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
      await refreshUser();
    } catch (error) {
      refreshOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setPasswordAlert({
          message: error.response.data,
          variant: "danger",
        });
      }
    }
  };
  const deleteAccount = async () => {
    try {
      await client.deleteProfile();
      await refreshUser();
      navigate("/login", { replace: true });
    } catch (error) {
      refreshOnUnauthorized(error);
    }
  };

  if (id !== user?._id) {
    return <div></div>;
  }

  return (
    <div className="cc-profile-account" style={{ maxWidth: "600px" }}>
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
        <button onClick={updateProfile} className="btn btn-primary">
          Update Profile
        </button>
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
              value={account.confirmPassword}
              onChange={(e) =>
                setAccount({ ...account, confirmPassword: e.target.value })
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
        <button className="btn btn-primary" onClick={updatePassword}>
          Change Password
        </button>
      </div>
      {passwordAlert.message && (
        <Alert variant={passwordAlert.variant}>{passwordAlert.message}</Alert>
      )}
      <h3 className="pt-4">Delete Account</h3>
      <div className="mb-3">
        <button
          className="btn btn-danger"
          onClick={() => setShowDeleteAccountModal(true)}
        >
          Delete Account
        </button>
        <Modal
          show={showDeleteAccountModal}
          onHide={() => setShowDeleteAccountModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Deleting your account cannot be undone.</Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteAccountModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={deleteAccount}>
              Delete Account
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
