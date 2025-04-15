import { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Tag, Spin, Alert, Button } from 'antd';
import moment from 'moment';
import { UseUserContext } from '../../../context/StudentContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, User, Calendar, Frown, Smile, Clock } from 'lucide-react';

const ParentAbsentStudentsPage = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = UseUserContext();
  const [selectedStudent, setSelectedStudent] = useState(
    user?.students?.[0] || null
  );

  // Get attendance records for the selected student and date
  const getFilteredAttendance = () => {
    if (!selectedStudent) return [];
    
    const dateStr = selectedDate.format('YYYY-MM-DD');
    return selectedStudent.attendance?.filter(record => 
      record.date === dateStr
    ) || [];
  };

  const attendanceRecords = getFilteredAttendance();

  const columns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'student_name',
      render: () => selectedStudent?.name || 'Unknown'
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      render: () => `Class ${selectedStudent?.classe_id || 'N/A'}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let icon, color;
        switch(status) {
          case 'present':
            icon = <Smile className="inline mr-1" size={16} />;
            color = 'green';
            break;
          case 'absent':
            icon = <Frown className="inline mr-1" size={16} />;
            color = 'red';
            break;
          case 'late':
            icon = <Clock className="inline mr-1" size={16} />;
            color = 'orange';
            break;
          default:
            icon = null;
            color = 'default';
        }
        
        return (
          <Tag color={color}>
            {icon}
            {status?.toUpperCase() || 'UNKNOWN'}
          </Tag>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <div className="flex items-center">
          <Calendar className="mr-1" size={16} />
          {moment(date).format('MMMM D, YYYY')}
        </div>
      )
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => text || 'N/A'
    }
  ];

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
        <Button 
          type="primary" 
          onClick={() => setError(null)}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Student
        </label>
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 p-3 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span>{selectedStudent?.name || "Select a Student"}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white rounded-md shadow-lg border border-gray-200 mt-1 overflow-hidden z-50">
            {user?.students?.length > 0 ? (
              user.students.map((student) => (
                <DropdownMenuItem
                  key={student.id}
                  onSelect={() => setSelectedStudent(student)}
                  className="cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100 focus:bg-gray-100 outline-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-gray-500">
                        Class {student.classe_id}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem
                disabled
                className="px-4 py-2 text-gray-500 text-sm"
              >
                No Students Available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedStudent ? (
        <>
          <div className="mb-6 flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date || moment())}
                format="MMMM D, YYYY"
                allowClear={false}
                disabledDate={(current) => current && current > moment().endOf('day')}
                className="w-full"
              />
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Attendance Summary</h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Present Days:</span>
                  <span className="font-medium">
                    {selectedStudent.attendance?.filter(a => a.status === 'present').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Absent Days:</span>
                  <span className="font-medium">
                    {selectedStudent.attendance?.filter(a => a.status === 'absent').length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Card
            title={
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>
                  {selectedStudent.name}'s Attendance - {selectedDate.format('MMMM D, YYYY')}
                </span>
              </div>
            }
            className="overflow-x-auto"
            extra={
              <Button 
                type="primary" 
                onClick={() => window.print()}
                className="print:hidden"
              >
                Print Report
              </Button>
            }
          >
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={attendanceRecords}
                rowKey={(record) => record.id}
                pagination={false}
                scroll={{ x: true }}
                locale={{
                  emptyText: (
                    <div className="py-8 text-center text-gray-500">
                      <Calendar className="mx-auto h-8 w-8 mb-2" />
                      <p>No attendance records found for this date</p>
                    </div>
                  )
                }}
              />
            </Spin>
          </Card>

          {/* Student Performance Summary */}
          {selectedStudent.records?.length > 0 && (
            <Card
              title="Recent Exam Results"
              className="mt-6"
            >
              <div className="space-y-4">
                {selectedStudent.records.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                    <div>
                      <h4 className="font-medium">{record.exams.name}</h4>
                      <p className="text-sm text-gray-500">
                        {record.exams.course.name} • {moment(record.created_at).format('MMM D')}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${
                      record.note >= 10 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.note}/20
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No students found in your account.</p>
          <p className="text-sm text-gray-500 mt-2">Please contact the school if this is incorrect.</p>
        </div>
      )}
    </div>
  );
};

export default ParentAbsentStudentsPage;