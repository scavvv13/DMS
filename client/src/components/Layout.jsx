import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <>
      <div className="m-2 flex flex-row">
        <div className="mr-2 bg-base-300 rounded-md max-h-[600px]">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <div className=" mb-2 ">
            <Header />
          </div>
          <div className="p-3 bg-base-300 max-h-[450px] rounded-md container overflow-y-scroll no-scrollbar flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
