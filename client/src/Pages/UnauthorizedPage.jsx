import React from "react";
import { Link } from "react-router-dom";
import ToastNotification from "../components/Toast";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base p-6">
      <div className="max-w-md text-center bg-base-300 rounded-lg shadow-lg p-8 mb-28">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-contet mb-6">
          Sorry, you do not have permission to access this page. Please contact
          your administrator if you believe this is an error.
        </p>
        <Link to="/LoginPage" className="btn btn-outline btn-error">
          Go to Homepage
        </Link>
        <div>
          <ToastNotification />
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
