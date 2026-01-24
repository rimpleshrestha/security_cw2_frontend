import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axiosinstance";
import DOMPurify from "dompurify";

const ProfilePage = () => {
  const [name, setName] = useState(
    sessionStorage.getItem("name") !== "undefined"
      ? sessionStorage.getItem("name")
      : "",
  );

  const [profilePic, setProfilePic] = useState(
    sessionStorage.getItem("profilePic") !== "undefined"
      ? sessionStorage.getItem("profilePic")
      : null,
  );

  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Sanitization logic for security
  const sanitize = (value) => {
    if (typeof value !== "string") return "";
    const noBrackets = value.replace(/[<>]/g, "");
    return DOMPurify.sanitize(noBrackets, { ALLOW_TAGS: [] });
  };

  // Complexity rules matching RegisterPage
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return "";
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (strongRegex.test(pwd)) return "Strong";
    if (mediumRegex.test(pwd)) return "Medium";
    return "Weak";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = sanitize(value);
    setNewPassword(sanitizedValue);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleProfilePicChange = async (e) => {
    const formData = new FormData();
    formData.append("pfp", e.target.files[0]);
    try {
      const response = await axiosInstance.put(
        "/update-profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (response.status === 200) {
        toast.success("Profile image updated successfully!");
        sessionStorage.setItem("profilePic", response.data.user.avatar);
        setProfilePic(URL.createObjectURL(e.target.files[0]));
      }
    } catch (error) {
      toast.error("Profile image update failed!");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const sanitizedName = sanitize(name);
    const response = await axiosInstance.put("/update-details", {
      name: sanitizedName,
    });
    sessionStorage.setItem("name", sanitizedName);
    if ([200, 201].includes(response.status)) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Profile update failed!");
    }
  };

  const handleResetPassword = async () => {
    if (passwordStrength !== "Strong") {
      toast.error("Password does not meet security requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    const response = await axiosInstance.put("/change-password", {
      email: sessionStorage.getItem("email"),
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    if ([200, 201].includes(response.status)) {
      toast.success("Password updated successfully!");
      setShowModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength("");
    } else {
      toast.error("Password update failed!");
    }
  };

  const inputStyles =
    "w-full p-4 border border-[#F2E8E4] rounded-2xl text-black bg-[#FCFAFA] focus:outline-none focus:border-[#A55166] transition-all duration-300";
  const labelStyles =
    "block mb-2 text-[#332B2D] text-xs font-bold tracking-widest uppercase ml-1";

  return (
    <div className="bg-[#FAF8F7] min-h-screen w-full flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center mb-12">
        <h1
          className="text-4xl text-[#332B2D] font-light mb-2"
          style={{ fontFamily: "'Julius Sans One', sans-serif" }}
        >
          Your <span className="italic font-bold text-[#A55166]">Profile</span>
        </h1>
        <p className="text-[#7A6B6E] text-sm tracking-widest uppercase font-medium">
          Manage your beauty identity
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-lg border border-[#F2E8E4] p-10 md:p-16 relative overflow-hidden">
        <form onSubmit={handleSave} className="relative z-10">
          <div className="mb-10 flex flex-col items-center">
            <div
              onClick={() => document.getElementById("profilePicInput").click()}
              className="group relative w-36 h-36 cursor-pointer rounded-full bg-[#FAF8F7] border-4 border-white shadow-xl mb-4 overflow-hidden"
            >
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#A55166] text-3xl">
                  +
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                EDIT
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              id="profilePicInput"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>

          <div className="grid gap-6 mb-8">
            <div>
              <label className={labelStyles}>Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputStyles}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className={labelStyles}>Email Address</label>
              <input
                type="text"
                value={sessionStorage.getItem("email")}
                readOnly
                className={`${inputStyles} bg-gray-50 text-gray-400 cursor-not-allowed`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="w-full bg-[#332B2D] text-white py-4 rounded-2xl font-bold tracking-widest text-xs uppercase hover:bg-[#A55166] transition-all"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full py-4 text-[#A55166] text-xs font-bold tracking-widest uppercase hover:bg-[#FDF2F0] rounded-2xl transition-all"
            >
              Security: Change Password
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#332B2D]/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl border border-[#F2E8E4]">
            <h2
              className="text-2xl font-light text-[#332B2D] mb-6"
              style={{ fontFamily: "'Julius Sans One', sans-serif" }}
            >
              Reset <span className="font-bold text-[#A55166]">Password</span>
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className={inputStyles}
                />
                <div className="text-[10px] mt-2 ml-1">
                  <span className="text-gray-500">Strength: </span>
                  <span
                    className={
                      passwordStrength === "Strong"
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {passwordStrength || "Required"}
                  </span>
                </div>
              </div>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(sanitize(e.target.value))}
                className={inputStyles}
              />
            </div>

            {/* SECURITY POLICY CHECKLIST */}
            <div className="mb-8 p-4 bg-[#FCFAFA] rounded-xl border border-[#F2E8E4]">
              <ul className="space-y-2">
                <li className="flex items-center text-[10px] text-[#7A6B6E]">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  Minimum 8 characters
                </li>
                <li className="flex items-center text-[10px] text-[#7A6B6E]">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  One uppercase letter
                </li>
                <li className="flex items-center text-[10px] text-[#7A6B6E]">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mr-2 ${/\d/.test(newPassword) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  One numeric digit
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 text-gray-400 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="flex-1 bg-[#A55166] text-white py-4 rounded-xl font-bold text-xs uppercase hover:bg-[#332B2D] transition-all"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
