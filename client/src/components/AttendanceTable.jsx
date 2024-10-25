import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"; // Adjust the import path if necessary

const AttendanceTable = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today's date
  const [nameFilter, setNameFilter] = useState(""); // State for name filter

  // Fetch attendance records on mount or when selectedDate changes
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axiosInstance.get(
          `/attendance?date=${selectedDate}` // Use date query parameter
        );
        setAttendanceRecords(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch attendance records.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [selectedDate]);

  // Consolidate loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Filter records based on the name filter
  const filteredRecords = attendanceRecords.filter((record) =>
    record.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Attendance Records</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="Filter by name"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-base-300">
          <thead>
            <tr className="bg-base-300">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Login Time</th>
              <th className="border border-gray-300 px-4 py-2">Logout Time</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {record.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.loginTime
                      ? new Date(record.loginTime).toLocaleString()
                      : "No login record"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.logoutTime
                      ? new Date(record.logoutTime).toLocaleString()
                      : "Not logged out yet"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {record.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center border border-gray-300 px-4 py-2"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
