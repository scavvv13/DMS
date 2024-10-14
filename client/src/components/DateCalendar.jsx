import React from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function CalendarWidget() {
  return (
    <div className="bg-base-200 shadow-lg rounded-3xl w-80 mx-auto">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          defaultValue={dayjs()}
          sx={{
            "& .MuiTypography-root": {
              fontSize: "1.2rem", // Large font for month/year like iPhone
              fontWeight: "500",
              color: "#000", // Dark text for header
            },
            "& .MuiPickersDay-root": {
              width: 36, // Circular day buttons, larger like iPhone
              height: 36,
              fontSize: "1rem",
              color: "#333", // Dark text for day numbers
              borderRadius: "50%", // Round shape for days
              "&.Mui-selected": {
                backgroundColor: "#007aff", // iPhone blue for selected day
                color: "#fff", // White text on selected day
              },
              "&:hover": {
                backgroundColor: "#f0f0f0", // Light hover effect
              },
            },
            "& .MuiPickersCalendarHeader-root": {
              marginBottom: "0.5rem", // Spacing between header and days
            },
            "& .MuiPickersCalendarHeader-label": {
              fontSize: "1.2rem",
              fontWeight: "600", // Bold and larger font for month/year
            },
            "& .MuiPickersCalendarHeader-switchViewButton": {
              color: "#007aff", // iPhone blue for arrows
            },
            "& .MuiPickersArrowSwitcher-root": {
              "& button": {
                color: "#007aff", // Arrow button color to match iPhone style
                "&:hover": {
                  backgroundColor: "#f0f0f0", // Subtle hover effect for arrows
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
