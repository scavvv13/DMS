import React, { useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance"; // Ensure you have your axios instance set up
import { useUser } from "../contexts/UserContext"; // User context for auth

const UploadDocumentModal = ({ refreshDocuments, selectedFolder }) => {
  const { user } = useUser(); // Get user data to ensure authorization
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState(""); // State for document name
  const [uploadError, setUploadError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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
    formData.append("documentUploader", user.id); // Use the uploader's ID
    formData.append("documentType", file.type); // Store the file type
    if (selectedFolder) {
      formData.append("folderId", selectedFolder); // Add the selected folder ID if it exists
    }

    console.log("Selected folder:", selectedFolder);
    setLoading(true);

    // Populate this array with IDs of users who should have access
    const accessUsers = []; // Example: ['605c72d3f1e6b8b75d9a2c0c', '605c72d3f1e6b8b75d9a2c0d'];
    accessUsers.forEach((userId) => {
      formData.append("haveAccess", userId); // Append each user ID
    });

    // Debugging: Log the FormData contents
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setLoading(true);

    try {
      // Send the form data to the backend
      const response = await axiosInstance.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure this header is set correctly
        },
      });

      // Clear the file input and document name after successful upload
      setFile(null);
      setDocumentName("");
      setUploadError(null);
      fileInputRef.current.value = ""; // Reset the file input field

      // Refresh documents after upload
      await refreshDocuments();

      // Close the modal
      document.getElementById("uploadModal").close();
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to get file preview based on type
  const getFilePreview = () => {
    if (!file) return null;

    const fileType = file.type;
    const fileUrl = URL.createObjectURL(file); // Create a temporary URL for preview

    if (fileType.includes("image")) {
      return (
        <img
          src={fileUrl}
          alt="Preview"
          className="w-full h-auto mb-2 rounded-lg"
        />
      );
    } else if (fileType.includes("pdf")) {
      return (
        <iframe
          src={fileUrl}
          title="PDF Preview"
          className="w-full h-48 mb-2"
          frameBorder="0"
        />
      );
    } else {
      // For DOCX and other file types
      return (
        <p className="text-gray-500">
          Preview not available for this file type.
        </p>
      );
    }
  };

  return (
    <dialog id="uploadModal" className="modal no-scrollbar">
      <div className="modal-box no-scrollbar">
        <h3 className="font-bold text-lg mb-3">Upload Document</h3>
        {getFilePreview()} {/* Show file preview based on type */}
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
            ref={fileInputRef} // Assign the ref to the file input
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
            <button
              type="button"
              onClick={() => document.getElementById("uploadModal").close()}
              className="btn"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default UploadDocumentModal;
