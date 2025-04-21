
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary">
      <div className="container mx-auto px-4 pt-8">
        <nav className="flex justify-between items-center py-6">
          <h1 className="text-3xl font-bold gradient-text">ArtBlossom AI</h1>
          <div className="space-x-2">
            <Link to="/login">
              <Button variant="ghost" className="text-art-dark-purple hover:text-art-purple">
                Log in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-art-gradient text-white hover:opacity-90">
                Sign up
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your
            <span className="gradient-text block">Ideas Into Art</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Create stunning AI-generated images from text descriptions. Sign up now to start creating and save your masterpieces.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register">
              <Button className="bg-art-gradient hover:opacity-90 py-6 px-8 text-lg">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-art-purple text-art-dark-purple hover:bg-art-light-purple py-6 px-8 text-lg">
                Log in to your account
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-md backdrop-blur-sm bg-opacity-70 border border-gray-100">
              <div className="w-14 h-14 bg-art-light-purple rounded-full flex items-center justify-center text-art-purple text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Describe Your Vision</h3>
              <p className="text-gray-600">
                Use natural language to describe the image you want to create in detail.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md backdrop-blur-sm bg-opacity-70 border border-gray-100">
              <div className="w-14 h-14 bg-art-light-purple rounded-full flex items-center justify-center text-art-purple text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate with AI</h3>
              <p className="text-gray-600">
                Our advanced AI model transforms your text into stunning, unique imagery.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md backdrop-blur-sm bg-opacity-70 border border-gray-100">
              <div className="w-14 h-14 bg-art-light-purple rounded-full flex items-center justify-center text-art-purple text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Save & Download</h3>
              <p className="text-gray-600">
                Save your creations to your personal gallery and download in high quality.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ArtBlossom AI - Create beautiful AI-generated images</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
