import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <>
<<<<<<< HEAD
      <div className=" h-screen flex flex-row m-3">
        <Sidebar />
=======
      <div className="m-2 flex flex-row">
        <div className="mr-2 bg-base-300 rounded-md max-h-[600px]">
          <Sidebar />
        </div>
>>>>>>> 280fd07ea44cf9dc5c7c2959b4fe093e9708273e

        <div className="flex-1 flex flex-col">
          <div className=" mb-2 ">
            <Header />
          </div>
<<<<<<< HEAD
          <div className=" p-3 bg-base-100 h-screen rounded-md container overflow-y-scroll no-scrollbar ">
=======
          <div className="p-3 bg-base-300 max-h-[450px] rounded-md container overflow-y-scroll no-scrollbar flex-1">
>>>>>>> 280fd07ea44cf9dc5c7c2959b4fe093e9708273e
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
