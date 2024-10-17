import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // Ensure you have your axios instance set up
import { useUser } from "../contexts/UserContext"; // User context for auth
import UploadDocumentModal from "../components/UploadDocumentModal"; // Import the modal for uploading documents

const DocumentsPage = () => {
  const { user } = useUser(); // Get user data to ensure authorization
  const [documents, setDocuments] = useState([]);

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axiosInstance.get("/documents");
        console.log("Fetched documents:", response.data);
        setDocuments(response.data.documents); // Access the documents array
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  // Refresh documents list after any action (like delete)
  const refreshDocuments = async () => {
    try {
      const response = await axiosInstance.get("/documents");
      setDocuments(response.data.documents); // Access the documents array
    } catch (error) {
      console.error("Error refreshing documents:", error);
    }
  };

  // Handle deletion of a document
  const handleDelete = async (documentId) => {
    try {
      await axiosInstance.delete(`/documents/${documentId}`);
      refreshDocuments(); // Refresh documents after deletion
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Function to render a preview based on document type
  const renderDocumentPreview = (doc) => {
    const fileType = doc.documentType;

    if (fileType.includes("image")) {
      return (
        <img
          src={doc.documentImageURL} // Use the image URL for images
          alt={doc.documentName}
          className="w-full h-full object-cover"
        />
      );
    } else if (fileType.includes("pdf")) {
      return (
        <div className="w-full h-full overflow-hidden">
          <iframe
            src={doc.documentImageURL} // Use the PDF URL for PDF previews
            title="PDF Preview"
            className="w-full h-full border-none"
            style={{ overflow: "hidden" }} // Hide scrollbar
          />
        </div>
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
      {/* Button to open the modal */}
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
                {renderDocumentPreview(doc)} {/* Render document preview */}
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {doc.documentName}
                  <div className="badge badge-secondary">NEW</div>
                </h2>
                <p>{`Size: ${doc.documentSize} bytes`}</p>
                <div className="card-actions flex justify-between items-center">
                  <div className="badge badge-outline">{doc.documentType}</div>

                  {/* Three-Dot Menu */}
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-sm btn-ghost"
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
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                      <li>
                        <button onClick={() => handleDelete(doc._id)}>
                          Delete
                        </button>
                      </li>
                      <li>
                        <button>Share</button>
                      </li>
                    </ul>
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
  );
};

export default DocumentsPage;
