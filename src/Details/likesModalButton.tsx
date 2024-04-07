import { Modal } from "react-bootstrap";
import UserList from "../Profile/Followers/userList";
import { Review, User } from "../types";
import { useCallback, useEffect, useState } from "react";
import * as client from "./client";

export default function LikesModalButton({
  review,
  children,
}: {
  review: Review;
  children: React.ReactElement;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [show, setShow] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const users = await client.getLikesForReview(review._id);
      setUsers(users);
    } catch (error) {
      console.log(error);
    }
  }, [review]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        style={{
          backgroundColor: "transparent",
          border: "none",
          padding: "0px",
        }}
      >
        {children}
      </button>
      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {review.likes.length} Like{review.likes.length === 1 ? "" : "s"}
          </Modal.Title>
        </Modal.Header>
        <UserList users={users} />
      </Modal>
    </>
  );
}
