import { useState } from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-center font-bold text-2xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={null}>
        <img
          className="h-16 w-16 aspect-square	object-cover rounded-full cursor-pointer mx-auto"
          src={currentUser.avatar}
          alt="profile-pic"
        />

        <input
          className=" border rounded-lg p-2"
          type="text"
          id="username"
          placeholder="username"
        />
        <input
          className="border rounded-lg p-2"
          type="email"
          placeholder="email"
          id="email"
        />
        <input
          className="border rounded-lg p-2"
          type="text"
          placeholder="password"
          id="password"
        />

        <button className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95">
          update
        </button>
      </form>
      <div className="flex justify-between mt-4 p-1">
        <span className="text-red-700 font-medium cursor-pointer">
          Delete Account
        </span>
        <span className="text-red-700 font-medium cursor-pointer">
          Sign Out
        </span>
      </div>
    </div>
  );
}
