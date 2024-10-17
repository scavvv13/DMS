import React, { useState, useEffect } from "react";

const DocumentMenuModal = ({
  document,
  shareEmail,
  setShareEmail,
  onDelete,
  onShare,
  onClose,
  onRemoveAccess,
}) => {
  const [currentAccessList, setCurrentAccessList] = useState(
    document.haveAccess
  );

  // Update access list when document prop changes
  useEffect(() => {
    setCurrentAccessList(document.haveAccess);
  }, [document]);

  const handleRemoveAccess = async (documentId, userEmail) => {
    // Call the onRemoveAccess function and update the access list if successful
    const success = await onRemoveAccess(documentId, userEmail);
    if (success) {
      // Remove the user from the current access list
      setCurrentAccessList((prevAccess) =>
        prevAccess.filter((user) => user.email !== userEmail)
      );
    }
  };

  return (
    <dialog id="documentMenuModal" className="modal modal-open">
      <form method="dialog" className="modal-box no-scrollbar">
        <h3 className="font-bold text-lg">Document Menu</h3>
        <p className="py-4">You can share or delete this document.</p>

        {/* Displaying Document Details */}
        <div className="mb-4">
          <h4 className="font-semibold">Document Details:</h4>
          <p>
            <strong>Name:</strong> {document.documentName}
          </p>
          <p>
            <strong>Size:</strong> {formatFileSize(document.documentSize)}
          </p>
          <p>
            <strong>Type:</strong> {document.documentType}
          </p>
          <p>
            <strong>Access:</strong>
          </p>
          <div>
            {currentAccessList && currentAccessList.length > 0 ? (
              <ul>
                {currentAccessList.map((user, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{user.email}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveAccess(document._id, user.email)
                      }
                      className="btn btn-outline btn-error btn-circle ml-4"
                      title="Remove Access"
                    >
                      &minus;
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <span>No users have access.</span>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Share with email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className="input input-bordered mb-4"
          />
          <button
            type="button"
            onClick={() => {
              // Check if user already has access
              if (currentAccessList.some((user) => user.email === shareEmail)) {
                alert("User already has access to this document.");
              } else {
                onShare(document._id, shareEmail);
                setShareEmail(""); // Clear the email input
                onClose(); // Close modal after sharing
              }
            }}
            className="btn btn-primary mb-2"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(document._id);
              onClose(); // Close modal after deletion
            }}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>

        <div className="modal-action">
          <button type="button" onClick={onClose} className="btn">
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export default DocumentMenuModal;
