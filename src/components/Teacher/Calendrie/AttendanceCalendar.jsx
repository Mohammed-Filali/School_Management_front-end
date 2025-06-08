import { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Tag, Spin, Alert, Button, Select, Space, Typography, Grid } from 'antd';
import moment from 'moment';
import { RefreshCw, Filter, Printer, Download } from 'lucide-react';
import { UseUserContext } from '../../../context/StudentContext';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const TeacherAbsentStudentsPage = () => {
  const screens = useBreakpoint();
  const [selectedDate, setSelectedDate] = useState(moment());
  const [absentStudents, setAbsentStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const { user } = UseUserContext();

  useEffect(() => {
    if (user) {
      extractDataFromUser();
    }
  }, [user, selectedDate]);

  const extractDataFromUser = () => {
    setLoading(true);
    try {
      // Extract classes from user data
      const userClasses = user.classes?.flatMap(teacherClass => 
        teacherClass.class_type?.classe?.map(classe => ({
          ...classe,
          class_name: classe.name
        })) || []
      ) || [];
      setClasses(userClasses);

      // Extract all students with their attendance
      const allStudents = userClasses.flatMap(classe => 
        classe.students?.map(student => ({
          ...student,
          classe_id: classe.id,
          class_name: classe.name,
          // Ensure attendance is properly formatted
          attendance: student.attendance?.map(att => ({
            ...att,
            date: att.date?.split(' ')[0] // Extract just the date part if it includes time
          })) || []
        })) || []
      );

      // Filter absent students for selected date
      const dateKey = selectedDate.format('YYYY-MM-DD');
      const absentData = allStudents.filter(student => 
        student.attendance?.some(att => 
          att.date === dateKey 
        )
      );

      setAbsentStudents(absentData);
      setFilteredData(absentData);
    } catch (err) {
      console.error('Error processing data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (value) => {
    setSelectedClass(value);
    if (!value) {
      setFilteredData(absentStudents);
    } else {
      setFilteredData(absentStudents.filter(student => student.classe_id === value));
    }
    console.log(filteredData);
    
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'student_name',
      render: (text) => text || 'Unknown',
      fixed: screens.md ? false : 'left',
      width: 150
    },
    {
      title: 'Class',
      dataIndex: 'class_name',
      key: 'class',
      render: (text) => text || 'N/A',
      responsive: ['md']
    },
    {
      title: 'Status',
      key: 'status',
      render: (text) => (
        <Tag color="orange" style={{ minWidth: 80, textAlign: 'center' }}>
          {text.attendance?.map((a) => {
            return a.date === selectedDate.format('YYYY-MM-DD') ? a.status : null;
          })}
        </Tag>
      ),
      width: 100
    },
    {
      title: 'Date',
      key: 'date',
      render: () => selectedDate.format('MMM D, YYYY'),
      responsive: ['md']
    },
    {
      title: 'Notes',
      key: 'notes',
      render: (_, record) => {
        const dateKey = selectedDate.format('YYYY-MM-DD');
        const attendance = record.attendance?.find(att => 
          att.date === dateKey
        );
        return attendance?.notes || 'N/A';
      },
      responsive: ['lg']
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg']
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
          style={{ marginBottom: 16 }}
          className='dark:bg-gray-900 dark:text-white'
        />
        <Space>
          <Button 
            type="primary" 
            onClick={extractDataFromUser}
            icon={<RefreshCw size={16} />}
            className='dark:bg-gray-900 dark:text-white'
          >
            Retry
          </Button>
          <Button onClick={() => setError(null)} className='dark:bg-gray-900 dark:text-white'>Dismiss</Button>
        </Space>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card
      className='dark:bg-gray-900 dark:text-white'
        title={
          <Space direction="vertical" size="small" className='dark:bg-gray-900 dark:text-white'>
            <Title level={5} style={{ margin: 0 }} className='dark:text-white'>
              Absent Students
            </Title>
            <Text type="secondary" className='dark:text-white'>
              {selectedDate.format('MMMM D, YYYY')}
            </Text>
          </Space>
        }
        extra={
          <Button
            type="primary"
            onClick={extractDataFromUser}
            icon={<RefreshCw size={16} />}
            loading={loading}
            size={screens.md ? 'middle' : 'small'}
          >
            {screens.md ? 'Refresh' : ''}
          </Button>
        }
      >
        <Space 
          direction={screens.md ? 'horizontal' : 'vertical'} 
          size="middle" 
          style={{ marginBottom: 16, width: '100%' }}
          className='dark:bg-gray-900 dark:text-white'
        >
          <Select
          className='dark:bg-gray-900 dark:text-white'
            placeholder="Select Class"
            showSearch
            optionFilterProp="children"
            style={{ minWidth: screens.md ? 200 : '100%' }}
            onChange={handleClassChange}
            allowClear
            suffixIcon={<Filter size={16} />}
            loading={loading}
          >
            {classes.map(classItem => (
              <Select.Option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </Select.Option>
            ))}
          </Select>

          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            format="MMMM D, YYYY"
            allowClear={false}
            disabledDate={(current) => current && current > moment().endOf('day')}
            style={{ width: screens.md ? 200 : '100%' }}
            className='dark:bg-gray-900 dark:text-white'
          />
        </Space>

        <Spin spinning={loading} className='dark:bg-gray-900 dark:text-white'>
          <Table 
            className='dark:bg-gray-900 dark:text-white'
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} absent students`
            }}
            scroll={{ x: true }}
            locale={{
              emptyText: filteredData.length === 0 
                ? 'No absent students for selected date' 
                : 'No students match your filters'
            }}
            size={screens.md ? 'middle' : 'small'}
          />
        </Spin>

        <Space style={{ marginTop: 16, float: 'right' }} className='dark:bg-gray-900 dark:text-white'>
          <Button 
            icon={<Printer size={16} />} 
            onClick={() => window.print()}
            size={screens.md ? 'middle' : 'small'}
            className='dark:bg-gray-900 dark:text-white'
          >
            {screens.md ? 'Print Report' : ''}
          </Button>
          <Button 
            type="primary" 
            icon={<Download size={16} />}
            size={screens.md ? 'middle' : 'small'}
            className='dark:bg-gray-900 dark:text-white'
          >
            {screens.md ? 'Export' : ''}
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default TeacherAbsentStudentsPage;