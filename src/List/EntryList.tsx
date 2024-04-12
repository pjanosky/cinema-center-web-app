import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List } from "../API/Lists/types";
import { useCurrentUser } from "../Account/hooks";
import EntryItem from "./EntryItem";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function EntryList({
  list,
  setList,
}: {
  list: List;
  setList: (setter: (list: List) => List) => void;
}) {
  const currentUser = useCurrentUser();
  return (
    <ul className="list-group">
      {list &&
        list.entries.map((entry) => (
          <li key={entry.movieId} className="list-group-item">
            {currentUser && currentUser._id === list.userId ? (
              <EntryItem entry={entry} list={list} setList={setList} />
            ) : (
              <Link to={`/details/${entry.movieId}`}>
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1 flex-shrink-1">
                    <EntryItem entry={entry} list={list} setList={setList} />
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
