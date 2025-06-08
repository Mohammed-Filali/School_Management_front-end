import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle, 
  AlertCircle,
  FileText,
  ClipboardList,
  BarChart2
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { TasksApi } from "../../service/api/student/tasksApi";
import { UseUserContext } from "../../context/StudentContext";
import { Progress } from "antd";
import { Link } from "react-router-dom";
import {  STUDENT_MANAGE_MOYENNES_ROUTE, STUDENT_MANAGE_RECORDS_ROUTE, STUDENT_MANAGE_TASKS_ROUTE } from "../../router";

const DashboardCard = ({ title, value, icon, trend, trendColor, className }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6 flex flex-col ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
      </div>
      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
    </div>
    {trend && (
      <div className="flex items-center text-xs mt-auto">
        <span className={`flex items-center ${trendColor}`}>
          {trend}
        </span>
      </div>
    )}
  </div>
);

const CourseProgress = ({ course }) => {
  const total = parseFloat(course?.total ?? "0");
  const progress = Math.min(Math.round((total / 20) * 100), 100);
  console.log("Course Progress:", course, progress);
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white">{course.course.name}</h4>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{total}/20</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
            progress >= 75
              ? "bg-green-500"
              : progress >= 50
              ? "bg-yellow-400"
              : "bg-red-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{progress}%</div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
        <span>0</span>
        <span>20</span>
      </div>
    </div>
  );
};

const RecentExam = ({ exam }) => {
  const score = parseFloat(exam.note);
  const isPassing = score >= 10; // Assuming passing is 10/20
  
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isPassing ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'}`}>
          {isPassing ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{exam.exams.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{exam.exams.type.toUpperCase()} • {moment(exam.created_at).format('MMM D')}</p>
        </div>
      </div>
      <span className={`font-bold ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {exam.note}
      </span>
    </div>
  );
};

const TaskItem = ({ task }) => {
  const priorityColors = {
    high: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
    medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900',
    low: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900'
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${priorityColors[task.priority] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
          <ClipboardList size={18} />
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Due: {moment(task.due_date).format('MMM D, YYYY')}
          </p>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-400'}`}>
        {task.status}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = UseUserContext();
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    TasksApi.tasks().then(({ data }) => {
      const filteredTasks = data.filter(
        (t) => t.taskable_type === user.role && t.taskable_id === user.id
      );
      setTasks(filteredTasks); // ✅ Ici la correction
    });
  }, [user]);

  // Calculate attendance stats
  const totalAttendance = user.attendance?.length || 0;
  const presentCount = user.attendance?.filter(a => a.status === 'absent')?.length || 0;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  // Get latest exams (sorted by date)
  const latestExams = [...(user.records || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  // Get upcoming tasks (not completed, sorted by due date)
  const upcomingTasks = [...tasks]
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Student Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Current GPA" 
          value={user.moyennes?.length || "N/A"} 
          icon={<Award size={20} />}
          trend="Based on your latest results"
        />
        <DashboardCard 
          title="Attendance Rate" 
          value={`${attendanceRate}%`} 
          icon={<Calendar size={20} />}
          trend={`${presentCount} of ${totalAttendance} classes`}
          trendColor={attendanceRate >= 80 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}
        />
        <DashboardCard 
          title="Active Courses" 
          value={user?.classe?.class_type_courses?.length || "0"} 
          icon={<BookOpen size={20} />}
          trend="Currently enrolled"
        />
        <DashboardCard 
          title="Pending Tasks" 
          value={tasks.length} 
          icon={<ClipboardList size={20} />}
          trend="Total tasks from API"
          trendColor="text-blue-600 dark:text-blue-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <BarChart2 size={20} />
                Course Progress
              </h2>
              <Link to={STUDENT_MANAGE_MOYENNES_ROUTE} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {user.moyennes?.length > 0 ? (
                user.moyennes.map((course, index) => (
                  <CourseProgress key={index} course={course} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>No course data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Exams */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Award size={20} />
                Recent Exams
              </h2>
              <Link to={STUDENT_MANAGE_RECORDS_ROUTE} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {latestExams.length > 0 ? (
                latestExams.map((exam, index) => (
                  <RecentExam key={index} exam={exam} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>No exam results available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Clock size={20} />
                Upcoming Tasks
              </h2>
              <Link to={STUDENT_MANAGE_TASKS_ROUTE} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task, index) => (
                  <TaskItem key={index} task={task} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <Calendar size={20} />
              Attendance Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Absent</span>
                <span className="font-medium text-gray-900 dark:text-white">{presentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Present</span>
                <span className="font-medium text-gray-900 dark:text-white">{totalAttendance - presentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Classes</span>
                <span className="font-medium text-gray-900 dark:text-white">{totalAttendance}</span>
              </div>
              <div className="mt-4">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                    attendanceRate >= 75
                      ? "bg-green-500"
                      : attendanceRate >= 50
                      ? "bg-yellow-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${attendanceRate}%` }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
