import { Calendar, Badge, Modal, Button, Select, DatePicker, Form, Table, Input, message } from 'antd';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { ClasseApi } from '../../../service/api/student/admins/ClasseApi';
import { PlusOutlined, UserAddOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addAttendances_count } from '../../../redux/admin/adminCountsList';

const AttendanceCalendar = () => {
    const [attendanceData, setAttendanceData] = useState({});
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchAttendanceData();
        fetchClasses();
    }, []);

    const fetchAttendanceData = async (date = null) => {
        setLoading(true);
        try {
            const params = date ? { date: format(date, 'yyyy-MM-dd') } : {};
            const response = await axios.get('http://127.0.0.1:8000/api/attendance', { params });
            setAttendanceData(response.data.data || {});
        } catch (error) {
            console.error('Error fetching attendance:', error);
            message.error('Failed to fetch attendance data');
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await ClasseApi.all();
            setClasses(response.data.data || []);
        } catch (error) {
            console.error('Error fetching classes:', error);
            message.error('Failed to fetch classes');
        }
    };

    const handleDateSelect = (date) => {
        setSelectedDate(moment(date));
        setIsModalVisible(true);
        fetchAttendanceData(date);
    };

    const handleBulkAttendance = () => {
        if (!selectedDate) {
            message.warning('Please select a date first');
            return;
        }
        setIsBulkModalVisible(true);
    };
  const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/attendance', {
                date: moment(selectedDate).format('YYYY-MM-DD'),
                user_id: values.userId,
                status: values.status,
                notes: values.notes || null
            });
            dispatch(addAttendances_count());
            message.success('Attendance recorded successfully');
            fetchAttendanceData(selectedDate);
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error saving attendance:', error);
            message.error('Failed to save attendance');
        }
    };

    const handleBulkSubmit = async (values) => {
        try {
            const attendances = students.map(student => ({
                user_id: student.id,
                status: values[`status_${student.id}`] || 'absent',
                notes: values[`notes_${student.id}`] || null
            }));

            await axios.post('http://127.0.0.1:8000/api/attendance/bulk', {
                date: moment(selectedDate).format('YYYY-MM-DD'),
                attendances
            });

            message.success('Bulk attendance saved successfully');
            fetchAttendanceData(selectedDate);
            setIsBulkModalVisible(false);
        } catch (error) {
            console.error('Error saving bulk attendance:', error);
            message.error('Failed to save bulk attendance');
        }
    };

    const dateCellRender = (value) => {
        const dateStr = format(value, 'yyyy-MM-dd');
        const dayAttendance = attendanceData[dateStr] || [];
        
        return (
            <div className="space-y-1">
                {dayAttendance.slice(0, 2).map((item, index) => (
                    <div key={index} className="truncate text-xs">
                        <Badge 
                            status={item.status === 'present' ? 'success' : 
                                   item.status === 'absent' ? 'error' : 
                                   item.status === 'late' ? 'warning' : 'default'} 
                            text={`${item.user?.name?.split(' ')[0]}: ${item.status.charAt(0).toUpperCase()}`}
                        />
                    </div>
                ))}
                {dayAttendance.length > 2 && (
                    <div className="text-xs text-blue-500">+{dayAttendance.length - 2} more</div>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Calendar</h2>
                <div className="flex gap-2">
                    <Button 
                        icon={<UserAddOutlined />}
                        onClick={handleBulkAttendance}
                        className="flex items-center  dark:bg-gray-900 dark:text-white"
                    >
                        {!isMobile && 'Bulk Attendance'}
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => selectedDate ? setIsModalVisible(true) : message.warning('Please select a date first')}
                        disabled={!selectedDate}
                        className="flex items-center  dark:bg-gray-900 dark:text-white"
                    >
                        {!isMobile && 'Mark Attendance'}
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-900 dark:text-white">
                <Calendar 
                    onSelect={handleDateSelect}
                    dateCellRender={dateCellRender}
                    loading={loading}
                    className="border-0"
                />
            </div>

            {/* Single Attendance Modal */}
            <Modal
                title={<span className="text-lg font-semibold">Mark Attendance</span>}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
                className="rounded-lg "
                bodyStyle={{ padding: '24px' }}
            >
                <Form onFinish={handleSubmit} layout="vertical" className="space-y-4">
                    <Form.Item label="Date" name="date" initialValue={selectedDate}>
                        <DatePicker 
                            value={selectedDate}
                            className="w-full" 
                            disabled
                            onAbort={(date)=> setSelectedDate(date)}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<span className="font-medium">Class</span>}
                        name="classId"
                        rules={[{ required: true, message: 'Please select a class' }]}
                    >
                        <Select 
                            placeholder="Select class" 
                            showSearch 
                            optionFilterProp="label"
                            onChange={(value) => {
                                const selectedClass = classes.find(classItem => classItem.id === value);
                                setStudents(selectedClass ? selectedClass.students : []);
                            }}
                            className="w-full"
                        >
                            {classes?.map(classItem => (
                                <Select.Option key={classItem.id} value={classItem.id} label={classItem.name}>
                                    {classItem.name} 
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                   
                    {students.length > 0 && (
                            <Form.Item
                              label={<span className="font-medium">Student</span>}
                              name="userId"
                              rules={[{ required: true, message: 'Please select at least one student' }]}
                            >
                              <Select
                                placeholder="Select student(s)"
                                showSearch
                                optionFilterProp="label"
                                className="w-full"
                                mode="multiple" // Enable multi-select
                              >
                                {students.map((student) => (
                                  <Select.Option key={student.id} value={student.id} label={student.name}>
                                    {student.name} ({student.classe_id})
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            )}


                    <Form.Item 
                        label={<span className="font-medium">Status</span>}
                        name="status" 
                        rules={[{ required: true, message: 'Please select status' }]}
                        initialValue="present"
                    >
                        <Select placeholder="Select status" className="w-full">
                            <Select.Option value="present">Present</Select.Option>
                            <Select.Option value="absent">Absent</Select.Option>
                            <Select.Option value="late">Late</Select.Option>
                            <Select.Option value="excused">Excused</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={<span className="font-medium">Notes</span>} name="notes">
                        <Input.TextArea 
                            placeholder="Optional notes" 
                            maxLength={255} 
                            className="w-full"
                            rows={3}
                        />
                    </Form.Item>
                    <div className="flex justify-end space-x-3">
                        <Button onClick={() => setIsModalVisible(false)} icon={<CloseOutlined />}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            Save
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Bulk Attendance Modal */}
            <Modal
                title={<span className="text-lg font-semibold">Bulk Attendance</span>}
                visible={isBulkModalVisible}
                onCancel={() => setIsBulkModalVisible(false)}
                width={isMobile ? '95%' : 800}
                footer={null}
                destroyOnClose
                className="rounded-lg bg-gray-900 dark:text-white"
                bodyStyle={{ padding: '24px' }}
            >
                <Form onFinish={handleBulkSubmit} layout="vertical" className="space-y-4">
                    <Form.Item label="Date" name="date" initialValue={selectedDate}>
                        <DatePicker 
                            value={selectedDate}
                            className="w-full" 
                            disabled
                        />
                    </Form.Item>
                    
                    <div className="border rounded-lg overflow-hidden bg-gray-900 dark:text-white">
                        <Table 
                            dataSource={students}
                            rowKey="id"
                            pagination={false}
                            scroll={{ y: 400 }}
                            size="small"
                            className="w-full"
                        >
                            <Table.Column 
                                title={<span className="font-medium">Student</span>} 
                                dataIndex="name" 
                                key="name" 
                                render={(text) => <span className="text-sm">{text}</span>}
                            />
                            <Table.Column 
                                title={<span className="font-medium">Status</span>}
                                key="status" 
                                render={(student) => (
                                    <Form.Item 
                                        name={`status_${student.id}`} 
                                        initialValue="present"
                                        className="mb-0"
                                    >
                                        <Select className="w-full" size="small">
                                            <Select.Option value="present">Present</Select.Option>
                                            <Select.Option value="absent">Absent</Select.Option>
                                            <Select.Option value="late">Late</Select.Option>
                                            <Select.Option value="excused">Excused</Select.Option>
                                        </Select>
                                    </Form.Item>
                                )}
                            />
                            <Table.Column 
                                title={<span className="font-medium">Notes</span>}
                                key="notes" 
                                render={(student) => (
                                    <Form.Item 
                                        name={`notes_${student.id}`} 
                                        className="mb-0"
                                    >
                                        <Input.TextArea 
                                            placeholder="Optional" 
                                            maxLength={255} 
                                            className="w-full"
                                            rows={1}
                                            size="small"
                                        />
                                    </Form.Item>
                                )}
                            />
                        </Table>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button onClick={() => setIsBulkModalVisible(false)} icon={<CloseOutlined />}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                            Save All
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AttendanceCalendar;