import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <>
      <div className=" h-[520px] flex flex-row m-3 pb-5 ">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Header takes up its natural height */}
          <div className=" mb-2 ">
            <Header />
          </div>
          <div className=" ml-2 p-3 bg-base-100 h-screen rounded-md container overflow-y-scroll no-scrollbar ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
