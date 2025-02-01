'use client';
import React, { useState } from 'react';
import UserProfile from '@/components/user-profile';

type UserProfileProps = {
  user: {
    name: string;
    email: string;
    image: string; // URL to the user's profile image
    accountTier: string; // e.g., "Free", "Premium", "Pro"
  };
};


const Page = () => {
    const [user, setUser] = useState({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      image: 'https://via.placeholder.com/150',
      accountTier: 'Pro',
    });
  
    const handleUpdate = (updatedUser: Partial<typeof user>) => {
      setUser((prev) => ({ ...prev, ...updatedUser }));
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <UserProfile user={user} onUpdate={handleUpdate} />
      </div>
    );
  };
  
  export default Page;
  