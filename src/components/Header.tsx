
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/landing');
    } catch (error) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="w-full py-6 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-bold gradient-text">ArtBlossom AI</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-500 hidden md:block">
            Unleash your creativity with AI
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-art-light-purple/50 rounded-full">
                <User size={16} className="text-art-purple" />
                <span className="text-sm font-medium text-art-dark-purple truncate max-w-[120px]">
                  {currentUser.email?.split('@')[0]}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-500 hover:text-art-purple"
              >
                <LogOut size={18} />
                <span className="ml-1 md:inline hidden">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
