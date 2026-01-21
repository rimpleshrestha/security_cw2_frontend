import { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../api/axiosinstance";

const ProfilePage = () => {
  const [name, setName] = useState(
    sessionStorage.getItem("name") !== "undefined"
      ? sessionStorage.getItem("name")
      : ""
  );

  const [profilePic, setProfilePic] = useState(
    sessionStorage.getItem("profilePic") !== "undefined"
      ? sessionStorage.getItem("profilePic")
      : null
  );
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfilePicChange = async (e) => {
    const formData = new FormData();
    formData.append("pfp", e.target.files[0]);
    try {
      const response = await axiosInstance.put(
        "/update-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Profile image updated successfully!");
      } else {
        toast.error("Profile image update failed!");
      }
      sessionStorage.setItem("profilePic", response.data.user.avatar);
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    } catch (error) {
      console.error("Profile image update failed", error);
      toast.error("Profile image update failed!");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log({ name });
    const response = await axiosInstance.put("/update-details", { name });
    sessionStorage.setItem("name", name);
    if ([200, 201].includes(response.status)) {
      return toast.success("Profile updated successfully!");
    } else {
      return toast.error("Profile update failed!");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    console.log({ name });
    const response = await axiosInstance.put("/change-password", {
      email: sessionStorage.getItem("email"),
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
    console.log(response);
    if ([200, 201].includes(response.status)) {
      toast.success("Password updated successfully!");
    } else {
      toast.error("Password update failed!");
    }
    setShowModal(false);
    setNewPassword("");
    setConfirmPassword("");
    // Add password reset API logic here
  };

  return (
    <div className="bg-gradient-to-b min-h-screen w-full from-[#fad1e3] to-[#ff65aa]/10 flex flex-col items-center justify-center font-kaisei">
      <h1
        className="mb-8 text-3xl font-bold text-[#A55166]"
        style={{ fontFamily: "'Julius Sans One', sans-serif" }}
      >
        Your Profile
      </h1>

      <form
        onSubmit={handleSave}
        className="min-w-[600px] max-md:min-w-[80%] p-8 rounded-2xl shadow-lg bg-opacity-25 backdrop-blur-md border bg-[#A55166]"
      >
        {/* Profile Picture */}
        <div className="mb-6 flex flex-col items-center">
          <div
            onClick={() => {
              document.getElementById("profilePicInput").click();
            }}
            className="w-32 h-32 cursor-pointer rounded-full bg-white shadow-md mb-3 overflow-hidden"
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#A55166] font-bold text-xl">
                +
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            id="profilePicInput"
            onChange={handleProfilePicChange}
            className="text-sm text-white hidden font-inter"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Name:
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 shadow-md rounded-xl bg-white focus:outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <label className="block mb-1 text-[#A55166] font-bold font-inter">
            Email:
          </label>
          <input
            type="text"
            value={sessionStorage.getItem("email")}
            readOnly
            className="w-full p-3 shadow-md rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Forgot Password Button */}
        <div className="mb-6 text-left">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-sm font-inter font-semibold text-pink-300 bg-white px-4 py-2 rounded-full shadow-md"
          >
            Forgot Password?
          </button>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-[#A55166] text-white py-3 rounded-xl font-bold font-inter hover:bg-[#914257] transition"
        >
          Save Changes
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-lg relative">
            <h2 className="text-xl font-bold text-[#A55166] mb-4">
              Reset Password
            </h2>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-3 p-3 border rounded-xl focus:outline-none"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 p-3 border rounded-xl focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-[#A55166] font-semibold px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="bg-[#A55166] text-white font-semibold px-4 py-2 rounded-xl"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
