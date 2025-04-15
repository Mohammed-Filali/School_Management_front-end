import { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Tag, Spin, Alert, Button, Select, Space, Typography, Empty } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { ClasseApi } from '../../../service/api/student/admins/ClasseApi';
import { DownloadOutlined, PrinterOutlined, SyncOutlined, FilterOutlined } from '@ant-design/icons';
import './AbsentStudentsPage.css'; // Create this CSS file for custom styles

const { Title, Text } = Typography;
const { Option } = Select;

const AbsentStudentsPage = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [absentStudents, setAbsentStudents] = useState([]);
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



  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/attendance', {
        params: { 
          date: selectedDate.format('YYYY-MM-DD'),
          status: 'absent'
        }
      });
      
      let data = [];
      if (response.data?.data) {
        const dateKey = selectedDate.format('YYYY-MM-DD');
        data = Array.isArray(response.data.data[dateKey]) 
          ? response.data.data[dateKey] 
          : Array.isArray(response.data.data) 
            ? response.data.data 
            : [];
      }
      setAbsentStudents(data || []);
      setFilteredData(data || []);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.response?.data?.message || err.message);
      setAbsentStudents([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (value) => {
    if (!value) {
      setSelectedClass(null);
      setFilteredData(absentStudents);
      return;
    }
    
    const selected = classes.find(c => c.id === value);
    setSelectedClass(selected);
    setFilteredData(
      absentStudents.filter(student => student.user?.classe_id === selected.id)
    );
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: ['user', 'name'],
      key: 'student_name',
      render: (text, record) => (
        <Text strong>{record.user?.name || 'Unknown'}</Text>
      ),
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
          onClick={fetchAttendanceData}
          icon={<SyncOutlined />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="absent-students-container">
      <Card
        title={
          <Space direction="vertical" size="small">
            <Title level={4} style={{ margin: 0 }}>Absent Students</Title>
            <Text type="secondary">{selectedDate.format('MMMM D, YYYY')}</Text>
          </Space>
        }
        extra={
          <Space wrap>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              format="MMM D, YYYY"
              allowClear={false}
              disabledDate={(current) => current && current > moment().endOf('day')}
              size={isMobile ? 'small' : 'middle'}
              style={{ width: isMobile ? 140 : 180 }}
            />
            <Button
              type="primary"
              onClick={fetchAttendanceData}
              icon={<SyncOutlined />}
              size={isMobile ? 'small' : 'middle'}
            >
              {isMobile ? '' : 'Refresh'}
            </Button>
          </Space>
        }
      >
        <div className="filter-section">
          <Space wrap>
            <Select
              placeholder="Filter by Class"
              allowClear
              showSearch
              optionFilterProp="children"
              style={{ width: isMobile ? 160 : 200 }}
              onChange={handleClassChange}
              size={isMobile ? 'small' : 'middle'}
              suffixIcon={<FilterOutlined />}
            >
              {classes?.map(classItem => (
                <Option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </Option>
              ))}
            </Select>
          </Space>
        </div>

        <Spin spinning={loading} delay={300}>
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
              description={
                selectedClass 
                  ? `No absent students in ${selectedClass.name}`
                  : 'Select a class to view absent students'
              }
            />
          )}
        </Spin>

        <div className="action-buttons">
          <Space wrap>
            <Button 
              type="default" 
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
              size={isMobile ? 'small' : 'middle'}
            >
              {isMobile ? '' : 'Print'}
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size={isMobile ? 'small' : 'middle'}
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