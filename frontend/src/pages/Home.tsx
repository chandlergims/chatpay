import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Pages.css';
import ChatGraph from '../components/ChatGraph';
import { getProfiles, ProfilesResponse, getProfileChatRecords } from '../services/profileService';
import { isAuthenticated, getUser } from '../services/authService';
import MessageModal from '../components/MessageModal';
import Modal from '../components/Modal';
import CreateProfileForm from '../components/CreateProfileForm';

// Interface for profile display data
interface ProfileDisplayData {
  _id: string;
  user: string; // User ID that owns this profile
  name: string;
  avatar: string;
  earnings: string;
  status: 'online' | 'offline';
  growth: string;
  chatPrice: number;
  chatsReceived: number;
  chatData: { name: string; chatsAccepted: number }[];
}

const Home: React.FC = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'online', 'offline'
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [profiles, setProfiles] = useState<ProfileDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileDisplayData | null>(null);
  
  // Handle message button click
  const handleMessageClick = (profile: ProfileDisplayData) => {
    if (!isAuthenticated()) {
      toast.error('You must be logged in to message users');
      return;
    }
    
    // Set the selected profile and open the message modal
    setSelectedProfile(profile);
    setIsMessageModalOpen(true);
  };

  // State to track if we've fetched chat records
  const [hasFetchedChatRecords, setHasFetchedChatRecords] = useState(false);
  
  // Fetch chat records for each profile
  useEffect(() => {
    // Skip if no profiles, still loading, or already fetched
    if (isLoading || profiles.length === 0 || hasFetchedChatRecords) return;
    
    const fetchChatRecords = async () => {
      try {
        // Create a copy of the profiles array
        const updatedProfiles = [...profiles];
        
        // Fetch chat records for each profile
        for (let i = 0; i < updatedProfiles.length; i++) {
          const profile = updatedProfiles[i];
          
          try {
            // Get chat records for this profile
            const chatRecords = await getProfileChatRecords(profile._id);
            
            // Map chat records to chat data format
            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const chatData = profile.chatData.map((item) => {
              // Find the corresponding chat record
              const chatRecord = chatRecords.find(record => {
                // Parse the date and adjust for timezone
                const recordDate = new Date(record.date);
                // Add one day to fix the day offset issue
                recordDate.setDate(recordDate.getDate() + 1);
                const dayName = daysOfWeek[recordDate.getDay()];
                return dayName === item.name;
              });
              
              return {
                name: item.name,
                chatsAccepted: chatRecord ? chatRecord.count : 0
              };
            });
            
            // Update the profile with the new chat data
            updatedProfiles[i] = {
              ...profile,
              chatData
            };
          } catch (error) {
            console.error(`Failed to fetch chat records for profile ${profile._id}:`, error);
          }
        }
        
        // Update the profiles state
        setProfiles(updatedProfiles);
        
        // Mark as fetched
        setHasFetchedChatRecords(true);
      } catch (error) {
        console.error('Failed to fetch chat records:', error);
      }
    };
    
    fetchChatRecords();
  }, [isLoading, profiles, hasFetchedChatRecords]);
  
  // Fetch profiles when filter or search changes
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const response: ProfilesResponse = await getProfiles(search, filter === 'all' ? undefined : filter);
        
        // Transform API profiles to display format
        const transformedProfiles: ProfileDisplayData[] = response.profiles.map(profile => {
          // Calculate growth percentage
          let growthPercentage = 0;
          if (profile.previousWeekChats > 0) {
            growthPercentage = Math.round(((profile.currentWeekChats - profile.previousWeekChats) / profile.previousWeekChats) * 100);
          }
          
          // Format growth string
          const growthString = growthPercentage >= 0 ? `+${growthPercentage}%` : `${growthPercentage}%`;
          
          // Initialize chat data with default values
          const chatData = [];
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          
          // We'll fetch the actual chat records later
          // For now, create a placeholder with zeros
          const today = new Date();
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayName = daysOfWeek[date.getDay()];
            
            chatData.push({
              name: dayName,
              chatsAccepted: 0
            });
          }
          
          return {
            _id: profile._id,
            user: profile.user,
            name: profile.name,
            avatar: profile.avatar || '👤',
            earnings: `$${profile.earnings.toFixed(2)}`,
            status: profile.isActive ? 'online' : 'offline',
            growth: growthString,
            chatPrice: profile.chatPrice,
            chatsReceived: profile.chatsReceived || 0,
            chatData
          };
        });
        
        setProfiles(transformedProfiles);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profiles';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfiles();
  }, [filter, search]);

  
  const handleProfileCreated = () => {
    // Refresh the profiles list after creating a profile
    setIsCreateProfileModalOpen(false);
    // Reload the page to update the UI
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSearch(searchInput);
  };

  // Check if a profile belongs to the current user
  const isOwnProfile = (profile: ProfileDisplayData) => {
    // Get the current user from localStorage to ensure we have the most up-to-date ID
    const user = getUser();
    
    if (!user) return false;
    
    // Check if the user has a profile and if it matches the current profile ID
    if (user.profile && user.profile === profile._id) {
      return true;
    }
    
    // Also check if the user ID matches the profile's user ID as a fallback
    return user._id === profile.user;
  };

  return (
    <div className="page-container">
      <div className="white-container">
        <div className="profiles-header">
          <h1>AskFi</h1>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by name or keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        <div className="filters">
          <button
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setIsLoading(true);
              setFilter('all');
            }}
            disabled={isLoading}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === 'earnings' ? 'active' : ''}`}
            onClick={() => {
              setIsLoading(true);
              setFilter('earnings');
            }}
            disabled={isLoading}
          >
            Top Earnings
          </button>
          <button
            className={`filter-button ${filter === 'chatsReceived' ? 'active' : ''}`}
            onClick={() => {
              setIsLoading(true);
              setFilter('chatsReceived');
            }}
            disabled={isLoading}
          >
            Most Active
          </button>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading">Loading profiles...</div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error">{error}</div>
          </div>
        ) : (
          <div className="profiles-grid">
          {profiles.map((profile: ProfileDisplayData) => (
            <div key={profile._id} className="profile-card">
              <div className="profile-avatar">
                <span>{profile.avatar}</span>
              </div>
              <div className="profile-info">
                <h3>{profile.name}</h3>
                <div className="profile-stats">
                  <p className="earnings">Earnings: {profile.earnings}</p>
                  <p className="chats-received">Chats: {profile.chatsReceived || 0}</p>
                </div>
                <ChatGraph data={profile.chatData} height={80} />
              </div>
              <div className="profile-actions">
                <div className="chat-price">{profile.chatPrice.toFixed(3)} SOL</div>
                <button 
                  className="chat-button"
                  onClick={() => handleMessageClick(profile)}
                  disabled={isOwnProfile(profile)}
                  title={isOwnProfile(profile) ? "You cannot message yourself" : ""}
                >
                  {isOwnProfile(profile) ? "Your Profile" : "Message"}
                </button>
              </div>
            </div>
          ))}

          {profiles.length === 0 && !isLoading && (
            <div className="no-profiles">
              <p>No profiles found. Try a different filter or create a new profile.</p>
            </div>
          )}
        </div>
      )}

      {/* Message Modal */}
      {selectedProfile && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          recipientId={selectedProfile.user}
          recipientName={selectedProfile.name}
        />
      )}
      
      {/* Create Profile Modal */}
      <Modal
        isOpen={isCreateProfileModalOpen}
        onClose={() => setIsCreateProfileModalOpen(false)}
        title="Create AskFi Profile"
      >
        <CreateProfileForm
          onSubmit={handleProfileCreated}
          onCancel={() => setIsCreateProfileModalOpen(false)}
        />
      </Modal>
      </div>
    </div>
  );
};

export default Home;
