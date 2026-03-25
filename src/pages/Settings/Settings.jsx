import './Settings.css';
import { useState, useEffect, useRef } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { getAdminProfile, updateAdminProfilePicture, removeAdminProfilePicture, getPresignedUrl } from "../../lib/admin";

const CDN_ENDPOINT = import.meta.env.VITE_AWS_CDN_ENDPOINT || "https://bauctionprod.s3.ap-south-1.amazonaws.com";
const BUCKET_PREFIX = import.meta.env.VITE_AWS_BUCKET_PREFIX || "ba";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const [admin, setAdmin] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    getAdminProfile()
      .then((res) => setAdmin(res.data))
      .catch((err) => console.error("Failed to load profile", err));
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
            <h3>Platform Name</h3>
            <input type='text' placeholder='Billionaire Auction'></input>
          </div>
          <div className='platforminfoinput'>
            <h3>Tagline</h3>
            <input type='text' placeholder='Luxury Items for the Elite'></input>
          </div>
          <div className='platforminfoinput1'>
            <h3>About Platform</h3>
            <input type='text' className='platformaboutinfo'></input>
          </div>
          <div className='platformcontactinfo'>
          <div className='platforminfoinput2'>
            <h3>Contact Email</h3>
            <input type='text' placeholder='contact@billionaire.com'></input></div>
          <div className='platforminfoinput3'>
            <h3>Support Phone</h3>
          <input type='text' placeholder='+91 22 1234 5678'></input></div>
          </div>
          <div className='platforminfoinput1'>
            <h3>Address</h3>
            <input type='text' className='platformaboutinfo'></input>
          </div>
          <button className='sendreply1'>Save Changes</button>
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
        <div className='platformcontactinfo1'>
          <div className='platforminfoinput2'>
            <h3>First Name</h3>
            <input type='text' placeholder='Super' value={admin?.name?.split(' ')[0] || ''} readOnly></input></div>
          <div className='platforminfoinput3'>
            <h3>Last Name</h3>
          <input type='text' placeholder='Admin' value={admin?.name?.split(' ').slice(1).join(' ') || ''} readOnly></input></div>
          </div>
          <div className='platformcontactinfo1'>
          <div className='platforminfoinput2'>
            <h3>Email</h3>
            <input type='text' placeholder='admin@billionaire.com' value={admin?.email || ''} readOnly></input></div>
          <div className='platforminfoinput3'>
            <h3>Phone</h3>
          <input type='text' placeholder='+91 98765 00000' value={admin?.phone || ''} readOnly></input></div>
          </div>
          <button className='sendreply2'>Update Profile</button>
      </div>
    </div>)}
    {activeTab === "security" && (<div>
      <div className='securityinfo'>
        <div className='platforminfoheader'>
          <h2>Change Password</h2>
          <p>Update your account Password</p></div>
        <div className='platforminfoinput'>
            <h3>Current Password</h3>
            <input type='text' placeholder='Enter current password'></input>
        </div>
        <div className='platforminfoinput4'>
            <h3 className='platforminputtitle'>New Password</h3>
            <input type='text' placeholder='Enter new password'></input>
        </div>
        <div className='platforminfoinput4'>
            <h3>Confirm New Password</h3>
            <input type='text' placeholder='Confirm new password'></input>
        </div>
        <button className='sendreply2'>Update Password</button>
      </div>
    </div>)}
  </div>;
};

export default Settings;
