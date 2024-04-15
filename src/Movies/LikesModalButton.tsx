import { useState, useCallback, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Review } from "../API/Reviews/types";
import usersClient from "../API/Users/client";
import { User } from "../API/Users/types";
import UserList from "../Users/UserList";

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
      const users = await usersClient.getUsersWhoLikedReview(review._id);
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
        <div
          style={{
            maxHeight: "calc(100vh - 150px)",
            overflowY: "auto",
            borderRadius: "20px",
          }}
        >
          <UserList users={users} />
        </div>
      </Modal>
    </>
  );
}
