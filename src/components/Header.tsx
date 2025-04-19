
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold gradient-text">ArtBlossom AI</h1>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Unleash your creativity with AI
        </div>
      </div>
    </header>
  );
};

export default Header;
