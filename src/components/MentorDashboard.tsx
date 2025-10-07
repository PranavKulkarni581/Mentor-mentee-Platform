import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Users, FileText, Calendar, GraduationCap, Search, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';

interface MentorDashboardProps {
  onLogout: () => void;
  user: any;
  accessToken: string;
}

interface Mentee {
  prn: string;
  name: string;
  batch?: string;
  department?: string;
  hasInteraction?: boolean;
  hasAcademic?: boolean;
  submitted_at?: string;
}

export function MentorDashboard({ onLogout, user, accessToken }: MentorDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMentee, setSelectedMentee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMentees();
  }, []);

  const fetchMentees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-84115a1d/mentor/mentees`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch mentees');
      }

      setMentees(data.mentees || []);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      toast.error('Failed to fetch mentees data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenteeDetails = async (prn: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-84115a1d/mentor/mentee/${prn}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch mentee details');
      }

      setSelectedMentee(data);
      setActiveTab('details');
    } catch (error) {
      console.error('Error fetching mentee details:', error);
      toast.error('Failed to fetch mentee details');
    }
  };

  const filteredMentees = mentees.filter(mentee =>
    mentee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.prn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.batch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalMentees: mentees.length,
    withInteractions: mentees.filter(m => m.hasInteraction).length,
    withAcademic: mentees.filter(m => m.hasAcademic).length,
    pendingSubmissions: mentees.filter(m => !m.hasInteraction || !m.hasAcademic).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onLogout}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Mentor Dashboard</h1>
                <p className="text-blue-600">Welcome, {user?.user_metadata?.name || user?.email}</p>
              </div>
            </div>
            <Button 
              onClick={fetchMentees}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedMentee}>
              {selectedMentee ? `${selectedMentee.prn} Details` : 'Mentee Details'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Total Mentees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800">{stats.totalMentees}</div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-green-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">{stats.withInteractions}</div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-purple-900 flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Academic Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-800">{stats.withAcademic}</div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-orange-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-800">{stats.pendingSubmissions}</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="bg-white border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">Mentees Management</CardTitle>
                <CardDescription className="text-blue-600">
                  View and manage your assigned mentees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Mentees</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, PRN, or batch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                {/* Mentees Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PRN</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Submission</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Loading mentees...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredMentees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-blue-600">
                            {searchTerm ? 'No mentees found matching your search.' : 'No mentees found.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMentees.map((mentee) => (
                          <TableRow key={mentee.prn}>
                            <TableCell className="font-medium">{mentee.prn}</TableCell>
                            <TableCell>{mentee.name}</TableCell>
                            <TableCell>{mentee.batch || '-'}</TableCell>
                            <TableCell>{mentee.department || '-'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {mentee.hasInteraction && (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    Interaction
                                  </Badge>
                                )}
                                {mentee.hasAcademic && (
                                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                                    Academic
                                  </Badge>
                                )}
                                {!mentee.hasInteraction && !mentee.hasAcademic && (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                    No Data
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {mentee.submitted_at ? new Date(mentee.submitted_at).toLocaleDateString() : '-'}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => fetchMenteeDetails(mentee.prn)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {selectedMentee && (
              <>
                <Card className="bg-white border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-900">
                      Mentee Details - {selectedMentee.prn}
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Complete information about the selected mentee
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="academic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="academic">Academic Details</TabsTrigger>
                        <TabsTrigger value="interactions">Interactions</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                      </TabsList>

                      <TabsContent value="academic" className="space-y-4">
                        {selectedMentee.academic ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>Name:</strong> {selectedMentee.academic.name}</div>
                                <div><strong>PRN:</strong> {selectedMentee.academic.prn}</div>
                                <div><strong>Batch:</strong> {selectedMentee.academic.batch}</div>
                                <div><strong>Department:</strong> {selectedMentee.academic.department}</div>
                                <div><strong>Current Semester:</strong> {selectedMentee.academic.currentSemester}</div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Academic Performance</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>Current CGPA:</strong> {selectedMentee.academic.currentSemesterCGPA || 'N/A'}</div>
                                <div><strong>Previous GPA:</strong> {selectedMentee.academic.previousSemesterGPA || 'N/A'}</div>
                                <div><strong>Backlogs:</strong> {selectedMentee.academic.backlogs || '0'}</div>
                                {selectedMentee.academic.backlogSubjects && (
                                  <div><strong>Backlog Subjects:</strong> {selectedMentee.academic.backlogSubjects}</div>
                                )}
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">12th Grade Details</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>Board:</strong> {selectedMentee.academic.twelfthBoard || 'N/A'}</div>
                                <div><strong>Percentage:</strong> {selectedMentee.academic.twelfthPercentage || 'N/A'}%</div>
                                <div><strong>Passing Year:</strong> {selectedMentee.academic.twelfthPassingYear || 'N/A'}</div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Contact Information</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>Email:</strong> {selectedMentee.academic.personalEmail || 'N/A'}</div>
                                <div><strong>Contact:</strong> {selectedMentee.academic.contactNumber || 'N/A'}</div>
                                <div><strong>Alternate:</strong> {selectedMentee.academic.alternateContact || 'N/A'}</div>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-blue-600">
                            No academic details submitted yet.
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="interactions" className="space-y-4">
                        {selectedMentee.interactions && selectedMentee.interactions.length > 0 ? (
                          <div className="space-y-4">
                            {selectedMentee.interactions.map((interaction: any, index: number) => (
                              <Card key={index}>
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Interaction - {new Date(interaction.submitted_at).toLocaleDateString()}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div><strong>Meeting Date:</strong> {interaction.meetingDate || 'N/A'}</div>
                                  <div><strong>Meeting Type:</strong> {interaction.meetingType || 'N/A'}</div>
                                  <div><strong>Discussion Topics:</strong> {interaction.discussionTopics?.join(', ') || 'N/A'}</div>
                                  {interaction.difficulties && (
                                    <div><strong>Difficulties:</strong> {interaction.difficulties}</div>
                                  )}
                                  {interaction.suggestions && (
                                    <div><strong>Suggestions:</strong> {interaction.suggestions}</div>
                                  )}
                                  <div><strong>Overall Rating:</strong> {interaction.overallRating || 'N/A'}/5</div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-blue-600">
                            No interactions recorded yet.
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="attendance" className="space-y-4">
                        {selectedMentee.attendance && selectedMentee.attendance.length > 0 ? (
                          <div className="space-y-4">
                            {selectedMentee.attendance.map((record: any, index: number) => (
                              <Card key={index}>
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Attendance - {new Date(record.submitted_at).toLocaleDateString()}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div><strong>Status:</strong> {record.attendanceStatus || 'N/A'}</div>
                                  <div><strong>Session Date:</strong> {record.sessionDate || 'N/A'}</div>
                                  {record.remarks && <div><strong>Remarks:</strong> {record.remarks}</div>}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-blue-600">
                            No attendance records found.
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}