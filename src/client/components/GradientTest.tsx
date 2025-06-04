import React from 'react';

// Simple component to test Tailwind v4 gradient functionality
const GradientTest: React.FC = () => {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gradient Tests</h1>
      
      {/* Standard blue gradient without custom colors */}
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Standard Blue Gradient</h2>
        <div className="h-20 bg-linear-to-r from-blue-500 to-blue-700 rounded-lg"></div>
      </div>

      {/* Mixed colors gradient */}
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Blue to Purple Gradient</h2>
        <div className="h-20 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg"></div>
      </div>
      
      {/* Diagonal gradient */}
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Diagonal Gradient</h2>
        <div className="h-20 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg"></div>
      </div>
      
      {/* Button with gradient */}
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Button with Gradient</h2>
        <button className="w-full bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg">
          Gradient Button
        </button>
      </div>
      
      {/* Gradient text */}
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Gradient Text</h2>
        <div className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          This text should have a gradient
        </div>
      </div>
    </div>
  );
};

export default GradientTest;
