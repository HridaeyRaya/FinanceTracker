import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

const EditProfileModal = ({ onClose }) => {
    const { user, updateUser } = useContext(UserContext);
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(user?.profileImageUrl || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError("");
        try {
            let profileImageUrl = user?.profileImageUrl || "";

            if (profilePic) {
                const imgRes = await uploadImage(profilePic);
                profileImageUrl = imgRes.imageUrl || "";
            }

            const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
                fullName,
                profileImageUrl,
            });

            updateUser(response.data.user);
            onClose();
        } catch (err) {
            setError("Failed to update profile. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/40 z-50 flex items-center justify-center'>
            <div className='bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Edit Profile</h3>

                <div className='flex flex-col items-center gap-3 mb-4'>
                    <img
                        src={preview || ""}
                        onError={(e) => e.target.style.display = 'none'}
                        alt="Profile"
                        className='w-20 h-20 rounded-full object-cover border border-gray-200'
                    />
                    <label className='text-sm text-primary cursor-pointer'>
                        Change Photo
                        <input type="file" accept="image/*" className='hidden' onChange={handleImageChange} />
                    </label>
                </div>

                <div className='mb-4'>
                    <label className='text-sm text-gray-600'>Full Name</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className='w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm outline-none focus:border-primary'
                    />
                </div>

                {error && <p className='text-red-500 text-xs mb-3'>{error}</p>}

                <div className='flex gap-3 justify-end'>
                    <button
                        onClick={onClose}
                        className='px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className='px-4 py-2 text-sm text-white bg-primary rounded-lg'
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;