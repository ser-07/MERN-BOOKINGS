import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  signInErrorTimeout,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const { isLoading, error } = useSelector((state) => {
    console.log(state);
    return state.user;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFormDataChange = (e) => {
    // console.log(e.target);
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    console.log("body", JSON.stringify(formData));
    // console.log(process.env);
    e.preventDefault();
    // setIsLoading(true);
    dispatch(signInStart());
    // console.log(`${process.env.REACT_APP_BACKEND_URL}api/auth/signup`);
    //add data to db:
    const url = `${process.env.REACT_APP_BACKEND_URL}api/auth/signin`;
    try {
      const res = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        // referrer: "no-referrer",
        body: JSON.stringify(formData),
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        // setError(data.message);
        // setIsLoading(false);
        // setTimeout(() => setError(null), 5000);
        dispatch(signInFailure(data.message));
        setTimeout(() => dispatch(signInErrorTimeout()), 5000);
        return;
      }
      dispatch(signInSuccess(data));
      // setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.log("error second", error);
      // setIsLoading(false);
      // setError(error);
      // setTimeout(() => setError(null), 5000);
      dispatch(signInFailure(error));
      setTimeout(() => dispatch(signInErrorTimeout()), 5000);

      console.log(error);
    }
  };

  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className="text-center	text-2xl font-bold my-6">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="email"
          placeholder="email"
          id="email"
          required
          className="my-4 border rounded-lg p-2"
          onChange={handleFormDataChange}
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          required
          className="my-4 border rounded-lg p-2"
          onChange={handleFormDataChange}
        />
        <button
          disabled={isLoading}
          className="rounded-lg uppercase text-white bg-slate-700 min-w-full p-2 my-2 hover:opacity-90	"
        >
          {isLoading ? "Loading" : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2">
        <p>Do not have an account?</p>
        <Link to={"/signUp"}>
          <span className="text-blue-600">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
