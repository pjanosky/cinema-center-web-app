import listsClient from "../API/Lists/client";
import { List } from "../API/Lists/types";
import { useRefetchOnUnauthorized } from "../Users/Hooks";

export default function ListEditor({
  editingList,
  setEditingList,
  setList,
}: {
  editingList: List;
  setEditingList: (list: List | undefined) => void;
  setList: (list: List) => void;
}) {
  const refetchOnUnauthorized = useRefetchOnUnauthorized();
  const updateList = async () => {
    if (!editingList) return;
    try {
      const updatedList = await listsClient.updateList(editingList);
      setList(updatedList);
      setEditingList(undefined);
    } catch (error) {
      refetchOnUnauthorized(error);
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="w-100">
          Title
          <input
            className="form-control"
            placeholder="Title your list"
            value={editingList.title}
            onChange={(e) =>
              setEditingList({
                ...editingList,
                title: e.target.value,
              })
            }
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="w-100">
          Description
          <textarea
            className="form-control"
            placeholder="Describe what kinds of movies are in this list"
            value={editingList.description}
            onChange={(e) =>
              setEditingList({
                ...editingList,
                description: e.target.value,
              })
            }
          ></textarea>
        </label>
      </div>
      <div className="mb-2 d-flex gap-2">
        <button
          className="btn btn-secondary"
          onClick={() => setEditingList(undefined)}
        >
          Cancel
        </button>
        <button className="btn btn-primary" onClick={updateList}>
          Save
        </button>
      </div>
    </div>
  );
}
