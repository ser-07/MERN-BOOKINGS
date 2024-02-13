import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  signInErrorTimeout,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice.js";

import { UseDispatch } from "react-redux";

export default function Profile() {
  const { currentUser, isLoading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [fileUploadperc, setFileUploadperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  console.log(file);
  // console.log(fileUploadperc);
  // console.log(formData);
  // use useEffect hook to upload the file to firebase if file exists:
  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    //Include a unique number to filename to avoid error while uploading image with same name
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log(`${progress}% completed`);
        setFileUploadperc(progress.toFixed(0));
      },

      (error) => setFileUploadError(true),

      //Get the image url from firebase and save it in mongo
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    //make updatesuccess as false so that if user starts typing again, the success from prev request is hidden
    setUpdateSuccess(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart);
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/user/update/${currentUser._id}`,
        {
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
        }
      );

      console.log(res);
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        // setError(data.message);
        // setIsLoading(false);
        // setTimeout(() => setError(null), 5000);
        dispatch(updateUserFailure(data.message));
        setTimeout(() => dispatch(signInErrorTimeout()), 5000);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          mode: "cors",
          cache: "no-cache",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
      const data = res.json();
      console.log(data);

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        setTimeout(() => dispatch(signInErrorTimeout()), 5000);
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-center font-bold text-2xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          accept="image/*"
        />
        <img
          className="h-16 w-16 aspect-square	object-cover rounded-full cursor-pointer mx-auto"
          src={formData.avatar || currentUser.avatar}
          alt="profile-pic"
          onClick={() => fileRef.current.click()}
        />
        <p className="self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Image upload error (max size - 4MB)
            </span>
          ) : fileUploadperc > 0 && fileUploadperc < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileUploadperc}%`}</span>
          ) : fileUploadperc == 100 ? (
            <span className="text-green-700">Upload successful</span>
          ) : (
            <span></span>
          )}
        </p>

        <input
          className=" border rounded-lg p-2"
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          className="border rounded-lg p-2"
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          className="border rounded-lg p-2"
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={isLoading}
          className="bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95"
        >
          {isLoading ? "Loading" : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-4 p-1">
        <span
          onClick={handleUserDelete}
          className="text-red-700 font-medium cursor-pointer"
        >
          Delete Account
        </span>
        <span className="text-red-700 font-medium cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {updateSuccess && (
        <p className="text-green-500 text-center">update successful</p>
      )}
    </div>
  );
}
