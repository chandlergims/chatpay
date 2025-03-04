import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { register, RegisterData } from '../services/authService';
import { createOrUpdateProfile } from '../services/profileService';
import './RegisterModal.css';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    password: '',
    confirmPassword: '',
    twitter: '',
    solanaWallet: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.solanaWallet) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate Solana wallet address format
    const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!solanaAddressRegex.test(formData.solanaWallet)) {
      setError('Please enter a valid Solana wallet address');
      return;
    }

    try {
      setIsLoading(true);
      
      // Register the user
      const userData = await register(formData);
      
      // Automatically create a profile for the user
      try {
        const profileData = {
          name: userData.username,
          bio: '',
          avatar: '👤',
          chatPrice: 0.05
        };
        
        await createOrUpdateProfile(profileData);
        
        // Show success toast notification
        toast.success(`Welcome, ${userData.username}! Your Chatr profile has been created.`);
      } catch (profileError) {
        console.error('Error creating profile:', profileError);
        toast.warning(`Account created, but we couldn't create your profile automatically.`);
      }
      
      // Close the modal
      onClose();
      
      // Reload the page to update the UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <Modal isOpen={isOpen} onClose={onClose} title="Register">
      <form onSubmit={handleSubmit} className="register-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="twitter">Twitter Handle (optional)</label>
          <input
            type="text"
            id="twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="@yourtwitterhandle"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="solanaWallet">Payout Address (Solana Wallet)</label>
          <input
            type="text"
            id="solanaWallet"
            name="solanaWallet"
            value={formData.solanaWallet}
            onChange={handleChange}
            placeholder="Enter your Solana wallet address"
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default RegisterModal;
