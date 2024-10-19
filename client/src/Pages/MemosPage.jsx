import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance"; // Adjust the import based on your axios setup

const MemosPage = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMemo, setNewMemo] = useState({ title: "", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null); // State to hold memo being edited

  // Ref for the modal
  const modalRef = useRef();

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await axiosInstance.get("/memos");
        console.log(response.data); // Log the full response to see the structure
        const { memos } = response.data; // Adjust based on the actual structure returned

        if (Array.isArray(memos)) {
          setMemos(memos); // Set memos only if response data is an array
        } else {
          throw new Error("Response is not an array");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch memos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/memo/${id}`);
      setMemos((prevMemos) => prevMemos.filter((memo) => memo._id !== id)); // Use _id for comparison
    } catch (err) {
      setError("Failed to delete memo.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMemo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMemo.title || !newMemo.content) {
      setError("Both title and content are required.");
      return;
    }

    try {
      const response = await axiosInstance.post("/memos", newMemo);
      setMemos((prev) => [...prev, response.data.memo]); // Adjust if needed based on response structure
      setNewMemo({ title: "", content: "" }); // Reset the form
      setIsModalOpen(false); // Close modal after adding memo
    } catch (err) {
      console.error(err);
      setError("Failed to add memo.");
    }
  };

  const handleOpenModal = () => {
    setNewMemo({ title: "", content: "" }); // Reset memo data
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (memo) => {
    setEditingMemo(memo);
    setNewMemo({ title: memo.MemoTitle, content: memo.MemoContent });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newMemo.title || !newMemo.content) {
      setError("Both title and content are required.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/memo/${editingMemo._id}`, // Use _id for updating
        newMemo
      );
      setMemos(
        (prev) =>
          prev.map((memo) =>
            memo._id === editingMemo._id ? response.data.memo : memo
          ) // Use _id for comparison
      ); // Update the edited memo in the state
      setNewMemo({ title: "", content: "" });
      setIsModalOpen(false); // Close modal after updating memo
      setEditingMemo(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update memo.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      {/* Button to add a new memo */}
      <button onClick={handleOpenModal} className="btn btn-base-300 mb-4">
        Add Memo
      </button>

      {/* Memos list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {memos.length > 0 ? (
          memos.map((memo) => (
            <div
              key={memo._id} // Use unique identifier as key
              className="card bg-base-300 shadow-lg rounded-lg p-4 relative hover:shadow-xl transition-shadow"
            >
              <div className="card-body">
                <h2 className="card-title text-lg font-semibold">
                  {memo.MemoTitle}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{memo.MemoContent}</p>
                <div className="absolute top-2 right-2">
                  <button
                    className="w-8 h-8 p-1 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    tabIndex={0}
                    onClick={() => handleEdit(memo)} // Open edit modal directly
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                  <button
                    className="w-8 h-8 p-1 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    onClick={() => handleDelete(memo._id)} // Use _id for deletion
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No memos available.</p>
        )}
      </div>

      {/* Modal for adding/editing memos */}
      {isModalOpen && (
        <dialog ref={modalRef} className="modal modal-open">
          <form
            method="dialog"
            className="modal-box"
            onSubmit={editingMemo ? handleUpdate : handleSubmit}
          >
            <h2 className="font-bold text-lg mb-4">
              {editingMemo ? "Edit Memo" : "Add Memo"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="title">
                Memo Title
              </label>
              <input
                type="text"
                id="title" // Updated to use id
                name="title"
                value={newMemo.title}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter memo title"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="content">
                Memo Content
              </label>
              <textarea
                id="content" // Updated to use id
                name="content"
                value={newMemo.content}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full"
                placeholder="Enter memo content"
                required
              ></textarea>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                {editingMemo ? "Update Memo" : "Add Memo"}
              </button>
              <button type="button" className="btn" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default MemosPage;
