import { Calendar, Badge, Modal, Button, Select, DatePicker, Form, Table, Input, message } from 'antd';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { UseUserContext } from '../../../context/StudentContext';
import { 
  Calendar as CalendarIcon,
  UserPlus,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  NotebookPen,
  Save,
  ChevronDown,
  Search
} from 'lucide-react';

const TeacherAttendanceCalendar = () => {
    const [attendanceData, setAttendanceData] = useState({});
    const [students, setStudents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = UseUserContext();

    // Extract classes from the user data structure
    const classes = user?.classes?.flatMap(teacherClass => {
        if (teacherClass.class_type && Array.isArray(teacherClass.class_type.classe)) {
          return teacherClass.class_type.classe.map(classe => ({
            id: classe.id,
            name: classe.name,
            students: classe.students || [],
            class_type_name: teacherClass.class_type.name,
            course_name: user.course.name
          }));
        }
        return [];
      }) || [];
      

    useEffect(() => {
        fetchAttendanceData();
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

    const handleSubmit = async (values) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/attendance', {
                date: moment(selectedDate).format('YYYY-MM-DD'),
                user_id: values.userId,
                status: values.status,
                notes: values.notes || null
            });
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
            <div className="events">
                {dayAttendance.slice(0, 2).map((item, index) => (
                    <div key={index}>
                        <Badge 
                            status={item.status === 'present' ? 'success' : 
                                   item.status === 'absent' ? 'error' : 
                                   item.status === 'late' ? 'warning' : 'default'} 
                            text={`${item.user?.name}: ${item.status}`}
                        />
                    </div>
                ))}
                {dayAttendance.length > 2 && (
                    <Badge count={`+${dayAttendance.length - 2} more`} style={{ backgroundColor: '#1890ff' }} />
                )}
            </div>
        );
    };

    return (
        <div className="p-4 dark:bg-gray-900 dark:text-white">
            <div className="flex justify-between mb-4 dark:bg-gray-900 dark:text-white">
                <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                    <CalendarIcon className="h-5 w-5" />
                    Attendance Calendar
                </h2>
                <div className="space-x-2">
                    <Button 
                        icon={<Users className="h-4 w-4" />} 
                        onClick={handleBulkAttendance}
                        className='dark:bg-gray-900 dark:text-white'
                    >
                        Bulk Attendance
                    </Button>
                    <Button 
                        type="primary" 
                        icon={<UserPlus className="h-4 w-4" />}
                        onClick={() => selectedDate ? setIsModalVisible(true) : message.warning('Please select a date first')}
                        disabled={!selectedDate}
                        className='dark:bg-gray-900 dark:text-white'
                    >
                        Mark Attendance
                    </Button>
                </div>
            </div>

            <Calendar 
                onSelect={handleDateSelect}
                dateCellRender={dateCellRender}
                loading={loading}
                className='dark:bg-gray-900 dark:text-white'
            />

            {/* Single Attendance Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 ">
                        <UserPlus className="h-5 w-5" />
                        <span>Mark Attendance</span>
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form onFinish={handleSubmit} layout="vertical">
                    <Form.Item label="Date" name="date" initialValue={selectedDate}>
                        <DatePicker 
                            value={selectedDate}
                            style={{ width: '100%' }} 
                            disabled
                            suffixIcon={<CalendarIcon className="h-4 w-4 opacity-50" />}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Class"
                        name="classId"
                        rules={[{ required: true, message: 'Please select a class' }]}
                    >
                        <Select 
                            placeholder="Select class" 
                            showSearch 
                            optionFilterProp="label"
                            suffixIcon={<ChevronDown className="h-4 w-4 opacity-50" />}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(value) => {
                                const selectedClass = classes.find(classItem => classItem.id === value);
                                setStudents(selectedClass ? selectedClass.students : []);
                            }}
                        >
                            {classes.map(classItem => (
                                <Select.Option 
                                    key={classItem.id} 
                                    value={classItem.id} 
                                    label={`${classItem.class_type_name} - ${classItem.name}`}
                                >
                                    {classItem.class_type_name} - {classItem.name}
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
                        label="Status" 
                        name="status" 
                        rules={[{ required: true, message: 'Please select status' }]}
                        initialValue="present"
                    >
                        <Select 
                            placeholder="Select status"
                            suffixIcon={<ChevronDown className="h-4 w-4 opacity-50" />}
                        >
                            <Select.Option value="present">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Present
                                </div>
                            </Select.Option>
                            <Select.Option value="absent">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    Absent
                                </div>
                            </Select.Option>
                            <Select.Option value="late">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    Late
                                </div>
                            </Select.Option>
                            <Select.Option value="excused">
                                <div className="flex items-center gap-2">
                                    <NotebookPen className="h-4 w-4 text-blue-500" />
                                    Excused
                                </div>
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Notes" name="notes">
                        <Input.TextArea 
                            placeholder="Optional notes" 
                            maxLength={255} 
                            rows={3}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" icon={<Save className="h-4 w-4" />}>
                        Save
                    </Button>
                </Form>
            </Modal>

            {/* Bulk Attendance Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2" >
                        <Users className="h-5 w-5" />
                        <span>Bulk Attendance</span>
                    </div>
                }
                open={isBulkModalVisible}
                onCancel={() => setIsBulkModalVisible(false)}
                width={800}
                footer={null}
                destroyOnClose
            >
                <Form onFinish={handleBulkSubmit} layout="vertical">
                    <Form.Item label="Date" name="date" initialValue={selectedDate}>
                        <DatePicker 
                            value={selectedDate}
                            style={{ width: '100%' }} 
                            disabled
                            suffixIcon={<CalendarIcon className="h-4 w-4 opacity-50" />}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="Class"
                        name="bulkClassId"
                        rules={[{ required: true, message: 'Please select a class' }]}
                    >
                        <Select 
                            placeholder="Select class" 
                            showSearch 
                            optionFilterProp="label"
                            suffixIcon={<ChevronDown className="h-4 w-4 opacity-50" />}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(value) => {
                                const selectedClass = classes.find(classItem => classItem.id === value);
                                setStudents(selectedClass ? selectedClass.students : []);
                            }}
                        >
                            {classes.map(classItem => (
                                <Select.Option 
                                    key={classItem.id} 
                                    value={classItem.id} 
                                    label={`${classItem.class_type_name} - ${classItem.name}`}
                                >
                                    {classItem.class_type_name} - {classItem.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    
                    {students.length > 0 && (
                        <>
                            <Table 
                                dataSource={students}
                                rowKey="id"
                                pagination={false}
                                scroll={{ y: 400 }}
                                size="small"
                            >
                                <Table.Column title="Student" dataIndex="name" key="name" />
                                <Table.Column 
                                    title="Status" 
                                    key="status" 
                                    render={(student) => (
                                        <Form.Item 
                                            name={`status_${student.id}`} 
                                            initialValue="present"
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Select 
                                                style={{ width: '100%' }}
                                                suffixIcon={<ChevronDown className="h-4 w-4 opacity-50" />}
                                            >
                                                <Select.Option value="present">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        Present
                                                    </div>
                                                </Select.Option>
                                                <Select.Option value="absent">
                                                    <div className="flex items-center gap-2">
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                        Absent
                                                    </div>
                                                </Select.Option>
                                                <Select.Option value="late">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-orange-500" />
                                                        Late
                                                    </div>
                                                </Select.Option>
                                                <Select.Option value="excused">
                                                    <div className="flex items-center gap-2">
                                                        <NotebookPen className="h-4 w-4 text-blue-500" />
                                                        Excused
                                                    </div>
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    )}
                                />
                                <Table.Column 
                                    title="Notes" 
                                    key="notes" 
                                    render={(student) => (
                                        <Form.Item 
                                            name={`notes_${student.id}`} 
                                            style={{ marginBottom: 0 }}
                                        >
                                            <Input.TextArea 
                                                placeholder="Optional" 
                                                maxLength={255} 
                                                rows={1}
                                            />
                                        </Form.Item>
                                    )}
                                />
                            </Table>
                            
                            <div className="mt-4 text-right">
                                <Button type="primary" htmlType="submit" icon={<Save className="h-4 w-4" />}>
                                    Save All
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default TeacherAttendanceCalendar;