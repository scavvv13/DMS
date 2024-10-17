import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // Ensure you have your axios instance set up
import { useUser } from "../contexts/UserContext"; // User context for auth

const UploadDocumentModal = ({ onClose, refreshDocuments }) => {
  const { user } = useUser(); // Get user data to ensure authorization
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState(""); // State for document name
  const [uploadError, setUploadError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError(null); // Reset error on new file selection
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file); // Append the selected file
    formData.append("documentName", documentName); // Add the document name

    if (!user || !user.id) {
      setUploadError("Uploader information is missing.");
      return;
    }

    formData.append("documentUploader", user.id); // Use the uploader's ID

    // Remove the file type check since we allow all types
    formData.append("documentType", file.type); // You can still store the file type if needed

    // Populate this array with IDs of users who should have access
    const accessUsers = []; // Example: ['605c72d3f1e6b8b75d9a2c0c', '605c72d3f1e6b8b75d9a2c0d'];

    // Append user IDs to formData
    accessUsers.forEach((userId) => {
      formData.append("haveAccess", userId); // Append each user ID
    });

    setLoading(true);
    try {
      await axiosInstance.post("/documents", formData);
      setFile(null);
      setDocumentName("");
      setUploadError(null);

      // Refresh documents after upload
      await refreshDocuments();

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      {/* Add overlay to close modal */}
      <div className="modal-box">
        <h3 className="font-bold text-lg">Upload Document</h3>
        <form onSubmit={handleUpload} className="py-4">
          <input
            type="text"
            placeholder="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            required
            className="input input-bordered w-full mb-2"
          />
          <input
            type="file"
            className="file-input file-input-bordered file-input-secondary w-full mb-2"
            onChange={handleFileChange}
            required
          />
          {uploadError && <p className="text-red-500">{uploadError}</p>}
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button type="button" onClick={onClose} className="btn">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
