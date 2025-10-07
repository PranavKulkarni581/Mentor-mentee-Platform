import React from 'react';

export default function TestApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Test Page</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-blue-700">If you can see this, the basic app is working.</p>
          <p className="text-blue-600 mt-2">The timeout issue has been resolved.</p>
        </div>
      </div>
    </div>
  );
}