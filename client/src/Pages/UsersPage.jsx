import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../contexts/UserContext";
import Popup from "../components/Popup";
import UsersTable from "../components/UsersTable";

const UsersPage = () => {
  const { user } = useUser(); // Get user from context
  const [users, setUsers] = useState([]); // State for storing users
  const [filteredUsers, setFilteredUsers] = useState([]); // State for storing filtered users
  const [selectedUsers, setSelectedUsers] = useState([]); // State for storing selected users
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [toastType, setToastType] = useState(""); // State for toast type
  const [loading, setLoading] = useState(true); // Loading state
  const [dropdownOpen, setDropdownOpen] = useState(null); // State to manage dropdown open

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const response = await axiosInstance.get("/user/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUsers(response.data.users);
          setFilteredUsers(response.data.users);
        } else {
          setToastMessage("Failed to fetch users");
          setToastType("error");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setToastMessage("Error fetching users.");
        setToastType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

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
        "/user/users/batch-delete",
        { emails: selectedUsers },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUsers(users.filter((user) => !selectedUsers.includes(user.email)));
        setToastMessage("Selected users deleted successfully.");
        setToastType("success");
        setSelectedUsers([]); // Clear selection after deletion
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

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div>Loading...</div> // Replace with a loading spinner or skeleton if needed
      ) : (
        <>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full mb-4"
          />

          <button
            className="btn btn-error mb-4"
            onClick={deleteSelectedUsers}
            disabled={selectedUsers.length === 0} // Disable if no users are selected
          >
            Delete Selected Users
          </button>
          <UsersTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            handleSelectUser={handleSelectUser}
            deleteUser={deleteUser}
            toggleDropdown={toggleDropdown}
            dropdownOpen={dropdownOpen}
            handleAdminToggle={handleAdminToggle}
          />
        </>
      )}
      <Popup message={toastMessage} type={toastType} />{" "}
      {/* Your Popup for notifications */}
    </div>
  );
};

export default UsersPage;
