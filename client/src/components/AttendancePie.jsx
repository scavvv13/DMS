import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axiosInstance from "../utils/axiosInstance"; // Adjust the import based on your axios instance file path

const AttendancePie = ({ date }) => {
  const [attendanceData, setAttendanceData] = useState({
    onTime: 0,
    late: 0,
    undertime: 0,
    overtime: 0,
    absent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const response = await axiosInstance.get(`/attendance`, {
          params: { date }, // Pass the date as a query parameter
        });
        const records = response.data;

        // Initialize stats
        const stats = {
          onTime: 0,
          late: 0,
          undertime: 0,
          overtime: 0,
          absent: 0,
        };

        // Calculate attendance stats
        records.forEach((record) => {
          if (record.status === "On Time") {
            stats.onTime++;
          } else if (record.status === "Late") {
            stats.late++;
          } else if (record.status === "Undertime") {
            stats.undertime++;
          } else if (record.status === "Overtime") {
            stats.overtime++;
          } else if (record.status === "Absent") {
            stats.absent++;
          }
        });

        setAttendanceData(stats);
      } catch (error) {
        console.error(
          "Failed to fetch attendance records:",
          error.response ? error.response.data : error
        );
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRecords();
  }, [date]);

  // Consolidate loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Data for the Pie chart
  const pieData = {
    labels: ["On Time", "Late", "Undertime", "Overtime", "Absent"],
    datasets: [
      {
        label: "Attendance Performance",
        data: [
          attendanceData.onTime,
          attendanceData.late,
          attendanceData.undertime,
          attendanceData.overtime,
          attendanceData.absent,
        ],
        backgroundColor: [
          "#4CAF50",
          "#FFC107",
          "#FF9800",
          "#FF5722",
          "#F44336",
        ],
        hoverBackgroundColor: [
          "#4CAF50",
          "#FFC107",
          "#FF9800",
          "#FF5722",
          "#F44336",
        ],
      },
    ],
  };

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md h-[320px]">
      <h2 className="text-lg font-semibold mb-3">
        Employee Attendance Performance
      </h2>
      <div className="relative h-[240px]">
        <Pie
          data={pieData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 10,
                  font: {
                    size: 10,
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AttendancePie;
