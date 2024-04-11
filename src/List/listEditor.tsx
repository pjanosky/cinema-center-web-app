import { List } from "../types";
import * as client from "../Profile/client";

export default function ListEditor({
  editingList,
  setEditingList,
  updateList,
}: {
  editingList: List;
  setEditingList: (list: List | undefined) => void;
  updateList: (list: List) => void;
}) {
  const save = async () => {
    if (!editingList) return;
    try {
      const updatedList = await client.updateList(editingList);
      updateList(updatedList);
      setEditingList(undefined);
    } catch (error) {
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
        <button className="btn btn-primary" onClick={save}>
          Save
        </button>
      </div>
    </div>
  );
}
