import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Search state
  const location = useLocation();

  // Determine which page is active and pass relevant data to the outlet
  const isUsersPage = location.pathname.includes("UsersPage");
  const isDocumentsPage = location.pathname.includes("DocumentsPage");

  return (
    <div className="h-[520px] flex flex-row m-2 ml-3 mt-3">
      <Sidebar />
      <div className="flex-1 flex flex-col mr-2">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="bg-base h-[500px] rounded-md container overflow-y-scroll no-scrollbar pl-2 mt-10">
          <Outlet context={{ searchTerm, isUsersPage, isDocumentsPage }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
