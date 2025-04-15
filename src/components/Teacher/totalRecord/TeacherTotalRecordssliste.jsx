import { useState, useEffect } from 'react';
import { Table, Card, Divider, Descriptions, Skeleton, Button } from 'antd';
import { UseUserContext } from '../../../context/StudentContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDown, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExamApi } from '../../../service/api/student/teachers/ExamApi';

const TeacherTotalRecords = () => {
  const { user } = UseUserContext();
  const [students, setStudents] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);

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
      total: Number(avg),
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
      <div>
        <h4>Student Details</h4>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Date of Birth">{record.date_of_birth}</Descriptions.Item>
          <Descriptions.Item label="Blood Type">{record.blood_Type}</Descriptions.Item>
          <Descriptions.Item label="Address">{record.adress}</Descriptions.Item>
          <Descriptions.Item label="Phone">{record.phone}</Descriptions.Item>
        </Descriptions>

        <Divider />

        <h4>Exam Records</h4>
        {record.records?.length > 0 ? (
          <Table 
            columns={[
              { title: 'Exam', dataIndex: ['exams', 'name'], key: 'exam_name' },
              { title: 'Type', dataIndex: ['exams', 'type'], key: 'exam_type' },
              { title: 'Date', 
                dataIndex: ['exams', 'created_at'], 
                key: 'exam_date',
                render: (date) => new Date(date).toLocaleDateString()
              },
              { title: 'Score', dataIndex: 'note', key: 'score' },
              { title: 'Comment', dataIndex: 'comment', key: 'comment' },
            ]}
            dataSource={record.records}
            pagination={false}
            rowKey="id"
          />
        ) : (
          <p>No exam records found</p>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-8 w-[300px]" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Teacher Information" loading={loading}>
        <Descriptions>
          <Descriptions.Item label="Name">{user.firsName} {user.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Course">{user.course?.name}</Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-64 justify-between">
              {selectedClass ? selectedClass.name : "Select a Class"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
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
          <Card title={`${selectedClass.name} Students`} loading={loading}>
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
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
        <div className="mt-4">
          {filteredClasses.length > 0 
            ? "Please select a class to view students" 
            : "No classes available for your courses"}
        </div>
      )}
    </div>
  );
};

export default TeacherTotalRecords;