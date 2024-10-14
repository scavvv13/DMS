import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import miaa from "../assets/miaa.png";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {};

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <img className=" w-96" src={miaa} alt="miaa logo" />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                className="input input-bordered"
                onChange={(e) => {
                  setUser(e.target.value);
                  console.log(email);
                }}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="input input-bordered"
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log(email);
                }}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                onChange={(e) => {
                  setPassword(e.target.value);
                  console.log(password);
                }}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Re-type Password"
                className="input input-bordered"
                onChange={(e) => {
                  setPassword(e.target.value);
                  console.log(password);
                }}
                required
              />
            </div>
            <div className="form-control mt-6">
              <button
                className="btn btn-primary"
                onClick={handleRegister}
                type="Submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
