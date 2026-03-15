import { useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { User, Lock, Camera } from "lucide-react";

export default function Settings() {
  const { user, uploadProfileImage, checkAuth } = useUserStore();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleProfileChange = (e) =>
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePasswordChange = (e) =>
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      await uploadProfileImage(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name || !profile.email) {
      toast.error("Name and email are required");
      return;
    }
    setSavingProfile(true);
    try {
      await api.put("/auth/profile", {
        name: profile.name,
        email: profile.email,
      });
      await checkAuth();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to update profile",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setSavingPassword(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.error?.message || "Failed to change password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="font-display text-2xl text-text-primary">Settings</h1>

      {/* Profile Image */}
      <div className="flex items-center gap-6 rounded-lg border border-border bg-surface p-6">
        <div className="relative">
          <img
            src={user?.image}
            alt={user?.name}
            className="h-20 w-20 rounded-full object-cover border-2 border-border"
          />
          <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-1.5 text-white shadow-md hover:bg-primary/90">
            <Camera size={14} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
          </label>
        </div>
        <div>
          <p className="font-display text-lg text-text-primary">{user?.name}</p>
          <p className="text-body-sm text-text-muted">{user?.email}</p>
          <p className="mt-1 rounded-pill bg-accent-soft px-2 py-0.5 text-[10px] font-mono text-primary inline-block">
            {user?.role}
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <form
        onSubmit={saveProfile}
        className="space-y-4 rounded-lg border border-border p-6"
      >
        <div className="flex items-center gap-2 text-text-primary">
          <User size={18} />
          <h2 className="font-display text-lg">Profile Information</h2>
        </div>
        <Input
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleProfileChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={profile.email}
          onChange={handleProfileChange}
          required
        />
        <Button type="submit" disabled={savingProfile}>
          {savingProfile ? "Saving..." : "Save Profile"}
        </Button>
      </form>

      {/* Change Password */}
      <form
        onSubmit={savePassword}
        className="space-y-4 rounded-lg border border-border p-6"
      >
        <div className="flex items-center gap-2 text-text-primary">
          <Lock size={18} />
          <h2 className="font-display text-lg">Change Password</h2>
        </div>
        <Input
          label="Current Password"
          name="currentPassword"
          type="password"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
          required
        />
        <Input
          label="New Password"
          name="newPassword"
          type="password"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          required
        />
        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={passwords.confirmPassword}
          onChange={handlePasswordChange}
          required
        />
        <Button type="submit" disabled={savingPassword}>
          {savingPassword ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}
