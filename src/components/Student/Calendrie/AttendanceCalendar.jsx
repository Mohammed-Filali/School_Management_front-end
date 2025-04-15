import { useState, useEffect } from 'react';
import { Table, DatePicker, Card, Tag, Spin, Alert, Button, Row, Col, Typography, Space, Badge } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { UseUserContext } from '../../../context/StudentContext';
import './StudentAttendancePage.css'; // Create this CSS file for custom styles
import { Calendar, Printer, RefreshCw } from 'lucide-react';
const { Title, Text } = Typography;

const StudentAttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });
  const { user } = UseUserContext();

  useEffect(() => {
    if (user?.id) {
      fetchAttendanceData();
    }
    const stats = {
      present: user.present_count,
      absent: user.absent_count,
      late: user.late_count
    };
    setStats(stats);
  
  }, [selectedDate, user?.id]);

  const fetchAttendanceData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/api/attendance', {
        params: { 
          date: selectedDate.format('YYYY-MM-DD'),
          user_id: user.id
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

      // Filter to show only the current student's records
      const studentRecords = data.filter(item => item.user_id === user.id);
      setAttendanceData(studentRecords || []);

      // Calculate stats
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.response?.data?.message || err.message);
      setAttendanceData([]);
      setStats({ present: 0, absent: 0, late: 0 });
    } finally {
      setLoading(false);
    }
  };


  

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('ddd, MMM D, YYYY'),
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
      )
    },
    {
      title: 'Class',
      dataIndex: ['user', 'classe_id'],
      key: 'class',
      render: (text, record) => `Class ${record.user?.classe_id || 'N/A'}`,
      responsive: ['md']
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => text || '—',
      ellipsis: true
    }
  ];

  if (error) {
    return (
      <div className="attendance-container">
        <Alert
          message="Error Loading Attendance Data"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 24 }}
        />
        <Button 
          type="primary" 
          onClick={fetchAttendanceData}
          icon={<RefreshCw />}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col xs={24} md={12}>
          <Title level={3} className="attendance-title">
            My Attendance Records
          </Title>
          <Text type="secondary">
            View and track your attendance history
          </Text>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              format="MMMM D, YYYY"
              allowClear={false}
              disabledDate={(current) => current && current > moment().endOf('day')}
              suffixIcon={<Calendar />}
              style={{ width: 200 }}
              size="large"
            />
            <Button
              type="default"
              onClick={fetchAttendanceData}
              icon={<RefreshCw />}
              size="large"
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Text type="secondary">Present</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#52c41a' }}>
              {stats.present}
            </Title>
            <Badge color="#52c41a" text={`${stats.present} days`} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Text type="secondary">Absent</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#f5222d' }}>
              {stats.absent}
            </Title>
            <Badge color="#f5222d" text={`${stats.absent} days`} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="stat-card">
            <Text type="secondary">Late</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#fa8c16' }}>
              {stats.late}
            </Title>
            <Badge color="#fa8c16" text={`${stats.late} days`} />
          </Card>
        </Col>
      </Row>

      <Card 
        className="attendance-card"
        style={{ marginTop: 24 }}
        title={
          <Text strong>
            Records for {selectedDate.format('MMMM YYYY')}
          </Text>
        }
        extra={
          <Button 
            type="text" 
            icon={<Printer />} 
            onClick={() => window.print()}
          >
            Print
          </Button>
        }
      >
        <Spin spinning={loading} tip="Loading attendance data...">
          <Table
            columns={columns}
            dataSource={Array.isArray(attendanceData) ? attendanceData : []}
            rowKey={(record) => record.id || record.user?.id || Math.random()}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: false,
              hideOnSinglePage: true
            }}
            scroll={{ x: true }}
            locale={{
              emptyText: (
                <div style={{ padding: 24, textAlign: 'center' }}>
                  <Text type="secondary">
                    No attendance records found for this date
                  </Text>
                </div>
              )
            }}
            size="middle"
          />
        </Spin>
      </Card>
    </div>
  );
};

export default StudentAttendancePage;