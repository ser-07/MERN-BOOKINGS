import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("CurrentUser", currentUser);
  return (
    <header className="bg-slate-200 flex justify-between items-center  mx-auto p-3">
      <Link to="/">
        <h1 className="font-medium text-2xl text-lime-400">BOOKINGS</h1>
      </Link>
      <form className="bg-slate-100 p-3 rounded-lg flex items-center">
        <input
          type="text"
          placeholder="search.."
          className="bg-transparent outline-none w-24 sm:w-64"
        />
        <FaSearch />
      </form>
      <ul className="flex p-2 gap-2">
        <Link to="/">
          <li className="hidden sm:inline px-2 text-slate-600 hover:text-blue-800 hover:font-bold">
            Home
          </li>
        </Link>
        <Link to="/about">
          <li className="hidden sm:inline px-2 text-slate-600 hover:scale-125 hover:px-2.5">
            About
          </li>
        </Link>
        <Link to="/profile">
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt="profile-pic"
              className="rounded-full h-7 w-7 object-cover"
            />
          ) : (
            <li className="hidden sm:inline px-2 text-slate-600 hover:text-red-500">
              Sign In
            </li>
          )}
        </Link>
      </ul>
    </header>
  );
}
