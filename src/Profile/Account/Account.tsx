import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { InputGroup, Alert, Form, Modal } from "react-bootstrap";
import {
  useAssertCurrentUser,
  useRefetchOnUnauthorized,
  useRefetchUser,
} from "../../Users/Hooks";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import usersClient from "../../API/Users/client";
import { IfEditor } from "../../Users/Components";

export default function Account() {
  const currentUser = useAssertCurrentUser();
  const { id } = useParams();
  const refetchUser = useRefetchUser();
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    _id: "",
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    username: currentUser?.username || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    bio: "",
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
  const refetchOnUnauthorized = useRefetchOnUnauthorized();

  useEffect(() => {
    if (currentUser) {
      setAccount((account) => ({ ...account, ...currentUser }));
    }
  }, [currentUser]);

  const showPasswordError =
    account.newPassword &&
    account.confirmPassword &&
    account.newPassword !== account.confirmPassword;
  const updateProfile = async () => {
    setProfileAlert({ message: "", variant: "" });
    try {
      await usersClient.updateUserInformation(account);
      await refetchUser();
      setProfileAlert({
        message: "Profile updated successfully",
        variant: "success",
      });
    } catch (error) {
      refetchOnUnauthorized(error);
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
      if (!currentUser) return;
      await usersClient.updateUserPassword(currentUser._id, account);
      setPasswordAlert({
        message: "Password updated",
        variant: "success",
      });
      await refetchUser();
    } catch (error) {
      refetchOnUnauthorized(error);
      if (isAxiosError(error) && error.response?.status === 400) {
        setPasswordAlert({
          message: error.response.data,
          variant: "danger",
        });
      }
    }
  };
  const deleteAccount = async () => {
    if (!currentUser) return;
    try {
      await usersClient.deleteUser(currentUser._id);
      await refetchUser();
      navigate("/login", { replace: true });
    } catch (error) {
      refetchOnUnauthorized(error);
      console.log(error);
    }
  };

  if (id !== currentUser?._id) {
    return <div></div>;
  }

  return (
    <div className="cc-profile-account" style={{ maxWidth: "600px" }}>
      <h2>Account</h2>
      <h3>Information</h3>
      <div className="mb-3">
        <label className="w-100">
          Name
          <input
            type="text"
            placeholder="John Doe"
            spellCheck={false}
            autoComplete="name"
            className="form-control"
            value={account.name}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="w-100">
          Email
          <input
            type="email"
            placeholder="username@example.com"
            autoComplete="email"
            className="form-control"
            value={account.email}
            onChange={(e) => setAccount({ ...account, email: e.target.value })}
          />
        </label>
      </div>
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
            value={account.username}
            onChange={(e) =>
              setAccount({ ...account, username: e.target.value })
            }
          />
        </label>
      </div>
      <IfEditor>
        <div className="mb-3">
          <label className="w-100">
            Bio
            <textarea
              placeholder="Write something about yourself"
              spellCheck={true}
              className="form-control"
              value={account.bio}
              onChange={(e) => setAccount({ ...account, bio: e.target.value })}
              rows={5}
            ></textarea>
          </label>
        </div>
      </IfEditor>
      <div className="mb-3">
        <label className="w-100">
          Role
          <input
            className="form-control"
            disabled={true}
            value={currentUser?.role === "user" ? "Watcher" : "Editor"}
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
        <label className="w-100">
          Old Password
          <InputGroup>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your current password"
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
        <label className="w-100">
          New Password
          <InputGroup>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Choose a new password"
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
        <label className="w-100">
          Confirm Password
          <InputGroup>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password again"
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
          <Modal.Body>
            Deleting your account will delete all of your data. This cannot be
            undone.
          </Modal.Body>
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
