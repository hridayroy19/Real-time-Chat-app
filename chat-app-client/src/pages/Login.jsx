import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [currState, setCurrState] = useState("sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmited, setIsDataSubmited] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmiteHandeler = (e) => {
    e.preventDefault();

    if (currState === "sign up" && !isDataSubmited) {
      setIsDataSubmited(true);
      return;
    }
    login(currState === "sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* **** left site********* */}
      <img
        src="https://i.ibb.co/yF5Yt2zN/unnamed-removebg-preview.png"
        alt=""
        className="lg:w-[420px] md:w-[280px] w-full px-5 "
      />

      {/* right site ******* */}

      <form
        onSubmit={onSubmiteHandeler}
        action=""
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmited && (
            <img
              onClick={() => setIsDataSubmited(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {currState === "sign up" && !isDataSubmited && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none "
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmited && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter Your Email"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:right-3 focus:ring-indigo-500"
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter Your Password"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:right-3 focus:ring-indigo-500"
            />
          </>
        )}

        {currState === "sign up" && isDataSubmited && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:right-3 focus:ring-indigo-500"
            placeholder="provied shot bio"
            required
          ></textarea>
        )}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex justify-between gap-3">
          <input type="checkbox" />
          <p> Agree to the terms of use & privacy policy</p>
        </div>
        {/* navigate */}
        <div className=" flex flex-col gap-2">
          {currState === "sign up" ? (
            <p className=" text-sm text-gray-600 ">
              Already have an acount?
              <span
                onClick={() => {
                  setCurrState("login");
                  setIsDataSubmited(false);
                }}
                className=" cursor-pointer font-medium text-violet-400"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600 ">
              Create an account
              <span
                onClick={() => setCurrState("sign up")}
                className="cursor-pointer font-medium text-violet-400"
              >
                click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
