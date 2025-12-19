import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const AVATARS = [
  '👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓',
  '🧑‍💻', '👨‍🔬', '👩‍🔬', '🧑‍🎨', '👨‍🍳', '👩‍🍳', '🧑‍🌾', '👨‍⚕️'
];

export const UserProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    return savedAvatar || AVATARS[0];
  });

  useEffect(() => {
    localStorage.setItem('userAvatar', avatar);
  }, [avatar]);

  return (
    <UserContext.Provider value={{ avatar, setAvatar, availableAvatars: AVATARS }}>
      {children}
    </UserContext.Provider>
  );
};
