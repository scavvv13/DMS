import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  HiUsers,
  HiHome,
  HiDocument,
  HiClipboard,
  HiCog,
} from "react-icons/hi";
import miaa from "../assets/miaa.png";
import axiosInstance from "../utils/axiosInstance"; // Import your axios instance

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // Ensure notifications is an array
  const { logout, timeout, user } = useUser();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleTimeOut = async () => {
    try {
      // Log the logout event by calling the logout API and pass the user ID in the request
      await axiosInstance.patch(`/logLogout`, { userId: user.id }); // Send only the user ID
    } catch (error) {
      console.error("Failed to log logout:", error);
      // Optionally show an error notification or message here
    }
  };

  const handleLogout = async () => {
    await handleTimeOut(); // Log the logout event first
    logout(); // Perform the logout action
    navigate("/LoginPage"); // Redirect to the login page
  };

  // Fetch notifications from the backend using axiosInstance
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get("/notifications"); // Adjust the endpoint as necessary
      if (Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
      } else {
        console.error("Unexpected response format:", response.data);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications(); // Fetch notifications when user is logged in
    }
  }, [user]);

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-full bg-primary text-white focus:outline-none absolute top-4 left-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`flex flex-col bg-base-300 rounded-2xl w-64 space-y-6 py-7 px-4 mr-2 h-[530px] absolute inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-lg`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-4">
          <a className="btn btn-ghost text-xl">
            <img
              className="w-24 my-auto text-transparent"
              src={miaa}
              alt="MIAA LOGO"
            />
          </a>
        </div>

        {/* Notifications Section */}
        <div className="mt-4">
          <h2 className="font-semibold text-lg mb-2">Recent</h2>
          <div className="bg-base-200 rounded-md p-3 shadow-inner">
            {notifications.length === 0 ? (
              <p className="text-sm">No new notifications</p>
            ) : (
              <>
                <p className="text-sm">
                  {notifications[0].title} {notifications[0].content}
                </p>
                {notifications.length > 1 && (
                  <p
                    className="text-primary cursor-pointer"
                    onClick={() =>
                      document.getElementById("my_modal_2").showModal()
                    }
                  >
                    View all notifications
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Notifications Modal */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box max-w-4xl max-h-[80vh] overflow-y-auto no-scrollbar">
            <h3 className="font-bold text-lg mb-4">All Notifications</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr className="bg-base-200">
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Content</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{notification.title}</td>
                      <td className="px-4 py-2">{notification.content}</td>
                      <td className="px-4 py-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-action justify-end">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => document.getElementById("my_modal_2").close()}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>

        {/* Nav Items */}
        <nav className="flex flex-col items-center justify-center flex-grow">
          {user && user.role === "admin" && (
            <>
              <Link
                to="/admin/DashboardPage"
                className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
              >
                <HiHome className="mr-2" />
                Dashboard
              </Link>
              <Link
                to="/admin/UsersPage"
                className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
              >
                <HiUsers className="mr-2" />
                Users
              </Link>
            </>
          )}
          <Link
            to="/admin/DocumentsPage"
            className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
          >
            <HiDocument className="mr-2" />
            Documents
          </Link>
          <Link
            to="/admin/MemosPage"
            className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
          >
            <HiClipboard className="mr-2" />
            Memos
          </Link>

          {user.role === "user" && (
            <Link
              to="/user/UserDashPage"
              className="flex items-center py-2.5 px-4 rounded-md transition duration-200 hover:bg-transparent hover:text-primary hover:border hover:border-primary focus:bg-primary focus:text-white w-full text-center"
            >
              <HiClipboard className="mr-2" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Logout Button */}
        <div className="mb-5">
          <button
            className="py-2 rounded-md btn btn-outline btn-primary w-full hover:bg-primary hover:text-white transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
