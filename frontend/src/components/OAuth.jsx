import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

/*
Type is added as buttonn since this button is also inside the form, the default type of sumbit will trigger a form OnSubmit

*/

function OAuth() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/auth/google`,
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
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );
      const data = res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white uppercase rounded-lg p-2 mb-2 hover:opacity-90"
    >
      OAuth
    </button>
  );
}

export default OAuth;
