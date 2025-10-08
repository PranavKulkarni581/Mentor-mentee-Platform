import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface AttendanceFormProps {
  onComplete: () => void;
}

export function AttendanceForm({ onComplete }: AttendanceFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prn: '',
    name: '',
    batch: '',
    mentorName: '',
    sessionDate: '',
    sessionTime: '',
    sessionDuration: '',
    sessionType: '',
    attendanceStatus: '',
    sessionTopic: '',
    sessionObjectives: '',
    participationLevel: '',
    punctuality: '',
    preparedness: '',
    engagementLevel: '',
    questionsAsked: '',
    followUpRequired: '',
    nextSessionPlanned: '',
    nextSessionDate: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: any) => {
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
      if (!formData.prn || !formData.name || !formData.batch || !formData.mentorName || 
          !formData.sessionDate || !formData.sessionTime || !formData.sessionDuration || 
          !formData.sessionType || !formData.attendanceStatus || !formData.participationLevel || 
          !formData.punctuality || !formData.preparedness) {
        throw new Error('All required fields must be filled');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-84115a1d/mentee/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit attendance');
      }

      toast.success('Attendance submitted successfully!');
      onComplete();
      
      // Reset form
      setFormData({
        prn: '',
        name: '',
        batch: '',
        mentorName: '',
        sessionDate: '',
        sessionTime: '',
        sessionDuration: '',
        sessionType: '',
        attendanceStatus: '',
        sessionTopic: '',
        sessionObjectives: '',
        participationLevel: '',
        punctuality: '',
        preparedness: '',
        engagementLevel: '',
        questionsAsked: '',
        followUpRequired: '',
        nextSessionPlanned: '',
        nextSessionDate: '',
        additionalNotes: ''
      });

    } catch (error) {
      console.error('Attendance submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-blue-900">Mentor-Mentee Session Attendance</CardTitle>
        <CardDescription className="text-blue-600">
          Record your attendance and participation in mentoring sessions
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

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sessionDate">Session Date *</Label>
              <Input
                id="sessionDate"
                type="date"
                value={formData.sessionDate}
                onChange={(e) => handleInputChange('sessionDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sessionTime">Session Time *</Label>
              <Input
                id="sessionTime"
                type="time"
                value={formData.sessionTime}
                onChange={(e) => handleInputChange('sessionTime', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sessionDuration">Duration (minutes) *</Label>
              <Select value={formData.sessionDuration} onValueChange={(value) => handleInputChange('sessionDuration', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session Type */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <Label className="text-blue-900 font-medium">Session Type *</Label>
            <RadioGroup 
              value={formData.sessionType} 
              onValueChange={(value) => handleInputChange('sessionType', value)}
              className="mt-3"
              required
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="individual" 
                    id="individual"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="individual" className="text-blue-900 font-medium cursor-pointer">Individual</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="group" 
                    id="group"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="group" className="text-blue-900 font-medium cursor-pointer">Group</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="online" 
                    id="online"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="online" className="text-blue-900 font-medium cursor-pointer">Online</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="workshop" 
                    id="workshop"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="workshop" className="text-blue-900 font-medium cursor-pointer">Workshop</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Attendance Status */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <Label className="text-blue-900 font-medium">Attendance Status *</Label>
            <RadioGroup 
              value={formData.attendanceStatus} 
              onValueChange={(value) => handleInputChange('attendanceStatus', value)}
              className="mt-3"
              required
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="present" 
                    id="present"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="present" className="text-blue-900 font-medium cursor-pointer">Present</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="late" 
                    id="late"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="late" className="text-blue-900 font-medium cursor-pointer">Late</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="absent" 
                    id="absent"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="absent" className="text-blue-900 font-medium cursor-pointer">Absent</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="excused" 
                    id="excused"
                    className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                  />
                  <Label htmlFor="excused" className="text-blue-900 font-medium cursor-pointer">Excused</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Session Content */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="sessionTopic">Session Topic/Focus *</Label>
              <Input
                id="sessionTopic"
                placeholder="Main topic discussed in this session"
                value={formData.sessionTopic}
                onChange={(e) => handleInputChange('sessionTopic', e.target.value)}
                required
                minLength={3}
              />
            </div>
            <div>
              <Label htmlFor="sessionObjectives">Session Objectives *</Label>
              <Textarea
                id="sessionObjectives"
                placeholder="What were the main objectives or goals of this session?"
                value={formData.sessionObjectives}
                onChange={(e) => handleInputChange('sessionObjectives', e.target.value)}
                rows={2}
                required
                minLength={10}
              />
            </div>
          </div>

          {/* Participation Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-blue-900">Self-Assessment *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <Label className="text-blue-900 font-medium">Participation Level *</Label>
                <RadioGroup 
                  value={formData.participationLevel} 
                  onValueChange={(value) => handleInputChange('participationLevel', value)}
                  className="mt-3"
                  required
                >
                  {['Very Active', 'Active', 'Moderate', 'Passive'].map(level => (
                    <div key={level} className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={level} 
                        id={`participation-${level}`}
                        className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                      />
                      <Label htmlFor={`participation-${level}`} className="text-blue-900 font-medium cursor-pointer">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <Label className="text-blue-900 font-medium">Punctuality *</Label>
                <RadioGroup 
                  value={formData.punctuality} 
                  onValueChange={(value) => handleInputChange('punctuality', value)}
                  className="mt-3"
                  required
                >
                  {['On Time', '5-10 min late', '10+ min late', 'Very Late'].map(time => (
                    <div key={time} className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={time} 
                        id={`punctuality-${time}`}
                        className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                      />
                      <Label htmlFor={`punctuality-${time}`} className="text-blue-900 font-medium cursor-pointer">{time}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Engagement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <Label className="text-blue-900 font-medium">Preparedness for Session *</Label>
              <RadioGroup 
                value={formData.preparedness} 
                onValueChange={(value) => handleInputChange('preparedness', value)}
                className="mt-3"
                required
              >
                {['Well Prepared', 'Prepared', 'Somewhat Prepared', 'Not Prepared'].map(prep => (
                  <div key={prep} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={prep} 
                      id={`prep-${prep}`}
                      className="w-5 h-5 border-2 border-blue-400 text-blue-600"
                    />
                    <Label htmlFor={`prep-${prep}`} className="text-blue-900 font-medium cursor-pointer">{prep}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="questionsAsked">Number of Questions Asked</Label>
              <Select value={formData.questionsAsked} onValueChange={(value) => handleInputChange('questionsAsked', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1-2">1-2</SelectItem>
                  <SelectItem value="3-5">3-5</SelectItem>
                  <SelectItem value="5+">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Follow-up */}
          <div className="space-y-4">
            <div>
              <Label>Follow-up Required?</Label>
              <RadioGroup 
                value={formData.followUpRequired} 
                onValueChange={(value) => handleInputChange('followUpRequired', value)}
              >
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="followup-yes" />
                    <Label htmlFor="followup-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="followup-no" />
                    <Label htmlFor="followup-no">No</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Next Session Planned?</Label>
              <RadioGroup 
                value={formData.nextSessionPlanned} 
                onValueChange={(value) => handleInputChange('nextSessionPlanned', value)}
              >
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="next-yes" />
                    <Label htmlFor="next-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="next-no" />
                    <Label htmlFor="next-no">No</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
            {formData.nextSessionPlanned === 'yes' && (
              <div>
                <Label htmlFor="nextSessionDate">Next Session Date</Label>
                <Input
                  id="nextSessionDate"
                  type="date"
                  value={formData.nextSessionDate}
                  onChange={(e) => handleInputChange('nextSessionDate', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              placeholder="Any additional comments about the session..."
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
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
                <Calendar className="h-4 w-4 mr-2" />
                Submit Attendance
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}