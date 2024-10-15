import React, { useState } from "react";
import miaa from "../assets/miaa.png"; // Adjust the path if needed

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex rounded-md">
      {/* Sidebar */}
      <div
<<<<<<< HEAD
        className={`flex flex-col bg-base-300 rounded-md w-64 space-y-6 py-7 px-4 mr-2 h-screen absolute inset-y-0 left-0 transform ${
=======
        className={`bg-base-300 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
>>>>>>> 280fd07ea44cf9dc5c7c2959b4fe093e9708273e
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        {/* Logo */}
        <a className="btn btn-ghost text-xl">
          <img
            className=" w-24 my-auto text-transparent"
            src={miaa}
            alt="MIAA LOGO"
          />
        </a>

        {/* Nav Items */}
        <nav>
          <a
            href="#"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Profile
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Messages
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            Settings
          </a>
        </nav>
<<<<<<< HEAD

        {/* Logout Button */}
        <div className="mt-auto flex justify-center">
          <button className="py-2 rounded-md btn btn-outline btn-primary w-32 hover:bg-primary hover:text-white transition duration-200">
            Logout
          </button>
        </div>
=======
>>>>>>> 280fd07ea44cf9dc5c7c2959b4fe093e9708273e
      </div>
    </div>
  );
};

export default Sidebar;
