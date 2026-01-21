import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SkinmuseLogo from "../assets/images/skinMuseLogo.png";
import { useEffect, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem("access-token"));

  useEffect(() => {
    const newToken = sessionStorage.getItem("access-token");
    setToken(newToken);
  }, [location]); // triggers when route changes — especially after login

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
  return (
    <header
      className="bg-white fixed w-full top-0 z-50
     shadow flex justify-between items-center px-12"
    >
      <NavLink to={token ? "/dashboard" : "/"}>
        <img
          src={SkinmuseLogo}
          alt="SkinMuse Logo"
          className="h-20 object-contain"
        />
      </NavLink>
      <nav className="flex gap-3 max-md:hidden font-inter items-center font-bold text-[#A55166]">
        {/* About Us button navigates to /about */}
        <button className="text-nowrap" onClick={() => navigate("/about")}>
          About Us
        </button>

        {["admin"].includes(sessionStorage.getItem("role")) && (
          <button
            className="text-nowrap"
            onClick={() => navigate("/create-post")}
          >
            Create Post
          </button>
        )}

        {token ? (
          <>
            <button
              className="text-nowrap"
              onClick={() => navigate("/saved-products")}
            >
              Saved Products
            </button>
            <button
              className="text-nowrap"
              onClick={() => navigate("/products")}
            >
              Products
            </button>
            <button
              className="text-nowrap"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
            <button className="text-nowrap" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="text-nowrap" onClick={() => navigate("/signup")}>
              Login
            </button>
          </>
        )}
      </nav>

      <button onClick={() => toggleViewMobileNav()} className="block md:hidden">
        {viewMobile ? <BiX /> : <BiMenu />}
      </button>
      <div className={`${viewMobile ? "block" : "hidden"} `}>
        <nav className="hidden   gap-3 max-md:flex flex-col fixed top-20  left-1/2 z-50 bg-white h-[100%] pt-20 w-screen -translate-x-1/2 font-inter items-center font-bold text-[#A55166]">
          {/* About Us button navigates to /about */}
          <button
            className="text-nowrap"
            onClick={() => {
              setViewMobile(false);
              navigate("/about");
            }}
          >
            About Us
          </button>

          {["admin"].includes(sessionStorage.getItem("role")) && (
            <button
              className="text-nowrap"
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
                className="text-nowrap"
                onClick={() => {
                  setViewMobile(false);
                  navigate("/saved-products");
                }}
              >
                Saved Products
              </button>
              <button
                className="text-nowrap"
                onClick={() => {
                  setViewMobile(false);
                  navigate("/products");
                }}
              >
                Products
              </button>
              <button
                className="text-nowrap"
                onClick={() => {
                  setViewMobile(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>
              <button
                className="text-nowrap"
                onClick={() => {
                  setViewMobile(false);
                  logout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="text-nowrap"
                onClick={() => {
                  setViewMobile(false);
                  navigate("/signup");
                }}
              >
                Login
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
