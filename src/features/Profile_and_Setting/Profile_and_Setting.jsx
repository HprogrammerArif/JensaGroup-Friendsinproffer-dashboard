import React, { useState, useEffect, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { IoIosSearch, IoMdNotificationsOutline } from "react-icons/io";
import {
  useShowProfileInformationQuery,
  useUpdateProfileInformationMutation,
  useChangePasswordMutation,
} from "../../Redux/feature/baseApi";
import { toast } from "react-toastify";

const ROLE_LABELS = {
  admin: { label: "Admin", color: "bg-purple-100 text-purple-700" },
  mini_admin: { label: "Mini Admin", color: "bg-blue-100 text-blue-700" },
  cleaner: { label: "Cleaner", color: "bg-green-100 text-green-700" },
  maintainer: { label: "Maintainer", color: "bg-orange-100 text-orange-700" },
};

function Profile_and_Setting() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data, isLoading } = useShowProfileInformationQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileInformationMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    city: "",
    state: "",
    full_address: "",
    phone_or_email: "",
    image: null,
  });
  const fileInputRef = useRef(null);

  const profile = data && data.length > 0 ? data[0] : null;

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        city: profile.city || "",
        state: profile.state || "",
        full_address: profile.full_address || "",
        phone_or_email: profile.phone_or_email || "",
        image: null,
      });
    }
  }, [profile]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    const fd = new FormData();
    if (formData.full_name) fd.append("full_name", formData.full_name);
    if (formData.email) fd.append("email", formData.email);
    if (formData.city) fd.append("city", formData.city);
    if (formData.state) fd.append("state", formData.state);
    if (formData.full_address) fd.append("full_address", formData.full_address);
    if (formData.image) fd.append("avatar", formData.image);

    try {
      await updateProfile({ id: profile.id, data: fd }).unwrap();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePasswordClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleConfirmPassword = async () => {
    if (!oldPassword) {
      toast.error("Please enter your current password!");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      handleCloseModal();
    } catch (error) {
      const msg =
        error?.data?.old_password?.[0] ||
        error?.data?.new_password?.[0] ||
        error?.data?.message ||
        error?.data?.detail ||
        "Failed to change password";
      toast.error(msg);
    }
  };

  const roleInfo = ROLE_LABELS[profile?.role] || null;

  return (
    <div className="bg-[#F5F7FA] min-h-screen">
      {/* ── Top Bar ── */}
      <div className=" px-10 py-5 flex justify-between items-center ">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">
            Profile &amp; Settings
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
            <input
              type="text"
              placeholder="Search"
              className="border-none bg-transparent outline-none text-sm w-40"
            />
            <button className="bg-transparent border-none cursor-pointer text-base">
              <IoIosSearch size={20} />
            </button>
          </div>
          <button className="bg-transparent border-none cursor-pointer text-lg">
            <IoMdNotificationsOutline size={26} />
          </button>
          <div className="flex items-center gap-2">
            {profile?.avatar ? (
              <img
                src={
                  profile.avatar.startsWith("http")
                    ? profile.avatar
                    : `${import.meta.env.VITE_BASE_URL}${profile.avatar.replace(/^\//, "")}`
                }
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex flex-col">
              <p className="m-0 text-xs text-gray-900 font-medium">
                {profile?.full_name || "User Name"}
              </p>
              <p className="m-0 text-xs text-gray-600">
                {profile?.phone_or_email || profile?.email || "No contact"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="px-10 py-10 text-center">
          <p className="text-gray-500">Loading profile…</p>
        </div>
      ) : !profile ? (
        <div className="px-10 py-10 text-center">
          <p className="text-gray-500 text-lg">No data available</p>
        </div>
      ) : (
        <>
          {/* ── Avatar ── */}
          <div className="px-10 py-10 text-center relative w-max mx-auto">
            {profile?.avatar || formData.image ? (
              <img
                src={
                  formData.image
                    ? URL.createObjectURL(formData.image)
                    : profile.avatar.startsWith("http")
                    ? profile.avatar
                    : `${import.meta.env.VITE_BASE_URL}${profile.avatar.replace(/^\//, "")}`
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl mx-auto border-4 border-gray-200 font-bold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            {/* Role Badge */}
            {roleInfo && (
              <div className="mt-3 flex justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${roleInfo.color}`}
                >
                  {roleInfo.label}
                </span>
              </div>
            )}

            {isEditing && (
              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded cursor-pointer border border-blue-200 hover:bg-blue-100"
                >
                  Change Photo
                </button>
              </div>
            )}
          </div>

          {/* ── Personal Information ── */}
          <div className="px-10 py-8 mt-5">
            <div className="flex items-center mb-5">
              <h2 className="text-[18px] font-semibold text-gray-900 m-0">
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="border-none ml-10 bg-[#DEEAFC] text-blue-600 cursor-pointer text-[15px] font-medium flex items-center gap-1 px-4 py-2 hover:bg-blue-50 rounded"
                >
                  <CiEdit />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2 ml-10">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="border-none bg-blue-600 text-white cursor-pointer text-[15px] font-medium flex items-center gap-1 px-4 py-2 hover:bg-blue-700 rounded disabled:opacity-50"
                  >
                    {isUpdating ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (profile) {
                        setFormData({
                          full_name: profile.full_name || "",
                          email: profile.email || "",
                          city: profile.city || "",
                          state: profile.state || "",
                          full_address: profile.full_address || "",
                          phone_or_email: profile.phone_or_email || "",
                          image: null,
                        });
                      }
                    }}
                    className="border border-gray-300 bg-white text-gray-700 cursor-pointer text-[15px] font-medium flex items-center gap-1 px-4 py-2 hover:bg-gray-50 rounded"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 mb-5 max-w-2xl sm:grid-cols-2">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-500 font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={isEditing ? formData.full_name : profile?.full_name || ""}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={!isEditing}
                  className={`px-3 py-2 border rounded outline-none text-sm ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-600 bg-white"
                      : "border-transparent bg-gray-100 text-gray-600"
                  }`}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-500 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={isEditing ? formData.email : profile?.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className={`px-3 py-2 border rounded outline-none text-sm ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-600 bg-white"
                      : "border-transparent bg-gray-100 text-gray-600"
                  }`}
                />
              </div>

              {/* Phone / Email login credential */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-500 font-medium">Phone / Login</label>
                <input
                  type="text"
                  value={profile?.phone_or_email || "—"}
                  disabled
                  className="px-3 py-2 border-transparent bg-gray-100 text-gray-600 border rounded outline-none text-sm"
                />
              </div>

              {/* Role (read-only) */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-500 font-medium">Role</label>
                <div className="px-3 py-2 border-transparent bg-gray-100 rounded text-sm flex items-center">
                  {roleInfo ? (
                    <span className={`px-3 py-0.5 rounded-full text-xs font-semibold ${roleInfo.color}`}>
                      {roleInfo.label}
                    </span>
                  ) : (
                    <span className="text-gray-600">{profile?.role || "—"}</span>
                  )}
                </div>
              </div>

              {/* City */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-500 font-medium">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={isEditing ? formData.city : profile?.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                  className={`px-3 py-2 border rounded outline-none text-sm ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-600 bg-white"
                      : "border-transparent bg-gray-100 text-gray-600"
                  }`}
                />
              </div>

              {/* State */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] text-gray-500 font-medium">State</label>
                <input
                  type="text"
                  placeholder="State / Province"
                  value={isEditing ? formData.state : profile?.state || ""}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  disabled={!isEditing}
                  className={`px-3 py-2 border rounded outline-none text-sm ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-600 bg-white"
                      : "border-transparent bg-gray-100 text-gray-600"
                  }`}
                />
              </div>

              {/* Full Address */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-[14px] text-gray-500 font-medium">Full Address</label>
                <textarea
                  rows={3}
                  placeholder="Full address"
                  value={isEditing ? formData.full_address : profile?.full_address || ""}
                  onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                  disabled={!isEditing}
                  className={`px-3 py-2 border rounded outline-none text-sm resize-none ${
                    isEditing
                      ? "border-gray-300 focus:border-blue-600 bg-white"
                      : "border-transparent bg-gray-100 text-gray-600"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ── Security ── */}
          <div className="px-10 py-8 mt-5">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Security</h2>
            <div className="flex gap-4 items-center">
              <div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value="••••••••"
                  readOnly
                  className="px-3 py-2 border border-gray-200 rounded bg-gray-50 text-sm"
                />
              </div>
              <button
                onClick={handleChangePasswordClick}
                className="px-5 py-2 bg-[#DEEAFC] text-blue-600 border-none rounded font-medium text-sm cursor-pointer hover:bg-blue-100 whitespace-nowrap"
              >
                Change password
              </button>
            </div>
          </div>

          {/* ── Change Password Modal ── */}
          {isModalOpen && (
            <div
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <div
                className="bg-white rounded-lg w-full max-w-md shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-5 py-5 border-b border-gray-200 flex justify-between items-center">
                  <button
                    onClick={handleCloseModal}
                    className="bg-transparent border-none text-gray-900 cursor-pointer text-base font-medium flex items-center gap-1 p-0 hover:text-blue-600"
                  >
                    ← Back
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900 m-0">
                    Change Password
                  </h2>
                  <div className="w-10"></div>
                </div>

                <div className="px-5 py-8">
                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-sm text-gray-700 font-medium">
                      Current password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-blue-600 text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-sm text-gray-700 font-medium">
                      New password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-blue-600 text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mb-5">
                    <label className="text-sm text-gray-700 font-medium">
                      Confirm new password
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded outline-none focus:border-blue-600 text-sm"
                    />
                  </div>

                  <button
                    onClick={handleConfirmPassword}
                    disabled={isChangingPassword}
                    className="w-full py-3 bg-blue-600 text-white border-none rounded font-semibold text-base cursor-pointer hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
                  >
                    {isChangingPassword ? "Changing…" : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profile_and_Setting;
