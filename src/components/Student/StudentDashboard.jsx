import { 
  BookOpen, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileText,
  ClipboardList,
  BarChart2
} from "lucide-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { TasksApi } from "../../service/api/student/tasksApi";
import { UseUserContext } from "../../context/StudentContext";
import { Progress } from "antd";
import { Link } from "react-router-dom";
import { STUDENT_MANAGE_EXAMS_ROUTE, STUDENT_MANAGE_MOYENNES_ROUTE, STUDENT_MANAGE_RECORDS_ROUTE, STUDENT_MANAGE_TASKS_ROUTE } from "../../router";

const DashboardCard = ({ title, value, icon, trend, trendColor, className }) => (
  <div className={`bg-white rounded-lg border p-6 flex flex-col ${className}`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
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
  const progress = Math.min(Math.round((course.total / 20) * 100), 100); 
  // Assuming max score is 20
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{course.course.name}</h4>
        <span className="text-sm font-semibold">{course.total}/20</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
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
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isPassing ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isPassing ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
        </div>
        <div>
          <h4 className="font-medium">{exam.exams.name}</h4>
          <p className="text-sm text-gray-500">{exam.exams.type.toUpperCase()} • {moment(exam.created_at).format('MMM D')}</p>
        </div>
      </div>
      <span className={`font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
        {exam.note}
      </span>
    </div>
  );
};

const TaskItem = ({ task }) => {
  const priorityColors = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-yellow-600 bg-yellow-100',
    low: 'text-green-600 bg-green-100'
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${priorityColors[task.priority] || 'bg-gray-100 text-gray-600'}`}>
          <ClipboardList size={18} />
        </div>
        <div>
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-gray-500">
            Due: {moment(task.due_date).format('MMM D, YYYY')}
          </p>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
        {task.status}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { user } = UseUserContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data } = await TasksApi.tasks();
        dispatch(setTasks(data));
        
        // Filter tasks for the current student
        const studentTasks = data.filter(
          task => task.taskable_type === 'student' && task.taskable_id === user.id
        );
        setTasks(studentTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Calculate attendance stats
  const totalAttendance = user.attendance?.length || 0;
  const presentCount = user.attendance?.filter(a => a.status === 'present')?.length || 0;
  const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

  // Get latest exams (sorted by date)
  const latestExams = [...(user.records || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  // Get upcoming tasks (not completed, sorted by due date)
  const upcomingTasks = [...tasks]
    .filter(task => task.status !== 'completed')
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
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
          trendColor={attendanceRate >= 80 ? 'text-green-600' : 'text-yellow-600'}
        />
        <DashboardCard 
          title="Active Courses" 
          value={user.moyennes?.length || "0"} 
          icon={<BookOpen size={20} />}
          trend="Currently enrolled"
        />
        <DashboardCard 
          title="Pending Tasks" 
          value={tasks.filter(t => t.status !== 'completed').length} 
          icon={<ClipboardList size={20} />}
          trend="To complete"
          trendColor="text-blue-600"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart2 size={20} />
                Course Progress
              </h2>
              <Link to={STUDENT_MANAGE_MOYENNES_ROUTE} className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {user.moyennes?.length > 0 ? (
                user.moyennes.map((course, index) => (
                  <CourseProgress key={index} course={course} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>No course data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Exams */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Award size={20} />
                Recent Exams
              </h2>
              <Link to={STUDENT_MANAGE_RECORDS_ROUTE} className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {latestExams.length > 0 ? (
                latestExams.map((exam, index) => (
                  <RecentExam key={index} exam={exam} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
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
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock size={20} />
                Upcoming Tasks
              </h2>
              <Link to={STUDENT_MANAGE_TASKS_ROUTE} className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-2">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task, index) => (
                  <TaskItem key={index} task={task} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p>No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Calendar size={20} />
              Attendance Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Present</span>
                <span className="font-medium">{presentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Absent</span>
                <span className="font-medium">{totalAttendance - presentCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Classes</span>
                <span className="font-medium">{totalAttendance}</span>
              </div>
              <div className="mt-4">
                <Progress value={attendanceRate} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
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