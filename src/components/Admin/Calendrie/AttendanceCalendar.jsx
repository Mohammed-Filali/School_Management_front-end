import { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Tag, Spin, Alert, Button, Select, Space, Typography, Empty, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { ClasseApi } from '../../../service/api/student/admins/ClasseApi';
import { DownloadOutlined, PrinterOutlined, SyncOutlined, FilterOutlined } from '@ant-design/icons';
import './AbsentStudentsPage.css'; // Create this CSS file for custom styles
import { format } from 'date-fns';

const { Title, Text } = Typography;
const { Option } = Select;

const AbsentStudentsPage = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const fetchClasses = async () => {
    try {
      const response = await ClasseApi.all();
      setClasses(response.data.data);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchClasses();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const fetchAttendanceData = async (date = selectedDate) => {
    setLoading(true);
    try {
      const params = { date: format(date, 'yyyy-MM-dd') };
      const response = await axios.get('http://127.0.0.1:8000/api/attendance', { params });
      
      // Assuming response.data.data contains data like shown above
      const data = response.data.data;
      const attendanceForSelectedDate = data[format(date, 'yyyy-MM-dd')] || [];
      setAttendanceData(attendanceForSelectedDate);
      setFilteredData(attendanceForSelectedDate); // You may filter based on class as before
    } catch (error) {
      console.error('Error fetching attendance:', error);
      message.error('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };
  

  const handleClassChange = (value) => {
    if (!value) {
      setSelectedClass(null);
      setFilteredData(attendanceData);
      return;
    }
    
    const selected = classes.find(c => c.id === value);
    setSelectedClass(selected);
    setFilteredData(
      attendanceData.filter(student => student.user?.classe_id === selected.id)
    );
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: ['user', 'name'],
      key: 'student_name',
      render: (text, record) => <Text strong>{record.user?.name || 'Unknown'}</Text>,
      fixed: isMobile ? false : 'left',
      width: 150
    },
    {
      title: 'Class',
      dataIndex: ['user', 'classe_id'],
      key: 'class',
      render: (text, record) => {
        const classInfo = classes.find(c => c.id === record.user?.classe_id);
        return classInfo ? classInfo.name : 'N/A';
      },
      responsive: ['md']
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'present' ? 'green' : 
                status === 'absent' ? 'red' : 
                status === 'late' ? 'orange' : 'default'}
          style={{ fontWeight: 500 }}
        >
          {status?.toUpperCase() || 'UNKNOWN'}
        </Tag>
      ),
      width: 120
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('MMM D, YYYY'),
      responsive: ['md']
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => text || '—',
      ellipsis: true,
      responsive: ['lg']
    }
  ];

  if (error) {
    return (
      <div className="absent-students-container">
        <Alert
          message="Error Loading Data"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
        <Button 
          type="primary" 
          onClick={() => fetchAttendanceData(selectedDate)}
          icon={<SyncOutlined />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="absent-students-container dark:bg-gray-900 dark:text-white">
      <Card className='dark:bg-gray-900 dark:text-white'>
      
          <Space direction="vertical" size="small">
            <Title className='dark:text-white' level={4} style={{ margin: 0 }}>Absent Students</Title>
            <Text className='dark:text-white' type="secondary">{selectedDate.format('MMMM D, YYYY')}</Text>
          </Space>
     
          <Space wrap>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              format="MMM D, YYYY"
              allowClear={false}
              disabledDate={(current) => current && current > moment().endOf('day')}
              size={isMobile ? 'small' : 'middle'}
              style={{ width: isMobile ? 140 : 180 }}
              className='dark:bg-gray-900 dark:text-white'
            />
            <Button
              type="primary"
              onClick={() => fetchAttendanceData(selectedDate)}
              icon={<SyncOutlined />}
              size={isMobile ? 'small' : 'middle'}
              className='dark:bg-gray-900 dark:text-white'
            >
              {isMobile ? '' : 'Refresh'}
            </Button>
          </Space>
        
      
        <div className="filter-section dark:bg-gray-900 dark:text-white">
          <Space wrap className='dark:bg-gray-900 dark:text-white'>
            <Select
              placeholder="Filter by Class"
              allowClear
              showSearch
              optionFilterProp="children"
              style={{ width: isMobile ? 160 : 200 }}
              onChange={handleClassChange}
              size={isMobile ? 'small' : 'middle'}
              suffixIcon={<FilterOutlined />}
              className='dark:bg-gray-900 dark:text-white'
            >
              {classes?.map(classItem => (
                <Option  key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        <Spin spinning={loading} delay={300} className='dark:bg-gray-900 dark:text-white'>
          {filteredData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) => record.id || record.user?.id || Math.random()}
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                hideOnSinglePage: true
              }}
              className='dark:bg-gray-900 dark:text-white'
              scroll={{ x: true }}
              size={isMobile ? 'small' : 'middle'}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      selectedClass 
                        ? `No absent students in ${selectedClass.name}`
                        : 'No absent students for this date'
                    }
                  />
                )
              }}
            />
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className='dark:bg-gray-900 dark:text-white'
              description={
                selectedClass 
                  ? `No absent students in ${selectedClass.name}`
                  : 'Select a class to view absent students'
              }
            />
          )}
        </Spin>

        <div className="action-buttons dark:bg-gray-900 dark:text-white">
          <Space wrap className='dark:bg-gray-900 dark:text-white'> 
            <Button 
              type="default" 
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
              size={isMobile ? 'small' : 'middle'}
              className='dark:bg-gray-900 dark:text-white'
            >
              {isMobile ? '' : 'Print'}
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size={isMobile ? 'small' : 'middle'}
              className='dark:bg-gray-900 dark:text-white'
            >
              {isMobile ? '' : 'Export'}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default AbsentStudentsPage;
