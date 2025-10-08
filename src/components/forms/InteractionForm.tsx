import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface InteractionFormProps {
  onComplete: () => void;
}

export function InteractionForm({ onComplete }: InteractionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prn: '',
    name: '',
    batch: '',
    semester: '',
    academicYear: '',
    mentorName: '',
    meetingDate: '',
    meetingType: '',
    discussionTopics: [] as string[],
    facultyFeedback: {
      teachingQuality: '',
      courseContent: '',
      communication: '',
      availability: ''
    },
    difficulties: '',
    suggestions: '',
    personalChallenges: '',
    careerGoals: '',
    extracurriculars: '',
    overallRating: '',
    additionalComments: ''
  });

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleNestedChange = useCallback((parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [field]: value
      }
    }));
  }, []);

  const handleTopicsChange = useCallback((topic: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      discussionTopics: checked 
        ? [...prev.discussionTopics, topic]
        : prev.discussionTopics.filter(t => t !== topic)
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.prn || !formData.name || !formData.batch || !formData.semester || 
          !formData.academicYear || !formData.mentorName || !formData.meetingDate || 
          !formData.meetingType || !formData.facultyFeedback.teachingQuality || 
          !formData.facultyFeedback.courseContent || !formData.difficulties || 
          !formData.suggestions || !formData.careerGoals || !formData.overallRating) {
        throw new Error('All required fields must be filled');
      }

      if (formData.discussionTopics.length === 0) {
        throw new Error('Please select at least one discussion topic');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-84115a1d/mentee/interaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      toast.success('Interaction form submitted successfully!');
      onComplete();
      
      // Reset form
      setFormData({
        prn: '',
        name: '',
        batch: '',
        semester: '',
        academicYear: '',
        mentorName: '',
        meetingDate: '',
        meetingType: '',
        discussionTopics: [] as string[],
        facultyFeedback: {
          teachingQuality: '',
          courseContent: '',
          communication: '',
          availability: ''
        },
        difficulties: '',
        suggestions: '',
        personalChallenges: '',
        careerGoals: '',
        extracurriculars: '',
        overallRating: '',
        additionalComments: ''
      });

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setLoading(false);
    }
  };

  const discussionTopicOptions = [
    'Academic Performance',
    'Course Selection',
    'Career Planning',
    'Personal Issues',
    'Extracurricular Activities',
    'Study Techniques',
    'Time Management',
    'Stress Management'
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-900">Mentor-Mentee Interaction Form</CardTitle>
        <CardDescription className="text-blue-600">
          Please provide feedback about your mentoring session and academic experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
              <Label htmlFor="semester">Current Semester *</Label>
              <Select value={formData.semester} onValueChange={(value) => handleInputChange('semester', value)} required>
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
            <div>
              <Label htmlFor="mentorName">Mentor Name *</Label>
              <Input
                id="mentorName"
                placeholder="Enter your mentor's name"
                value={formData.mentorName}
                onChange={(e) => handleInputChange('mentorName', e.target.value)}
                required
                minLength={2}
              />
            </div>
          </div>

          {/* Meeting Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meetingDate">Meeting Date *</Label>
              <Input
                id="meetingDate"
                type="date"
                value={formData.meetingDate}
                onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="meetingType">Meeting Type *</Label>
              <Select value={formData.meetingType} onValueChange={(value) => handleInputChange('meetingType', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discussion Topics */}
          <div>
            <Label>Discussion Topics (Select at least one) *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 p-4 border border-blue-200 rounded-lg bg-blue-50">
              {discussionTopicOptions.map(topic => (
                <div key={topic} className="flex items-center space-x-3">
                  <Checkbox
                    id={topic}
                    checked={formData.discussionTopics.includes(topic)}
                    onCheckedChange={(checked) => handleTopicsChange(topic, !!checked)}
                  />
                  <Label htmlFor={topic} className="text-sm font-medium text-blue-900 cursor-pointer">{topic}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Faculty Feedback *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <Label className="text-blue-900 font-medium">Teaching Quality *</Label>
                <RadioGroup 
                  value={formData.facultyFeedback.teachingQuality} 
                  onValueChange={(value) => handleNestedChange('facultyFeedback', 'teachingQuality', value)}
                  className="mt-3"
                  required
                >
                  {['Excellent', 'Good', 'Average', 'Poor'].map(rating => (
                    <div key={rating} className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={rating} 
                        id={`teaching-${rating}`}
                      />
                      <Label htmlFor={`teaching-${rating}`} className="text-blue-900 font-medium cursor-pointer">{rating}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <Label className="text-blue-900 font-medium">Course Content *</Label>
                <RadioGroup 
                  value={formData.facultyFeedback.courseContent} 
                  onValueChange={(value) => handleNestedChange('facultyFeedback', 'courseContent', value)}
                  className="mt-3"
                  required
                >
                  {['Excellent', 'Good', 'Average', 'Poor'].map(rating => (
                    <div key={rating} className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={rating} 
                        id={`content-${rating}`}
                      />
                      <Label htmlFor={`content-${rating}`} className="text-blue-900 font-medium cursor-pointer">{rating}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="difficulties">Academic Difficulties / Challenges *</Label>
              <Textarea
                id="difficulties"
                placeholder="Describe any academic challenges you're facing..."
                value={formData.difficulties}
                onChange={(e) => handleInputChange('difficulties', e.target.value)}
                rows={3}
                required
                minLength={10}
              />
            </div>
            <div>
              <Label htmlFor="suggestions">Suggestions for Improvement *</Label>
              <Textarea
                id="suggestions"
                placeholder="Any suggestions for improving teaching methods, course structure, etc..."
                value={formData.suggestions}
                onChange={(e) => handleInputChange('suggestions', e.target.value)}
                rows={3}
                required
                minLength={10}
              />
            </div>
            <div>
              <Label htmlFor="careerGoals">Career Goals & Aspirations *</Label>
              <Textarea
                id="careerGoals"
                placeholder="Share your career goals and how your mentor can help..."
                value={formData.careerGoals}
                onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                rows={3}
                required
                minLength={10}
              />
            </div>
          </div>

          {/* Overall Rating */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <Label className="text-blue-900 font-medium">Overall Session Rating *</Label>
            <RadioGroup 
              value={formData.overallRating} 
              onValueChange={(value) => handleInputChange('overallRating', value)}
              className="mt-3"
              required
            >
              <div className="flex space-x-8">
                {[1, 2, 3, 4, 5].map(rating => (
                  <div key={rating} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={rating.toString()} 
                      id={`rating-${rating}`}
                    />
                    <Label htmlFor={`rating-${rating}`} className="text-blue-900 font-medium cursor-pointer">{rating}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-600 mt-2">1 = Poor, 5 = Excellent</p>
            </RadioGroup>
          </div>

          {/* Additional Comments */}
          <div>
            <Label htmlFor="additionalComments">Additional Comments</Label>
            <Textarea
              id="additionalComments"
              placeholder="Any other feedback or comments..."
              value={formData.additionalComments}
              onChange={(e) => handleInputChange('additionalComments', e.target.value)}
              rows={3}
            />
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
                Submit Interaction Form
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}