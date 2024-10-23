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

  const refreshDocuments = async () => {
    if (!user) return; // Check if user is logged in
    try {
      const response = await axiosInstance.get("/documents");
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error refreshing documents:", error);
      setToastMessage("Failed to refresh documents.");
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
    <div className="p-0 flex flex-col h-full">
      {/* Upload button - Fixed at the top */}
      <div className="mb-4">
        <button
          className="btn"
          onClick={() => document.getElementById("uploadModal").showModal()}
        >
          Upload File
        </button>
      </div>

      {/* Scrollable document cards container */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <UploadDocumentModal refreshDocuments={refreshDocuments} />

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
                <figure className="h-36 overflow-hidden">
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
                    <div className="badge badge-secondary badge-outline ml-1">
                      {doc.documentType}
                    </div>
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
                          d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm6.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>
                    </button>
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
