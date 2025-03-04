import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUser } from '../services/authService';
import { createOrUpdateProfile, getMyProfile } from '../services/profileService';
import ChatPriceSlider from '../components/ChatPriceSlider';
import './Pages.css';

interface ProfileFormData {
  name: string;
  bio: string;
  avatar: string;
  chatPrice: number;
  solanaWallet?: string;
  twitter?: string;
}

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    avatar: '👤',
    chatPrice: 0.01,
    solanaWallet: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const userData = getUser();
        
        if (!userData) {
          // Redirect to home if not logged in
          navigate('/');
          return;
        }
        
        // Try to fetch the user's profile
        const profileData = await getMyProfile();
        
        if (profileData) {
          // If profile exists, use its data
          setFormData({
            name: profileData.name || userData.username,
            bio: profileData.bio || '',
            avatar: profileData.avatar || '👤',
            chatPrice: profileData.chatPrice || 0.01,
            solanaWallet: userData.solanaWallet || '',
            twitter: userData.twitter || ''
          });
        } else {
          // If no profile exists, use default values
          setFormData({
            name: userData.username,
            bio: '',
            avatar: '👤',
            chatPrice: 0.01,
            solanaWallet: userData.solanaWallet || '',
            twitter: userData.twitter || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load profile data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserAndProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Update profile
      await createOrUpdateProfile({
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar,
        chatPrice: formData.chatPrice,
        twitter: formData.twitter
      });
      
      // Show success message
      toast.success('Profile updated successfully');
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="page-container">
      
      <div className="create-profile-container">
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your display name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Select Avatar</label>
            <div className="avatar-options">
              {['👤', '👨‍💼', '👩‍💼', '🧑‍💻', '👩‍🎓', '👨‍🚀', '👩‍🔬', '🧙‍♂️', '🧚‍♀️', '🦸‍♂️', '🦹‍♀️'].map((avatar, index) => (
                <div 
                  key={index}
                  className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                >
                  {avatar}
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell others about yourself..."
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="chatPrice">Chat Price (SOL)</label>
            <ChatPriceSlider
              value={formData.chatPrice}
              onChange={(value) => setFormData(prev => ({ ...prev, chatPrice: value }))}
            />
            <small>Set the price others will pay to chat with you.</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="twitter">Twitter Handle</label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={formData.twitter || ''}
              onChange={handleChange}
              placeholder="@yourtwitterhandle"
            />
            <small>Your Twitter handle (optional)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="solanaWallet">Payout Address (Solana Wallet)</label>
            <input
              type="text"
              id="solanaWallet"
              name="solanaWallet"
              value={formData.solanaWallet}
              onChange={handleChange}
              placeholder="Your Solana wallet address"
              disabled
            />
            <small>This is the wallet address where you'll receive payments. Contact support to update.</small>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
