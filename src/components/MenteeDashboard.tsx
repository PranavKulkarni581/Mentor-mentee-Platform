import React, { useState, lazy, Suspense } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, FileText, Calendar, GraduationCap, CheckCircle, Loader2 } from 'lucide-react';

// Lazy load the forms to prevent blocking
const InteractionForm = lazy(() => import('./forms/InteractionForm').then(m => ({ default: m.InteractionForm })));
const AttendanceForm = lazy(() => import('./forms/AttendanceForm').then(m => ({ default: m.AttendanceForm })));
const AcademicForm = lazy(() => import('./forms/AcademicForm').then(m => ({ default: m.AcademicForm })));

interface MenteeDashboardProps {
  onBack: () => void;
}

export function MenteeDashboard({ onBack }: MenteeDashboardProps) {
  const [activeTab, setActiveTab] = useState('interaction');
  const [completedForms, setCompletedForms] = useState<string[]>([]);

  const handleFormComplete = (formType: string) => {
    if (!completedForms.includes(formType)) {
      setCompletedForms([...completedForms, formType]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-900">Mentee Portal</h1>
              <p className="text-blue-600">Submit your forms and track progress</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-white shadow-lg border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Welcome, Student!</CardTitle>
              <CardDescription className="text-blue-600">
                Complete your mentorship forms below. No login required - just fill out the forms and submit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  {completedForms.includes('interaction') ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-300"></div>
                  )}
                  <span className="text-sm text-blue-700">Interaction Form</span>
                </div>
                <div className="flex items-center space-x-2">
                  {completedForms.includes('attendance') ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-300"></div>
                  )}
                  <span className="text-sm text-blue-700">Attendance</span>
                </div>
                <div className="flex items-center space-x-2">
                  {completedForms.includes('academic') ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-300"></div>
                  )}
                  <span className="text-sm text-blue-700">Academic Details</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forms Section */}
        <Card className="bg-white shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="text-xl text-blue-900">Student Forms</CardTitle>
            <CardDescription className="text-blue-600">
              Complete the forms below to provide feedback and update your records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="interaction" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Interaction Feedback</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Attendance</span>
                </TabsTrigger>
                <TabsTrigger value="academic" className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Academic Details</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interaction" className="space-y-4">
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-blue-600">Loading form...</span>
                  </div>
                }>
                  <InteractionForm onComplete={() => handleFormComplete('interaction')} />
                </Suspense>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-blue-600">Loading form...</span>
                  </div>
                }>
                  <AttendanceForm onComplete={() => handleFormComplete('attendance')} />
                </Suspense>
              </TabsContent>

              <TabsContent value="academic" className="space-y-4">
                <Suspense fallback={
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-blue-600">Loading form...</span>
                  </div>
                }>
                  <AcademicForm onComplete={() => handleFormComplete('academic')} />
                </Suspense>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-blue-700">
              <p>• Fill out all forms completely and accurately</p>
              <p>• You can save and return to complete forms later</p>
              <p>• Your mentor will review your submissions</p>
              <p>• Contact your mentor if you have questions about any form</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}