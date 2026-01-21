import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MakeupMuseLogo from "../assets/images/makeupmuse.jpg"; // Updated to your specific filename
import { useEffect, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("access-token"));

  useEffect(() => {
    const newToken = sessionStorage.getItem("access-token");
    setToken(newToken);
  }, [location]);

  const logout = () => {
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("profilePic");

    setToken(null);
    navigate("/signup");
  };

  const [viewMobile, setViewMobile] = useState(false);
  const toggleViewMobileNav = () => {
    setViewMobile(!viewMobile);
  };

  const navItemStyles =
    "text-nowrap text-sm tracking-widest uppercase hover:text-[#332B2D] transition-colors duration-300 font-bold";

  return (
    <header className="bg-white fixed w-full top-0 z-50 shadow-sm flex justify-between items-center px-12 h-20">
      {/* Logo Link */}
      <NavLink to={token ? "/dashboard" : "/"}>
        <img
          src={MakeupMuseLogo}
          alt="MakeupMuse Logo"
          className="h-16 object-contain" // Adjusted height for a cleaner look
        />
      </NavLink>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 font-inter items-center text-[#A55166]">
        <button className={navItemStyles} onClick={() => navigate("/about")}>
          About Us
        </button>

        {sessionStorage.getItem("role") === "admin" && (
          <button
            className={navItemStyles}
            onClick={() => navigate("/create-post")}
          >
            Create Post
          </button>
        )}

        {token ? (
          <>
            <button
              className={navItemStyles}
              onClick={() => navigate("/saved-products")}
            >
              Saved Products
            </button>
            <button
              className={navItemStyles}
              onClick={() => navigate("/products")}
            >
              Products
            </button>
            <button
              className={navItemStyles}
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button
              className="text-nowrap text-xs font-black border-2 border-[#A55166] px-4 py-2 rounded-full hover:bg-[#A55166] hover:text-white transition-all"
              onClick={logout}
            >
              LOGOUT
            </button>
          </>
        ) : (
          <button
            className="text-nowrap text-xs font-black bg-[#A55166] text-white px-6 py-2 rounded-full hover:bg-[#332B2D] transition-all"
            onClick={() => navigate("/signup")}
          >
            LOGIN
          </button>
        )}
      </nav>

      {/* Mobile Toggle */}
      <button
        onClick={() => toggleViewMobileNav()}
        className="block md:hidden text-3xl text-[#A55166]"
      >
        {viewMobile ? <BiX /> : <BiMenu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          viewMobile ? "flex" : "hidden"
        } md:hidden fixed top-20 left-0 w-full bg-white h-screen z-50 flex-col items-center pt-10 gap-6 font-inter font-bold text-[#A55166]`}
      >
        <button
          onClick={() => {
            setViewMobile(false);
            navigate("/about");
          }}
        >
          About Us
        </button>

        {sessionStorage.getItem("role") === "admin" && (
          <button
            onClick={() => {
              setViewMobile(false);
              navigate("/create-post");
            }}
          >
            Create Post
          </button>
        )}

        {token ? (
          <>
            <button
              onClick={() => {
                setViewMobile(false);
                navigate("/saved-products");
              }}
            >
              Saved Products
            </button>
            <button
              onClick={() => {
                setViewMobile(false);
                navigate("/products");
              }}
            >
              Products
            </button>
            <button
              onClick={() => {
                setViewMobile(false);
                navigate("/profile");
              }}
            >
              Profile
            </button>
            <button
              onClick={() => {
                setViewMobile(false);
                logout();
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setViewMobile(false);
              navigate("/signup");
            }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
