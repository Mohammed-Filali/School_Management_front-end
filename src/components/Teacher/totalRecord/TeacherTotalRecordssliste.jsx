import { useState, useEffect } from 'react';
import { Table, Card, Divider, Descriptions, Skeleton, Button } from 'antd';
import { UseUserContext } from '../../../context/StudentContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExamApi } from '../../../service/api/student/teachers/ExamApi';
import { TeacherApi } from '../../../service/api/student/teacherApi';

const TeacherTotalRecords = () => {
  const { user ,setUser} = UseUserContext();
  const [students, setStudents] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchUser = async () => {
    try {
      const {data} = await TeacherApi.getUser()
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);

    }
  }

  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    if (user?.classes) {
      // Extract all classes from the teacher's classes
      const allClasses = user.classes.flatMap(classe => 
        classe.class_type?.classe?.map(c => ({
          ...c,
          students: c.students?.map(student => ({
            ...student,
            records: getStudentRecords(student.id, user.exams)
          })) || []
        })) || []);
      
      setFilteredClasses(allClasses);
    }
  }, [user]);

  // Helper function to get student records from exams data
  const getStudentRecords = (studentId, exams) => {
    if (!exams) return [];
    return exams.flatMap(exam => 
      exam.records
        ?.filter(record => record.user_id === studentId)
        .map(record => ({
          ...record,
          exams: exam // Include exam details with each record
        })) || []
    );
  };

  const handleAddRecord = async (record, avg) => {
    let data = {
      user_id: Number(record.id),
      total: parseFloat(avg).toFixed(2), // Ensure total has exactly 2 decimal places
      course_id: Number(user.course_id)
    };
    try {
      const response = await ExamApi.createTotal(data);
      toast.success("Record added successfully", response);
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Failed to add record");
    }
  };

  const studentColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Average Score',
      key: 'average',
      render: (_, record) => {
        const scores = record.records?.map(r => r.note) || [];
        const avg = scores.length > 0 
          ? (scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;;
        return (
          <div>
            <span>{avg.toFixed(2)}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddRecord(record, avg.toFixed(2))}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </div>
        );
      },
    },
  ];

  const expandStudentRecord = (record) => {
    return (
      <div className="dark:bg-gray-900 dark:text-white p-4 rounded">
      <h4 className='dark:text-white'>Student Details</h4>
      <Descriptions bordered column={2} className="dark:bg-gray-900 dark:text-white">
        <Descriptions.Item label="Date of Birth" className='dark:text-white'>{record.date_of_birth}</Descriptions.Item>
        <Descriptions.Item label="Blood Type" className='dark:text-white'>{record.blood_Type}</Descriptions.Item>
        <Descriptions.Item label="Address" className='dark:text-white'>{record.adress}</Descriptions.Item>
        <Descriptions.Item label="Phone" className='dark:text-white'>{record.phone}</Descriptions.Item>
      </Descriptions>

      <Divider className="dark:bg-gray-700" />

      <h4 className='dark:text-white'>Exam Records</h4>
      {record.records?.length > 0 ? (
        <Table 
        className='dark:bg-gray-900 dark:text-white'
        columns={[
          { title: <span className="dark:text-white">Exam</span>, dataIndex: ['exams', 'name'], key: 'exam_name' },
          { title: <span className="dark:text-white">Type</span>, dataIndex: ['exams', 'type'], key: 'exam_type' },
          { 
          title: <span className="dark:text-white">Date</span>, 
          dataIndex: ['exams', 'created_at'], 
          key: 'exam_date',
          render: (date) => <span className="dark:text-white">{new Date(date).toLocaleDateString()}</span>
          },
          { title: <span className="dark:text-white">Score</span>, dataIndex: 'note', key: 'score' },
          { title: <span className="dark:text-white">Comment</span>, dataIndex: 'comment', key: 'comment' },
        ]}
        dataSource={record.records}
        pagination={false}
        rowKey="id"
        />
      ) : (
        <p className="dark:text-white">No exam records found</p>
      )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="space-y-4 dark:bg-gray-900 dark:text-white">
        <Skeleton className="h-10 w-[200px] dark:bg-gray-900 dark:text-white" />
        <Skeleton className="h-8 w-[300px] dark:bg-gray-900 dark:text-white" />
        <div className="space-y-2 dark:bg-gray-900 dark:text-white">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full dark:bg-gray-900 dark:text-white" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Teacher Information" className='dark:bg-gray-900 dark:text-white' loading={loading}>
        <Descriptions className='dark:bg-gray-900 dark:text-white'>
          <Descriptions.Item label="Name" className='dark:text-white'>{user.firsName} {user.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email" className='dark:text-white'>{user.email}</Descriptions.Item>
          <Descriptions.Item label="Course" className='dark:text-white'>{user.course?.name}</Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 dark:bg-gray-900 dark:text-white">
        <DropdownMenu >
          <DropdownMenuTrigger asChild className='bg-white'>
            <Button variant="outline" className="w-full sm:w-64 justify-between dark:bg-gray-900 dark:text-white">
              {selectedClass ? selectedClass.name : "Select a Class"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger >
          <DropdownMenuContent className="w-64 dark:bg-gray-900 dark:text-white">
            {filteredClasses.length > 0 ? (
              filteredClasses.map(classItem => (
                <DropdownMenuItem
                  key={classItem.id}
                  onSelect={() => {
                    setSelectedClass(classItem);
                    setStudents(classItem.students || []);
                  }}
                  className="cursor-pointer"
                >
                  {classItem.name} ({classItem.class_type_name})
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                No Classes Available
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedClass ? (
        <>
          <Divider />
          <Card title={`${selectedClass.name} Students`} loading={loading} className='dark:bg-gray-900 dark:text-white' >
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              className='dark:bg-gray-900 dark:text-white'
              expandable={{
                expandedRowRender: expandStudentRecord,
                rowExpandable: (record) => record.records?.length > 0,
              }}
              locale={{
                emptyText: 'No students found in this class'
              }}
            />
          </Card>
        </>
      ) : (
        <div className="mt-4 dark:bg-gray-900 dark:text-white">
          {filteredClasses.length > 0 
            ? "Please select a class to view students" 
            : "No classes available for your courses"}
        </div>
      )}
    </div>
  );
};

export default TeacherTotalRecords;