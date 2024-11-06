import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useOutletContext } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const MemosPage = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMemo, setNewMemo] = useState({ title: "", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);
  const [filteredMemos, setFilteredMemos] = useState([]);
  const { searchTerm } = useOutletContext();
  const { user } = useUser();

  const modalRef = useRef();

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const response = await axiosInstance.get("/memos");
        const { memos } = response.data;
        if (Array.isArray(memos)) {
          setMemos(memos);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (err) {
        setError("Failed to fetch memos.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = memos.filter((memo) =>
        memo.MemoTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMemos(filtered);
    } else {
      setFilteredMemos(memos);
    }
  }, [searchTerm, memos]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/memo/${id}`);
      setMemos((prevMemos) => prevMemos.filter((memo) => memo._id !== id));
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
      setMemos((prev) => [response.data.memo, ...prev]);
      setNewMemo({ title: "", content: "" });
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to add memo.");
    }
  };

  const handleOpenModal = () => {
    setNewMemo({ title: "", content: "" });
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
        `/memo/${editingMemo._id}`,
        newMemo
      );
      setMemos((prev) =>
        prev.map((memo) =>
          memo._id === editingMemo._id ? response.data.memo : memo
        )
      );
      setNewMemo({ title: "", content: "" });
      setIsModalOpen(false);
      setEditingMemo(null);
    } catch (err) {
      setError("Failed to update memo.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      {user.role === "admin" && (
        <button onClick={handleOpenModal} className="btn btn-base-300 mb-4">
          Add Memo
        </button>
      )}

      <div className="flex flex-col items-center">
        {filteredMemos.length > 0 ? (
          <>
            <div className="w-full md:w-1/2 lg:w-full mb-6 overflow-scroll no-scrollbar  ">
              <div className="card bg-base-300 shadow-lg rounded-lg p-1 relative hover:shadow-xl transition-shadow">
                <div className="card-body h-72">
                  <h2 className="card-title text-xl font-semibold">
                    {filteredMemos[0].MemoTitle}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {filteredMemos[0].MemoContent}
                  </p>
                  {user.role === "admin" && (
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button onClick={() => handleEdit(filteredMemos[0])}>
                        {/* Edit Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 text-blue-500 hover:text-blue-700"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 4.232a3 3 0 014.243 4.243L7.5 20.5l-4 1 1-4L15.232 4.232z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(filteredMemos[0]._id)}
                      >
                        {/* Delete Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {filteredMemos.slice(1).map((memo) => (
                <div
                  key={memo._id}
                  className="card bg-base-200 shadow rounded-lg p-2 h-48 relative hover:shadow-md transition-shadow"
                >
                  <div className="card-body overflow-hidden">
                    <h2 className="card-title text-lg font-medium">
                      {memo.MemoTitle}
                    </h2>
                    <p className="text-xs text-gray-600">{memo.MemoContent}</p>
                    {user.role === "admin" && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button onClick={() => handleEdit(filteredMemos[0])}>
                          {/* Edit Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 text-blue-500 hover:text-blue-700"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 4.232a3 3 0 014.243 4.243L7.5 20.5l-4 1 1-4L15.232 4.232z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(filteredMemos[0]._id)}
                        >
                          {/* Delete Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No memos available.</p>
        )}
      </div>

      {isModalOpen && (
        <dialog ref={modalRef} className="modal modal-open no-scrollbar">
          <form
            method="dialog"
            className="modal-box no-scrollbar"
            onSubmit={editingMemo ? handleUpdate : handleSubmit}
          >
            <h2 className="font-bold text-lg mb-4">
              {editingMemo ? "Edit Memo" : "Add Memo"}
            </h2>
            <div className="mb-4">
              <label htmlFor="title">Memo Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newMemo.title}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter memo title"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="content">Memo Content</label>
              <textarea
                id="content"
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
