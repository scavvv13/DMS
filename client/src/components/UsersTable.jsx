// src/components/UsersTable.js

const UsersTable = ({
  users,
  selectedUsers,
  handleSelectUser,
  deleteUser,
  toggleDropdown,
  dropdownOpen,
  handleAdminToggle,
}) => {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" className="checkbox" />
            </label>
          </th>
          <th>Name</th>
          <th>Email</th>
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
                        src={
                          user.profilePicture ||
                          "https://via.placeholder.com/150"
                        } // Fallback image if profilePic is not available
                        alt={`${user.name}'s avatar`}
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
            <td colSpan="5" className="text-center">
              Hey, no users found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UsersTable;
