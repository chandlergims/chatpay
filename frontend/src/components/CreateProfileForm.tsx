import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './CreateProfileForm.css';
import ChatPriceSlider from './ChatPriceSlider';
import { createOrUpdateProfile, ProfileFormData } from '../services/profileService';
import { getUser } from '../services/authService';

interface CreateProfileFormProps {
  onSubmit?: (data: ProfileFormData) => void;
  onCancel: () => void;
}

const CreateProfileForm: React.FC<CreateProfileFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProfileFormData & { chatPrice: number }>({
    name: '',
    avatar: '👤',
    bio: '',
    chatPrice: 0.01
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user data on component mount
  useEffect(() => {
    const userData = getUser();
    if (userData) {
      // Pre-fill name with username if available
      setFormData(prevState => ({
        ...prevState,
        name: userData.username || prevState.name
      }));
    }
  }, []);

  const avatarOptions = ['👤', '👨‍💼', '👩‍💼', '🧑‍💻', '👩‍🎓', '👨‍🚀', '👩‍🔬', '🧙‍♂️', '🧚‍♀️', '🦸‍♂️', '🦹‍♀️'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSliderChange = (value: number) => {
    setFormData(prevState => ({
      ...prevState,
      chatPrice: value
    }));
  };

  const handleAvatarSelect = (avatar: string) => {
    setFormData(prevState => ({
      ...prevState,
      avatar
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Use the profile service to create/update the profile
      await createOrUpdateProfile(formData);
      
      toast.success('Profile created successfully!');
      
      // Call the onSubmit prop to notify the parent component
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // If no onSubmit prop, just close the form
        onCancel();
        // Reload the page to update the UI
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-profile-form">
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
          {avatarOptions.map((avatar, index) => (
            <div 
              key={index}
              className={`avatar-option ${formData.avatar === avatar ? 'selected' : ''}`}
              onClick={() => handleAvatarSelect(avatar)}
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
          placeholder="Tell us a bit about yourself"
          rows={3}
        />
      </div>
      
      
      <div className="form-group">
        <label htmlFor="chatPrice">Chat Price</label>
        <ChatPriceSlider 
          value={formData.chatPrice} 
          onChange={handleSliderChange} 
        />
      </div>
      
      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
        </button>
      </div>
    </form>
  );
};

export default CreateProfileForm;
