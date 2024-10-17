import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../contexts/UserContext";
import UploadDocumentModal from "../components/UploadDocumentModal";
import DocumentMenuModal from "../components/DocumentMenuModal"; // Import the new modal
import Popup from "../components/Popup"; // Import your Popup component for notifications

const DocumentsPage = () => {
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null); // State for selected document
  const [shareEmail, setShareEmail] = useState("");
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [toastType, setToastType] = useState(""); // State for toast type
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false); // State for managing modal visibility

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axiosInstance.get("/documents");
        setDocuments(response.data.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  const formatFileSize = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const refreshDocuments = async () => {
    try {
      const response = await axiosInstance.get("/documents");
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Error refreshing documents:", error);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await axiosInstance.delete(`/documents/${documentId}`);
      setToastMessage("Document deleted successfully.");
      setToastType("success");
      refreshDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      setToastMessage(error.response.data.message);
      setToastType("error");
    }
  };

  const handleShare = async (documentId) => {
    try {
      const response = await axiosInstance.post(
        `/documents/${documentId}/share`,
        { email: shareEmail }
      );
      setToastMessage(response.data.message);
      setToastType("success");
      setShareEmail("");
      refreshDocuments();
    } catch (error) {
      console.error("Error sharing document:", error);
      setToastMessage(error.response.data.message);
      setToastType("error");
    }
  };

  const handleRemoveAccess = async (documentId, email) => {
    try {
      await axiosInstance.post(`/documents/${documentId}/remove-access`, {
        email,
      });
      setToastMessage("Access removed successfully.");
      setToastType("success");
      refreshDocuments();
    } catch (error) {
      console.error("Error removing access:", error);
      setToastMessage(error.response.data.message);
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
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">
            Preview not available for this file type.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="p-4">
      <button
        className="btn"
        onClick={() => document.getElementById("uploadModal").showModal()}
      >
        Upload File
      </button>

      <UploadDocumentModal refreshDocuments={refreshDocuments} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {Array.isArray(documents) && documents.length > 0 ? (
          documents.map((doc) => (
            <div className="card bg-base-300 shadow-xl" key={doc._id}>
              <figure className="h-48 overflow-hidden">
                {renderDocumentPreview(doc)}
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {doc.documentName}
                  <div className="badge badge-secondary">NEW</div>
                </h2>
                <p>{`Size: ${formatFileSize(doc.documentSize)}`}</p>
                <div className="card-actions flex justify-between items-center">
                  <div className="badge badge-outline">{doc.documentType}</div>
                  <button
                    className="btn btn-sm btn-ghost"
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
                      className="w-6 h-6"
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
          onRemoveAccess={handleRemoveAccess} // Pass the function here
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
