import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, UserCheck, BookOpen, BarChart3 } from 'lucide-react';

interface LandingPageProps {
  onMenteeSelect: () => void;
  onMentorSelect: () => void;
}

export function LandingPage({ onMenteeSelect, onMentorSelect }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
                  Mentor-Mentee Management Portal
                </h1>
                <p className="text-blue-600">Walchand College of Engineering, Sangli</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-4">
            Welcome to the Portal
          </h2>
          <p className="text-lg text-blue-700 max-w-3xl mx-auto">
            A comprehensive platform to streamline mentor-mentee interactions, track academic progress, 
            and provide valuable feedback mechanisms for enhanced learning experiences.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mentee Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-blue-200 hover:border-blue-400">
            <CardHeader className="text-center pb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">I am a Mentee</CardTitle>
              <CardDescription className="text-blue-600">
                Submit forms, provide feedback, and track your academic journey
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-blue-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Fill interaction feedback forms
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Submit academic details and records
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Mark attendance for mentoring sessions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  No login required - quick and easy access
                </li>
              </ul>
              <Button 
                onClick={onMenteeSelect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Access Mentee Forms
              </Button>
            </CardContent>
          </Card>

          {/* Mentor Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-blue-200 hover:border-blue-400">
            <CardHeader className="text-center pb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-900">I am a Mentor</CardTitle>
              <CardDescription className="text-blue-600">
                Access dashboard, review mentee data, and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-blue-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  View assigned mentees' data
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Track attendance and interactions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Generate analytics and reports
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Secure login and data management
                </li>
              </ul>
              <Button 
                onClick={onMentorSelect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Mentor Login / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 text-center mb-8">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Academic Tracking</h4>
              <p className="text-blue-700 text-sm">
                Comprehensive tracking of academic progress, marks, and performance metrics
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Interaction Management</h4>
              <p className="text-blue-700 text-sm">
                Structured feedback forms and communication channels between mentors and mentees
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">Analytics & Reports</h4>
              <p className="text-blue-700 text-sm">
                Detailed analytics, attendance tracking, and downloadable reports for mentors
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-blue-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-blue-600">
              © 2024 Walchand College of Engineering, Sangli. All rights reserved.
            </p>
            <p className="text-blue-500 text-sm mt-2">
              Mentor-Mentee Management Portal - Enhancing Academic Excellence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}