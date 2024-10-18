import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../contexts/UserContext";
import Popup from "../components/Popup"; // Import your Popup component for notifications

const UsersPage = () => {
  const { user } = useUser(); // Get user from context
  const [users, setUsers] = useState([]); // State for storing users
  const [selectedUsers, setSelectedUsers] = useState([]); // State for storing selected users
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [toastType, setToastType] = useState(""); // State for toast type
  const [loading, setLoading] = useState(true); // Loading state
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage dropdown open

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token directly from localStorage

        if (!token) {
          console.warn("No token found. Cannot fetch users.");
          setToastMessage("Session expired. Please log in again.");
          setToastType("error");
          return; // Exit if there's no token
        }

        const response = await axiosInstance.get("/user/users", {
          headers: { Authorization: `Bearer ${token}` }, // Pass token for authentication
        });

        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setToastMessage("Failed to fetch users");
          setToastType("error");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setToastMessage("Error fetching users.");
        setToastType("error");
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchUsers();
  }, []); // No dependencies needed since we're getting the token directly

  const deleteUser = async (email) => {
    setLoading(true); // Set loading state
    try {
      const token = localStorage.getItem("token"); // Get token again for delete

      if (!token) {
        console.warn("No token found. Cannot delete user.");
        setToastMessage("Session expired. Please log in again.");
        setToastType("error");
        return; // Exit if there's no token
      }

      const response = await axiosInstance.delete(`/user/users/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUsers(users.filter((user) => user.email !== email));
        setToastMessage("User deleted successfully.");
        setToastType("success");
      } else {
        setToastMessage("Failed to delete user.");
        setToastType("error");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setToastMessage("Error deleting user.");
      setToastType("error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const toggleDropdown = (email) => {
    setDropdownOpen(dropdownOpen === email ? null : email);
  };

  const handleAdminToggle = async (email, action) => {
    setLoading(true); // Set loading state
    try {
      const token = localStorage.getItem("token"); // Get token again for admin toggle

      if (!token) {
        console.warn("No token found. Cannot update user role.");
        setToastMessage("Session expired. Please log in again.");
        setToastType("error");
        return; // Exit if there's no token
      }

      const response = await axiosInstance.patch(
        action === "makeAdmin"
          ? `/user/users/make-admin/${email}`
          : `/user/users/revoke-admin/${email}`, // Use correct endpoint here
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setToastMessage(
          `User ${
            action === "makeAdmin" ? "made" : "removed"
          } as admin successfully.`
        );
        setToastType("success");
      } else {
        setToastMessage("Failed to update user role.");
        setToastType("error");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      setToastMessage("Error updating user role.");
      setToastType("error");
    } finally {
      setLoading(false); // Stop loading
      setDropdownOpen(null); // Close dropdown
    }
  };

  const handleSelectUser = (email) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((userEmail) => userEmail !== email)
        : [...prevSelected, email]
    );
  };

  const deleteSelectedUsers = async () => {
    setLoading(true); // Set loading state
    try {
      const token = localStorage.getItem("token"); // Get token for batch delete

      if (!token) {
        console.warn("No token found. Cannot delete users.");
        setToastMessage("Session expired. Please log in again.");
        setToastType("error");
        return; // Exit if there's no token
      }

      const response = await axiosInstance.post(
        `/user/users/batch-delete`,
        { emails: selectedUsers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUsers(users.filter((user) => !selectedUsers.includes(user.email)));
        setToastMessage("Selected users deleted successfully.");
        setToastType("success");
        setSelectedUsers([]); // Clear selected users after deletion
      } else {
        setToastMessage("Failed to delete selected users.");
        setToastType("error");
      }
    } catch (error) {
      console.error("Error deleting selected users:", error);
      setToastMessage("Error deleting selected users.");
      setToastType("error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Loading and error handling
  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <button
        className="btn mb-4"
        onClick={deleteSelectedUsers}
        disabled={selectedUsers.length === 0}
      >
        Delete Selected Users
      </button>
      <table className="table w-full">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  onChange={() => {
                    // Check/uncheck all users
                    if (selectedUsers.length === users.length) {
                      setSelectedUsers([]); // Unselect all
                    } else {
                      setSelectedUsers(users.map((user) => user.email)); // Select all
                    }
                  }}
                  checked={selectedUsers.length === users.length}
                />
              </label>
            </th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.email}>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedUsers.includes(user.email)}
                      onChange={() => handleSelectUser(user.email)}
                    />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={`https://api.adorable.io/avatars/285/${user.email}.png`}
                          alt="User Avatar"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-secondary badge-outline badge-sm">
                    {user.role}
                  </span>
                </td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => deleteUser(user.email)}
                  >
                    Delete
                  </button>
                  <div className="relative inline-block text-left">
                    <div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => toggleDropdown(user.email)}
                      >
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </div>
                    {dropdownOpen === user.email && (
                      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg">
                        <div className="py-1">
                          <button
                            className="block px-4 py-2 text-sm text-gray-700"
                            onClick={() =>
                              handleAdminToggle(
                                user.email,
                                user.role === "admin"
                                  ? "revokeAdmin"
                                  : "makeAdmin"
                              )
                            }
                          >
                            {user.role === "admin"
                              ? "Remove Admin"
                              : "Make Admin"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Popup message={toastMessage} type={toastType} />{" "}
      {/* Add the Popup component */}
    </div>
  );
};

export default UsersPage;
