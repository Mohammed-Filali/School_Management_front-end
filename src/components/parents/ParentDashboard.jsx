// Add "dark:" Tailwind classes for dark mode support

import  { useState } from 'react';
import { 
  Users,
  Award, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  FileText,
  ClipboardList,
  BarChart2,
  Loader2
} from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Progress } from "antd";
import { UseUserContext } from '../../context/StudentContext';

const DashboardCard = ({ title, value, icon, trend, trendColor, className }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6 flex flex-col ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
      </div>
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
    </div>
    {trend && (
      <div className="flex items-center text-xs mt-auto">
        <span className={`flex items-center ${trendColor}`}>{trend}</span>
      </div>
    )}
  </div>
);

const StudentCard = ({ student, isActive, onClick }) => {
  return (
    <div 
      className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
        isActive 
          ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-400' 
          : 'bg-white dark:bg-gray-900 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 p-3 rounded-full mr-4">
        <Users size={20} />
      </div>
      <div>
        <h3 className="font-medium dark:text-white">{student.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Class {student.classe_id}</p>
      </div>
    </div>
  );
};

const CourseProgress = ({ course }) => {
  const progress = Math.min(Math.round((course.total / 20) * 100), 100);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium dark:text-white">{course.course.name}</h4>
        <span className="text-sm font-semibold dark:text-white">{course.total}/20</span>
      </div>
      <Progress percent={progress} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>0</span>
        <span>20</span>
      </div>
    </div>
  );
};

const RecentExam = ({ exam }) => {
  const score = parseFloat(exam.note);
  const isPassing = score >= 10;
  
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isPassing ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
          {isPassing ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        </div>
        <div>
          <h4 className="font-medium dark:text-white">{exam.exams.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{exam.exams.type.toUpperCase()} • {moment(exam.created_at).format('MMM D')}</p>
        </div>
      </div>
      <span className={`font-bold ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {exam.note}
      </span>
    </div>
  );
};

const AttendanceItem = ({ record }) => {
  const statusColors = {
    present: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    absent: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400',
    excused: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${statusColors[record.status] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          <Calendar size={18} />
        </div>
        <div>
          <h4 className="font-medium dark:text-white">{moment(record.date).format('MMMM D, YYYY')}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{record.status}</p>
        </div>
      </div>
      {record.notes && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{record.notes}</span>
      )}
    </div>
  );
};

const ParentDashboard = () => {
  const {user:parentData} = UseUserContext()
  if (!parentData || !parentData.students) {
    return (
      <div className=" h-screen w-full py-10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
        </div>
    );
  }

  const [selectedStudentId, setSelectedStudentId] = useState(parentData.students[0]?.id || null);
  const selectedStudent = parentData.students.find(student => student.id === selectedStudentId);
  // Calculate attendance stats
  const totalAttendance = selectedStudent?.attendance?.length || 0;
  const presentCount = selectedStudent?.attendance?.filter(a => a.status === 'absent')?.length || 0;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  // Get latest exams
  const latestExams = [...(selectedStudent?.records || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  // Get recent attendance
  const recentAttendance = [...(selectedStudent?.attendance || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Parent Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome, {parentData.firsName} {parentData.lastName}</p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Blood Type: {parentData.blood_Type}</p>
          <p>Phone: {parentData.phone}</p>
        </div>
      </div>

      {/* Children Selector */}
      <div>
        <h2 className="text-lg font-semibold mb-3 dark:text-white">My Children</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parentData.students?.map(student => (
            <StudentCard 
              key={student.id}
              student={student}
              isActive={selectedStudentId === student.id}
              onClick={() => setSelectedStudentId(student.id)}
            />
          ))}
        </div>
      </div>

      {selectedStudent && (
        <>
          {/* Selected Student Info */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold dark:text-white">{selectedStudent.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">Class {selectedStudent.classe_id} • {selectedStudent.gender === 'm' ? 'Male' : 'Female'} • {moment(selectedStudent.date_of_birth).format('MMM D, YYYY')}</p>
              </div>
              <div className="text-sm">
                <p className="dark:text-white">Blood Type: {selectedStudent.blood_Type}</p>
                <p className="dark:text-white">Phone: {selectedStudent.phone}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title="Average Grade" 
              value={selectedStudent.moyennes? selectedStudent.moyennes.length : 'N/A'} 
              icon={<Award size={20} />}
              trend="Current course average"
            />
            <DashboardCard 
              title="Attendance Rate" 
              value={`${attendanceRate}%`} 
              icon={<Calendar size={20} />}
              trend={`${presentCount} of ${totalAttendance} classes`}
              trendColor={attendanceRate >= 80 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}
            />
            <DashboardCard 
              title="Recent Recors" 
              value={selectedStudent.records.length} 
              icon={<FileText size={20} />}
              trend="Total exams recorded"
            />
            <DashboardCard 
              title="Blood Type" 
              value={selectedStudent.blood_Type} 
              icon={<ClipboardList size={20} />}
              trend="Medical information"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Progress */}
              {selectedStudent.moyennes.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                    <BarChart2 size={20} />
                    Course Progress
                  </h2>
                  <div className="space-y-4">
                    {selectedStudent.moyennes.map((course, index) => (
                      <CourseProgress key={index} course={course} />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Exams */}
              {latestExams.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                    <Award size={20} />
                    Recent Exams
                  </h2>
                  <div className="space-y-2">
                    {latestExams.map((exam, index) => (
                      <RecentExam key={index} exam={exam} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Attendance */}
              {recentAttendance.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                    <Calendar size={20} />
                    Recent Attendance
                  </h2>
                  <div className="space-y-2">
                    {recentAttendance.map((record, index) => (
                      <AttendanceItem key={index} record={record} />
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Info */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 dark:text-white">
                  <ClipboardList size={20} />
                  Medical Information
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Blood Type</span>
                    <span className="font-medium dark:text-white">{selectedStudent.blood_Type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date of Birth</span>
                    <span className="font-medium dark:text-white">{moment(selectedStudent.date_of_birth).format('MMM D, YYYY')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gender</span>
                    <span className="font-medium capitalize dark:text-white">{selectedStudent.gender === 'm' ? 'Male' : 'Female'}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t dark:border-gray-700">
                    <h4 className="font-medium mb-2 dark:text-white">Emergency Contact</h4>
                    <p className="text-sm dark:text-gray-400">{parentData.firsName} {parentData.lastName}</p>
                    <p className="text-sm dark:text-gray-400">{parentData.phone}</p>
                    <p className="text-sm dark:text-gray-400">{parentData.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ParentDashboard;