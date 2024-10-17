import React, { useEffect, useState } from "react";

const Popup = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      setVisible(true); // Show the popup when there's a new message
      const timeout = setTimeout(() => {
        setVisible(false); // Hide the popup after 3 seconds
        onClose(); // Call the onClose function to notify the parent
      }, 3000);

      return () => clearTimeout(timeout); // Cleanup on unmount
    } else {
      setVisible(false); // Hide if no message is provided
    }
  }, [message, onClose]);

  if (!visible) return null; // Don't render if not visible

  return (
    <div className="toast toast-end">
      <div
        className={`alert ${
          type === "success" ? "alert-success" : "alert-error"
        }`}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Popup;
