import './Settings.css';
import { useState, useEffect, useRef } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { getAdminProfile, updateAdminProfile, updateAdminProfilePicture, removeAdminProfilePicture, getPresignedUrl, changeAdminPassword, getPlatformDetails, updatePlatformDetails } from "../../lib/admin";

const CDN_ENDPOINT = import.meta.env.VITE_AWS_CDN_ENDPOINT || "https://bauctionprod.s3.ap-south-1.amazonaws.com";
const BUCKET_PREFIX = import.meta.env.VITE_AWS_BUCKET_PREFIX || "ba";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const [admin, setAdmin] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [platformName, setPlatformName] = useState("");
  const [platformTagline, setPlatformTagline] = useState("");
  const [platformAbout, setPlatformAbout] = useState("");
  const [platformEmails, setPlatformEmails] = useState(["", ""]);
  const [platformPhones, setPlatformPhones] = useState(["", ""]);
  const [platformAddress, setPlatformAddress] = useState("");
  const [platformUpdating, setPlatformUpdating] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getAdminProfile()
      .then((res) => {
        setAdmin(res.data);
        setAdminName(res.data?.name || "");
        setPhone(res.data?.phone || "");
      })
      .catch((err) => console.error("Failed to load profile", err));

    getPlatformDetails()
      .then((res) => {
        const p = res.data;
        setPlatformName(p.name || "");
        setPlatformTagline(p.tagline || "");
        setPlatformAbout(p.about || "");
        setPlatformEmails([p.email?.[0] || "", p.email?.[1] || ""]);
        setPlatformPhones([p.phone?.[0] || "", p.phone?.[1] || ""]);
        setPlatformAddress(p.address || "");
      })
      .catch((err) => console.error("Failed to load platform details", err));
  }, []);

  const getInitials = () => {
    if (!admin?.name) return "SA";
    const parts = admin.name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getProfilePicUrl = () => {
    if (!admin?.profilePicture) return null;
    return `${CDN_ENDPOINT}/${BUCKET_PREFIX}/${admin.profilePicture}`;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPEG, PNG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const key = `admin-profile/${admin.id}-${Date.now()}.${ext}`;

      const { data } = await getPresignedUrl(key);
      await fetch(data.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      const res = await updateAdminProfilePicture(data.key);
      setAdmin(res.data);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    if (!admin?.profilePicture) return;
    try {
      const res = await removeAdminProfilePicture();
      setAdmin(res.data);
    } catch (err) {
      console.error("Remove failed", err);
      alert("Failed to remove profile picture.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6 || newPassword.length > 12) {
      alert("Password must be between 6 and 12 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    setPasswordUpdating(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      alert("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password.";
      alert(msg);
    } finally {
      setPasswordUpdating(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!adminName.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    setProfileUpdating(true);
    try {
      const res = await updateAdminProfile({ name: adminName.trim(), phone: phone.trim() });
      setAdmin(res.data);
      alert("Profile updated successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setProfileUpdating(false);
    }
  };

  const handlePlatformUpdate = async () => {
    if (!platformName.trim()) { alert("Platform Name is required."); return; }
    if (!platformTagline.trim()) { alert("Tagline is required."); return; }
    if (!platformAbout.trim()) { alert("About Platform is required."); return; }
    if (!platformEmails[0].trim()) { alert("At least one Contact Email is required."); return; }
    if (!platformPhones[0].trim()) { alert("At least one Support Phone is required."); return; }
    if (!platformAddress.trim()) { alert("Address is required."); return; }
    setPlatformUpdating(true);
    try {
      const res = await updatePlatformDetails({
        name: platformName,
        tagline: platformTagline,
        about: platformAbout,
        email: platformEmails.filter(Boolean),
        phone: platformPhones.filter(Boolean),
        address: platformAddress,
      });
      const p = res.data;
      setPlatformName(p.name || "");
      setPlatformTagline(p.tagline || "");
      setPlatformAbout(p.about || "");
      setPlatformEmails([p.email?.[0] || "", p.email?.[1] || ""]);
      setPlatformPhones([p.phone?.[0] || "", p.phone?.[1] || ""]);
      setPlatformAddress(p.address || "");
      alert("Platform details updated successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update platform details.");
    } finally {
      setPlatformUpdating(false);
    }
  };

  const profilePicUrl = getProfilePicUrl();

  return <div className='settingscontainer'>
    <div className="enquiries-header">
        <h1>Settings</h1>
        <p>Platform and profile settings</p>
    </div>
    <ul className='activitycat1'>
        <li className={`catmenu4 ${activeTab === "platform" ? "active-allenquiries" : ""}`}onClick={() => setActiveTab("platform")}>Platform</li>
        <li className={`catmenu4 ${activeTab === "profile" ? "active-chatsystem" : ""}`}onClick={() => setActiveTab("profile")}>Profile</li>
        <li className={`catmenu4 ${activeTab === "security" ? "active-formsubmissions" : ""}`}onClick={() => setActiveTab("security")}>Security</li>
    </ul>
    {activeTab === "platform" && (<div>
      <div className='platforminformation'>
        <div className='platforminfoheader'>
          <h2>Platform Information</h2>
          <p>Update your platform details and branding</p>
          <div className='platforminfoinput'>
            <h3>Platform Name <span style={{ color: 'red' }}>*</span></h3>
            <input type='text' placeholder='Billionaire Auction' value={platformName} onChange={(e) => setPlatformName(e.target.value)}></input>
          </div>
          <div className='platforminfoinput'>
            <h3>Tagline <span style={{ color: 'red' }}>*</span></h3>
            <input type='text' placeholder='Luxury Items for the Elite' value={platformTagline} onChange={(e) => setPlatformTagline(e.target.value)}></input>
          </div>
          <div className='platforminfoinput1'>
            <h3>About Platform <span style={{ color: 'red' }}>*</span></h3>
            <textarea className='platformaboutinfo' value={platformAbout} onChange={(e) => setPlatformAbout(e.target.value)} rows={3}></textarea>
          </div>
          <div className='platformcontactinfo'>
          <div className='platforminfoinput2'>
            <h3>Contact Email 1 <span style={{ color: 'red' }}>*</span></h3>
            <input type='text' placeholder='contact@billionaire.com' value={platformEmails[0]} onChange={(e) => setPlatformEmails([e.target.value, platformEmails[1]])}></input></div>
          <div className='platforminfoinput3'>
            <h3>Contact Email 2</h3>
            <input type='text' placeholder='support@billionaire.com' value={platformEmails[1]} onChange={(e) => setPlatformEmails([platformEmails[0], e.target.value])}></input></div>
          </div>
          <div className='platformcontactinfo'>
          <div className='platforminfoinput2'>
            <h3>Support Phone 1 <span style={{ color: 'red' }}>*</span></h3>
            <input type='text' placeholder='+91 22 1234 5678' value={platformPhones[0]} onChange={(e) => setPlatformPhones([e.target.value, platformPhones[1]])}></input></div>
          <div className='platforminfoinput3'>
            <h3>Support Phone 2</h3>
            <input type='text' placeholder='+91 22 1234 5678' value={platformPhones[1]} onChange={(e) => setPlatformPhones([platformPhones[0], e.target.value])}></input></div>
          </div>
          <div className='platforminfoinput1'>
            <h3>Address <span style={{ color: 'red' }}>*</span></h3>
            <textarea className='platformaboutinfo' value={platformAddress} onChange={(e) => setPlatformAddress(e.target.value)} rows={3}></textarea>
          </div>
          <button className='sendreply1' onClick={handlePlatformUpdate} disabled={platformUpdating}>{platformUpdating ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>
    </div>)}
    {activeTab === "profile" && (<div>
      <div className='adminprofile'>
        <div className='platforminfoheader'>
          <h2>Admin Profile</h2>
          <p>Manage your personal information</p></div>
        <div className='adminprofilehead'>
          <div className='adminprofilepic' onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', position: 'absolute', top: 0, left: 0 }} />
            ) : (
              getInitials()
            )}
            <div className='cameraicon' style={{ position: 'absolute', bottom: 0, right: 0 }}>
              {uploading ? <span style={{ fontSize: '12px' }}>...</span> : <IoCameraOutline />}
            </div>
          </div>
          <div className='adminprofileinfo'>
            <h3>Profile Picture</h3>
            <p>Upload a new profile picture</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer' }}>
                {uploading ? "Uploading..." : "Change Photo"}
              </span>
              {admin?.profilePicture && (
                <span onClick={handleRemovePhoto} style={{ cursor: 'pointer', borderColor: '#FFC9C9', color: '#D32F2F' }}>
                  Remove
                </span>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </div>
        <div className='platforminfoinput'>
            <h3>Name</h3>
            <input type='text' placeholder='Super Admin' value={adminName} onChange={(e) => setAdminName(e.target.value)}></input>
          </div>
          <div className='platformcontactinfo1'>
          <div className='platforminfoinput2'>
            <h3>Email</h3>
            <input type='text' placeholder='admin@billionaire.com' value={admin?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}></input></div>
          <div className='platforminfoinput3'>
            <h3>Phone</h3>
          <input type='text' placeholder='+91 98765 00000' value={phone} onChange={(e) => setPhone(e.target.value)}></input></div>
          </div>
          <button className='sendreply2' onClick={handleProfileUpdate} disabled={profileUpdating}>{profileUpdating ? "Updating..." : "Update Profile"}</button>
      </div>
    </div>)}
    {activeTab === "security" && (<div>
      <div className='securityinfo'>
        <div className='platforminfoheader'>
          <h2>Change Password</h2>
          <p>Update your account Password</p></div>
        <div className='platforminfoinput'>
            <h3>Current Password</h3>
            <input type='password' placeholder='Enter current password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}></input>
        </div>
        <div className='platforminfoinput4'>
            <h3 className='platforminputtitle'>New Password</h3>
            <input type='password' placeholder='Enter new password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>
        </div>
        <div className='platforminfoinput4'>
            <h3>Confirm New Password</h3>
            <input type='password' placeholder='Confirm new password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
        </div>
        <button className='sendreply2' onClick={handlePasswordUpdate} disabled={passwordUpdating}>{passwordUpdating ? "Updating..." : "Update Password"}</button>
      </div>
    </div>)}
  </div>;
};

export default Settings;
