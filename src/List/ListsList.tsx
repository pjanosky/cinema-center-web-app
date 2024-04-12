import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List } from "../API/Lists/types";
import { useCurrentUser } from "../Account/hooks";
import ListItem from "./ListItem";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ListsList({
  lists,
  setLists,
  showList,
  movieId,
}: {
  lists: List[];
  setLists: (setter: (lists: List[]) => List[]) => void;
  showList?: (list: List) => boolean;
  movieId?: string;
}) {
  const currentUser = useCurrentUser();

  return (
    <ul className="list-group">
      {lists
        .filter((list) => !showList || showList(list))
        .map((list) => (
          <li key={list._id} className="list-group-item">
            {currentUser && currentUser._id === list.userId ? (
              <ListItem list={list} setLists={setLists} movieId={movieId} />
            ) : (
              <Link to={`/lists/${list._id}`}>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 flex-shrink-1">
                    <ListItem
                      list={list}
                      setLists={setLists}
                      movieId={movieId}
                    />
                  </div>
                  <FontAwesomeIcon
                    className="flex-grow-0 flex-shrink-0"
                    icon={faChevronRight}
                  />
                </div>
              </Link>
            )}
          </li>
        ))}
    </ul>
  );
}
