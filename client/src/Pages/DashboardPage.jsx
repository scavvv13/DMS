import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import AttendanceTable from "../components/AttendanceTable";
import AttendancePie from "../components/AttendancePie";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const DashboardPage = () => {
  const [documentCount, setDocumentCount] = useState(0);
  const [sharedCount, setSharedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentDate = new Date().toISOString().split("T")[0]; // Format date as 'YYYY-MM-DD'

  // Fetch document count on mount
  useEffect(() => {
    const fetchDocumentCount = async () => {
      try {
        const response = await axiosInstance.get("countDocuments");
        setDocumentCount(response.data.count);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch document count.");
      }
    };

    const fetchSharedDocumentsCount = async () => {
      try {
        const response = await axiosInstance.get("countSharedDocuments");
        setSharedCount(response.data.count);
      } catch (err) {
        console.error("Error fetching shared documents count", err);
        setError("Failed to load shared documents count.");
      }
    };

    // Fetch both counts simultaneously
    Promise.all([fetchDocumentCount(), fetchSharedDocumentsCount()])
      .then(() => setLoading(false))
      .catch((err) => setLoading(false));
  }, []);

  // Consolidate loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  // Sample data for employees (you can replace this with real data)

  // Data for the Bar chart
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Documents Uploaded",
        data: [12, 19, 13, 15, 22, 30],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // Data for the Employee Attendance Pie chart

  return (
    <div className=" p-4 space-y-6">
      {/* Metrics Section */}

      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-base-100 shadow-md p-4">
          <div className="card-body">
            <h2 className="card-title text-sm">Total Documents</h2>
            <p className="text-2xl font-bold">{documentCount}</p>
            <p className="text-xs text-gray-500">Documents uploaded</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md p-4">
          <div className="card-body">
            <h2 className="card-title text-sm">Documents Shared</h2>
            <p className="text-2xl font-bold">{sharedCount}</p>
            <p className="text-xs text-gray-500">Shared with others</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-base-200 p-4 rounded-lg shadow-md h-[300px]">
          <h2 className="text-lg font-semibold mb-3">Monthly Uploads</h2>
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>

        {/* Employee Attendance Pie Chart */}

        <AttendancePie
          date={currentDate}
          className="bg-base-200 p-4 rounded-lg shadow-md h-[320px]"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-base-200 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
        <ul>
          <li className="flex justify-between items-center py-1 border-b">
            <span>Uploaded "Project Report.pdf"</span>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </li>
          <li className="flex justify-between items-center py-1 border-b">
            <span>Shared "Design Mockup.png" with John Doe</span>
            <span className="text-xs text-gray-500">5 hours ago</span>
          </li>
          <li className="flex justify-between items-center py-1 border-b">
            <span>Deleted "Old Proposal.docx"</span>
            <span className="text-xs text-gray-500">1 day ago</span>
          </li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Link to="/documents">
          <div className="card bg-primary text-primary-content shadow-md p-4 hover:bg-primary-focus cursor-pointer">
            <div className="card-body flex items-center justify-between">
              <h2 className="card-title text-sm">Manage Documents</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5h18M3 12h18m-7.5 4.5H3"
                />
              </svg>
            </div>
          </div>
        </Link>

        <Link to="/upload">
          <div className="card bg-secondary text-secondary-content shadow-md p-4 hover:bg-secondary-focus cursor-pointer">
            <div className="card-body flex items-center justify-between">
              <h2 className="card-title text-sm">Upload New Document</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5H4.5"
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>
      <AttendanceTable />
    </div>
  );
};

export default DashboardPage;
