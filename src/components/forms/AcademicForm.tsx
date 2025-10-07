import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AcademicFormProps {
  onComplete: () => void;
}

export function AcademicForm({ onComplete }: AcademicFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prn: '',
    name: '',
    batch: '',
    department: '',
    currentSemester: '',
    academicYear: '',
    
    // 12th Grade Details
    twelfthBoard: '',
    twelfthPercentage: '',
    twelfthPassingYear: '',
    
    // Entrance Exam Details
    entranceExam: '',
    entranceScore: '',
    entranceRank: '',
    
    // Current Academic Performance
    previousSemesterGPA: '',
    currentSemesterCGPA: '',
    backlogs: '',
    backlogSubjects: '',
    
    // Personal Information
    hobbies: '',
    interests: '',
    skills: '',
    strengths: '',
    weaknesses: '',
    
    // Family Background
    fatherOccupation: '',
    motherOccupation: '',
    familyIncome: '',
    
    // Contact Information
    personalEmail: '',
    contactNumber: '',
    alternateContact: '',
    permanentAddress: '',
    currentAddress: '',
    
    // Additional Information
    extracurricularActivities: '',
    achievements: '',
    futureGoals: '',
    specialNeeds: '',
    medicalHistory: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.prn || !formData.name || !formData.batch || !formData.department || 
          !formData.currentSemester || !formData.academicYear || !formData.twelfthBoard || 
          !formData.twelfthPercentage || !formData.twelfthPassingYear || !formData.entranceExam || 
          !formData.personalEmail || !formData.contactNumber) {
        throw new Error('All required fields must be filled');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-84115a1d/mentee/academic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit academic form');
      }

      toast.success('Academic details submitted successfully!');
      onComplete();
      
      // Reset form
      setFormData({
        prn: '',
        name: '',
        batch: '',
        department: '',
        currentSemester: '',
        academicYear: '',
        twelfthBoard: '',
        twelfthPercentage: '',
        twelfthPassingYear: '',
        entranceExam: '',
        entranceScore: '',
        entranceRank: '',
        previousSemesterGPA: '',
        currentSemesterCGPA: '',
        backlogs: '',
        backlogSubjects: '',
        hobbies: '',
        interests: '',
        skills: '',
        strengths: '',
        weaknesses: '',
        fatherOccupation: '',
        motherOccupation: '',
        familyIncome: '',
        personalEmail: '',
        contactNumber: '',
        alternateContact: '',
        permanentAddress: '',
        currentAddress: '',
        extracurricularActivities: '',
        achievements: '',
        futureGoals: '',
        specialNeeds: '',
        medicalHistory: ''
      });

    } catch (error) {
      console.error('Academic form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit academic form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-900">Academic Details Form</CardTitle>
        <CardDescription className="text-blue-600">
          Please provide your complete academic and personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prn">PRN *</Label>
                <Input
                  id="prn"
                  placeholder="Enter your PRN"
                  value={formData.prn}
                  onChange={(e) => handleInputChange('prn', e.target.value)}
                  required
                  pattern="[0-9A-Z]{10,12}"
                  title="PRN should be 10-12 characters long"
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  minLength={2}
                />
              </div>
              <div>
                <Label htmlFor="batch">Batch *</Label>
                <Input
                  id="batch"
                  placeholder="e.g., 2021-2025"
                  value={formData.batch}
                  onChange={(e) => handleInputChange('batch', e.target.value)}
                  required
                  pattern="[0-9]{4}-[0-9]{4}"
                  title="Batch format should be YYYY-YYYY"
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer">Computer Engineering</SelectItem>
                    <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                    <SelectItem value="electrical">Electrical Engineering</SelectItem>
                    <SelectItem value="civil">Civil Engineering</SelectItem>
                    <SelectItem value="electronics">Electronics Engineering</SelectItem>
                    <SelectItem value="it">Information Technology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentSemester">Current Semester *</Label>
                <Select value={formData.currentSemester} onValueChange={(value) => handleInputChange('currentSemester', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Input
                  id="academicYear"
                  placeholder="e.g., 2024-25"
                  value={formData.academicYear}
                  onChange={(e) => handleInputChange('academicYear', e.target.value)}
                  required
                  pattern="[0-9]{4}-[0-9]{2}"
                  title="Academic year format should be YYYY-YY"
                />
              </div>
            </div>
          </div>

          {/* 12th Grade Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">12th Grade Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="twelfthBoard">Board *</Label>
                <Select value={formData.twelfthBoard} onValueChange={(value) => handleInputChange('twelfthBoard', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra State Board</SelectItem>
                    <SelectItem value="cbse">CBSE</SelectItem>
                    <SelectItem value="icse">ICSE</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="twelfthPercentage">Percentage *</Label>
                <Input
                  id="twelfthPercentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="e.g., 85.50"
                  value={formData.twelfthPercentage}
                  onChange={(e) => handleInputChange('twelfthPercentage', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="twelfthPassingYear">Passing Year *</Label>
                <Input
                  id="twelfthPassingYear"
                  type="number"
                  min="2000"
                  max="2030"
                  placeholder="e.g., 2021"
                  value={formData.twelfthPassingYear}
                  onChange={(e) => handleInputChange('twelfthPassingYear', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Entrance Exam Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Entrance Exam Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="entranceExam">Entrance Exam *</Label>
                <Select value={formData.entranceExam} onValueChange={(value) => handleInputChange('entranceExam', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jee-main">JEE Main</SelectItem>
                    <SelectItem value="mht-cet">MHT CET</SelectItem>
                    <SelectItem value="jee-advanced">JEE Advanced</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="entranceScore">Score</Label>
                <Input
                  id="entranceScore"
                  placeholder="Enter your score"
                  value={formData.entranceScore}
                  onChange={(e) => handleInputChange('entranceScore', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="entranceRank">Rank</Label>
                <Input
                  id="entranceRank"
                  type="number"
                  min="1"
                  placeholder="Enter your rank"
                  value={formData.entranceRank}
                  onChange={(e) => handleInputChange('entranceRank', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Current Academic Performance */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Current Academic Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previousSemesterGPA">Previous Semester GPA</Label>
                <Input
                  id="previousSemesterGPA"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 8.50"
                  value={formData.previousSemesterGPA}
                  onChange={(e) => handleInputChange('previousSemesterGPA', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentSemesterCGPA">Current CGPA</Label>
                <Input
                  id="currentSemesterCGPA"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 8.25"
                  value={formData.currentSemesterCGPA}
                  onChange={(e) => handleInputChange('currentSemesterCGPA', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="backlogs">Number of Backlogs</Label>
                <Input
                  id="backlogs"
                  type="number"
                  placeholder="0"
                  value={formData.backlogs}
                  onChange={(e) => handleInputChange('backlogs', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="backlogSubjects">Backlog Subjects (if any)</Label>
                <Input
                  id="backlogSubjects"
                  placeholder="List subjects with backlogs"
                  value={formData.backlogSubjects}
                  onChange={(e) => handleInputChange('backlogSubjects', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hobbies">Hobbies</Label>
                <Input
                  id="hobbies"
                  placeholder="e.g., Reading, Sports, Music"
                  value={formData.hobbies}
                  onChange={(e) => handleInputChange('hobbies', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="interests">Interests</Label>
                <Input
                  id="interests"
                  placeholder="e.g., Technology, Research, Entrepreneurship"
                  value={formData.interests}
                  onChange={(e) => handleInputChange('interests', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="skills">Technical Skills</Label>
                <Input
                  id="skills"
                  placeholder="e.g., Programming Languages, Tools"
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="strengths">Strengths</Label>
                <Input
                  id="strengths"
                  placeholder="e.g., Leadership, Communication"
                  value={formData.strengths}
                  onChange={(e) => handleInputChange('strengths', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="weaknesses">Areas for Improvement</Label>
              <Textarea
                id="weaknesses"
                placeholder="Areas you would like to improve upon..."
                value={formData.weaknesses}
                onChange={(e) => handleInputChange('weaknesses', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="personalEmail">Personal Email *</Label>
                <Input
                  id="personalEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.personalEmail}
                  onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  required
                  pattern="[0-9+\-\s]{10,15}"
                  title="Please enter a valid phone number"
                />
              </div>
              <div>
                <Label htmlFor="alternateContact">Alternate Contact</Label>
                <Input
                  id="alternateContact"
                  type="tel"
                  placeholder="Parent/Guardian number"
                  value={formData.alternateContact}
                  onChange={(e) => handleInputChange('alternateContact', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fatherOccupation">Father's Occupation</Label>
                <Input
                  id="fatherOccupation"
                  placeholder="Father's profession"
                  value={formData.fatherOccupation}
                  onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="permanentAddress">Permanent Address</Label>
                <Textarea
                  id="permanentAddress"
                  placeholder="Enter your permanent address"
                  value={formData.permanentAddress}
                  onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="currentAddress">Current Address</Label>
                <Textarea
                  id="currentAddress"
                  placeholder="Enter your current address"
                  value={formData.currentAddress}
                  onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Additional Information</h3>
            <div>
              <Label htmlFor="extracurricularActivities">Extracurricular Activities</Label>
              <Textarea
                id="extracurricularActivities"
                placeholder="Sports, clubs, volunteering, competitions..."
                value={formData.extracurricularActivities}
                onChange={(e) => handleInputChange('extracurricularActivities', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="achievements">Achievements & Awards</Label>
              <Textarea
                id="achievements"
                placeholder="Academic achievements, competitions, certifications..."
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="futureGoals">Future Goals & Career Aspirations</Label>
              <Textarea
                id="futureGoals"
                placeholder="Your career goals and aspirations..."
                value={formData.futureGoals}
                onChange={(e) => handleInputChange('futureGoals', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Academic Details
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}