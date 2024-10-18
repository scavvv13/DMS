import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="h-[520px] flex flex-row m-2 ml-3 mt-3">
      <Sidebar />
      <div className="flex-1 flex flex-col mr-2">
        <Header />
        <div className="bg-base h-[500px] rounded-md container overflow-y-scroll no-scrollbar pl-2 mt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
