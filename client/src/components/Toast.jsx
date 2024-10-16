import React, { useEffect, useState } from "react";

const ToastNotification = () => {
  const [isOutlined, setIsOutlined] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOutlined((prev) => !prev);
    }, 500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="toast toast-center mb-24">
      <div className={`alert ${isOutlined ? "alert-outline" : "alert-error"}`}>
        <span>
          This event shall trigger notification to the administrators.
        </span>
      </div>
    </div>
  );
};

export default ToastNotification;
