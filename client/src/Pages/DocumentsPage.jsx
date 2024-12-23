import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../contexts/UserContext";
import { useOutletContext } from "react-router-dom";
import UploadDocumentModal from "../components/UploadDocumentModal";
import DocumentMenuModal from "../components/DocumentMenuModal";
import Popup from "../components/Popup";
import pdf from "../assets/file.png";

const DocumentsPage = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const { searchTerm } = useOutletContext(); // Get search term from Layout
  const [shareEmail, setShareEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for documents
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null); // State to keep track of selected folder

  const fetchFolders = async () => {
    try {
      const response = await axiosInstance.get(`/folders`);
      setFolders(response.data.folders);
    } catch (error) {
      console.error("Error fetching folders:", error);
      setToastMessage("Failed to fetch folders. Please try again.");
      setToastType("error");
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  const fetchDocuments = async (folderId = null) => {
    if (!user) {
      setToastMessage("You need to be logged in to view documents.");
      setToastType("error");
      return;
    }

    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axiosInstance.get("/documents", {
        params: { folderId },
      });
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setToastMessage("Failed to fetch documents. Please try again.");
      setToastType("error");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchDocuments(selectedFolder); // Fetch documents for the selected folder
  }, [user, selectedFolder]);

  const createFolder = async () => {
    try {
      const response = await axiosInstance.post("/folders", {
        folderName: newFolderName,
      });
      setNewFolderName("");
      setToastMessage("Folder created successfully");
      setToastType("success");
      fetchFolders(); // Refresh folders after creating a new one
    } catch (error) {
      console.error("Error creating folder:", error);
      setToastMessage("Failed to create folder. Please try again.");
      setToastType("error");
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      await axiosInstance.delete(`/folder/${folderId}`);
      setToastMessage("Folder deleted successfully");
      setToastType("success");
      fetchFolders(); // Refresh folders after deleting one
    } catch (error) {
      console.error("Error deleting folder:", error);
      setToastMessage("Failed to delete folder. Please try again.");
      setToastType("error");
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) {
        setToastMessage("You need to be logged in to view documents.");
        setToastType("error");
        return;
      }

      setLoading(true); // Set loading to true while fetching
      try {
        const response = await axiosInstance.get("/documents");
        setDocuments(response.data.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setToastMessage("Failed to fetch documents. Please try again.");
        setToastType("error");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDocuments();
    console.log(user.name);
  }, [user]); // Depend on user to refetch when user state changes

  useEffect(() => {
    if (searchTerm) {
      const filtered = documents.filter((doc) =>
        doc.documentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents); // No search term, show all documents
    }
  }, [searchTerm, documents]);

  const formatFileSize = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileTypeDisplayName = (mimeType) => {
    const fileTypeMappings = {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOC",
      "application/pdf": "PDF",
      "image/jpeg": "JPEG ",
      "image/png": "PNG",
      // Add more mappings as needed
    };

    return fileTypeMappings[mimeType] || mimeType; // Default to raw MIME type
  };

  const refreshDocuments = async () => {
    if (!user) return; // Check if user is logged in
    try {
      await fetchDocuments(selectedFolder); // Fetch documents for the selected folder
    } catch (error) {
      console.error("Error refreshing documents:", error);
      setToastMessage("Failed to refresh documents.");
      setToastType("error");
    }
  };

  const handleDownload = async (documentPath) => {
    if (!user) return; // Ensure user is logged in
    try {
      const encodedFilePath = encodeURIComponent(documentPath); // Encode the document path
      const response = await axiosInstance.get(
        `/documents/${encodedFilePath}/download`
      );

      const downloadUrl = response.data.downloadUrl; // Extract the signed URL from the response

      const link = document.createElement("a");
      link.href = downloadUrl; // Use the signed URL
      link.setAttribute("download", "document.png"); // Change name if needed
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToastMessage("Download started.");
      setToastType("success");
    } catch (error) {
      console.error("Error downloading document:", error);
      setToastMessage("Failed to download document.");
      setToastType("error");
    }
  };

  const handleDelete = async (documentId) => {
    if (!user) return; // Ensure user is logged in
    try {
      await axiosInstance.delete(`/documents/${documentId}`);
      setToastMessage("Document deleted successfully.");
      setToastType("success");
      refreshDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      setToastMessage(
        error.response.data.message || "Failed to delete document."
      );
      setToastType("error");
    }
  };

  const handleShare = async (documentId) => {
    if (!user) return; // Ensure user is logged in
    try {
      const response = await axiosInstance.post(
        `/documents/${documentId}/share`,
        {
          email: shareEmail,
          name: user.name,
        }
      );
      setToastMessage(response.data.message);
      setToastType("success");
      setShareEmail("");
      refreshDocuments();
    } catch (error) {
      console.error("Error sharing document:", error);
      setToastMessage(
        error.response.data.message || "Failed to share document."
      );
      setToastType("error");
    }
  };

  const handleRemoveAccess = async (documentId, email) => {
    if (!user) return; // Ensure user is logged in
    try {
      await axiosInstance.post(`/documents/${documentId}/remove-access`, {
        email,
      });
      setToastMessage("Access removed successfully.");
      setToastType("success");
      refreshDocuments();
    } catch (error) {
      console.error("Error removing access:", error);
      setToastMessage(
        error.response.data.message || "Failed to remove access."
      );
      setToastType("error");
    }
  };

  const renderDocumentPreview = (doc) => {
    const fileType = doc.documentType;

    if (fileType.includes("image")) {
      return (
        <img
          src={doc.documentImageURL}
          alt={doc.documentName}
          className="w-full h-full object-cover"
        />
      );
    } else if (fileType.includes("pdf")) {
      return (
        <iframe
          src={doc.documentImageURL}
          title="PDF Preview"
          className="w-full h-full border-none"
          style={{ overflow: "hidden" }}
        />
      );
    } else {
      return (
        <div className="flex justify-center items-center h-36">
          <img
            src={pdf}
            className="text-gray-500 text-sm w-20"
            alt="File type icon"
          />
        </div>
      );
    }
  };

  return (
    <div>
      {/* Other components and logic here... */}
      <div className="mb-4 flex items-center space-x-2">
        <button
          className="btn"
          onClick={() => document.getElementById("uploadModal").showModal()}
        >
          Upload File
        </button>

        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New Folder Name"
          className="input"
        />
        <button className="btn btn-primary" onClick={createFolder}>
          Create Folder
        </button>
        <button
          className={`btn btn-secondary rounded-full px-4 py-2 ${
            selectedFolder === null ? "bg-blue-500" : ""
          }`}
          onClick={() => setSelectedFolder(null)}
        >
          All Files
        </button>
      </div>

      {/* Folders section */}
      <div className="folders-section mb-4">
        <h2 className="text-lg font-semibold mb-2">Folders</h2>

        <div className="flex flex-wrap gap-4">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="relative w-24 h-24 flex items-center justify-center"
            >
              {/* Folder Icon Button */}

              <button
                className={`w-full h-full rounded-md shadow-md flex items-center justify-center ${
                  selectedFolder === folder._id
                    ? "bg-yellow-500"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
                onClick={() => setSelectedFolder(folder._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12 text-white"
                >
                  <path d="M10 4a2 2 0 0 1 1.414.586l1.414 1.414A2 2 0 0 0 14.828 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5Z" />
                </svg>
              </button>

              {/* Delete Button */}
              <button
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                onClick={() => deleteFolder(folder._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>

              {/* Folder Name */}
              <span className="absolute bottom-1 text-sm font-medium text-center truncate w-full text-white">
                {folder.folderName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable document cards container */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <UploadDocumentModal
          refreshDocuments={refreshDocuments}
          selectedFolder={selectedFolder}
        />

        {/* Grid layout adjusted for 5 cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
          {loading ? (
            <p>Loading documents...</p>
          ) : Array.isArray(filteredDocuments) &&
            filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div
                className="card bg-base-300 shadow-xl compact-card"
                key={doc._id}
              >
                <figure className="h-36 overflow">
                  {renderDocumentPreview(doc)}
                </figure>
                <div className="card-body p-2">
                  <h2 className="card-title text-sm font-semibold">
                    {doc.documentName}
                  </h2>
                  <p className="text-xs">{`Size: ${formatFileSize(
                    doc.documentSize
                  )}`}</p>
                  <div className="card-actions flex justify-between items-center mt-2">
                    <div className="badge badge-secondary badge-outline ml-1 overflow-hidden">
                      {getFileTypeDisplayName(doc.documentType)}
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-ghost p-1"
                        onClick={() => handleDownload(doc.documentPath)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                          />
                        </svg>
                      </button>
                      <button
                        className="btn btn-sm btn-ghost p-1"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setIsMenuModalOpen(true); // Open modal using state
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75 0a.75.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75 0a.75.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No documents found.</p>
          )}
        </div>
      </div>

      {/* Popup for notifications */}
      {toastMessage && (
        <Popup message={toastMessage} type={toastType} duration={3000} />
      )}

      {/* Document Menu Modal */}
      {selectedDocument && isMenuModalOpen && (
        <DocumentMenuModal
          document={selectedDocument}
          shareEmail={shareEmail}
          setShareEmail={setShareEmail}
          onDelete={handleDelete}
          onShare={handleShare}
          onRemoveAccess={handleRemoveAccess}
          onClose={() => {
            setSelectedDocument(null);
            setShareEmail("");
            setIsMenuModalOpen(false); // Close modal using state
          }}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
