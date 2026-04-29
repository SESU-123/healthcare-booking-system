import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Sarah Smith', specialty: 'Cardiologist', date: 'Oct 24, 2023', time: '10:00 AM' }
  ]);
  
  const [newBooking, setNewBooking] = useState({ doctorId: '', date: '', time: '' });
  const [cancelledCount, setCancelledCount] = useState(0);
  const [doctorsList, setDoctorsList] = useState([]);
  const [loadingApts, setLoadingApts] = useState(true);

  // Get token for auth
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, aptsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/doctors'),
          axios.get('http://localhost:5000/api/appointments', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setDoctorsList(docsRes.data.data);
        
        // Format appointments for local state
        const formattedApts = aptsRes.data.data.map(apt => ({
          id: apt._id,
          doctor: apt.doctor?.user?.name || 'Unknown Doctor',
          specialty: apt.doctor?.specialization || 'General',
          date: new Date(apt.date).toISOString().split('T')[0],
          time: apt.startTime,
          status: apt.status || 'Pending'
        }));
        setAppointments(formattedApts);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingApts(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const stats = [
    { name: 'Total Appointments', value: (appointments.length + cancelledCount).toString() },
    { name: 'Upcoming', value: appointments.length.toString() },
    { name: 'Completed', value: '0' },
    { name: 'Cancelled', value: cancelledCount.toString() },
  ];

  const handleBook = async (e) => {
    e.preventDefault();
    if(!newBooking.doctorId || !newBooking.date || !newBooking.time) {
      toast.error("Please select a doctor, date, and time");
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:5000/api/appointments', {
        doctor: newBooking.doctorId,
        date: newBooking.date,
        startTime: newBooking.time,
        endTime: `${parseInt(newBooking.time.split(':')[0]) + 1}:${newBooking.time.split(':')[1]}`, // rough 1 hour logic
        reason: 'General Consultation'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const selectedDoc = doctorsList.find(d => d._id === newBooking.doctorId);
      const doctorName = selectedDoc?.user?.name || 'Unknown Doctor';
      const doctorSpecialty = selectedDoc?.specialization || 'General';

      const newApt = {
        id: res.data.data._id,
        doctor: doctorName,
        specialty: doctorSpecialty,
        date: newBooking.date,
        time: newBooking.time,
        status: 'Pending'
      };
      
      setAppointments([...appointments, newApt]);
      toast.success(
        <div>
          <b>Booking Requested!</b>
          <p className="text-sm text-gray-600 mt-1">Your appointment is Pending doctor approval.</p>
        </div>, 
        { duration: 5000, style: { minWidth: '300px' } }
      );
      setNewBooking({ ...newBooking, date: '', time: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to book appointment');
    }
  };

  const handleCancel = (id) => {
    const apt = appointments.find(a => a.id === id);
    setAppointments(appointments.filter(a => a.id !== id));
    setCancelledCount(prev => prev + 1);
    toast.error(
      <div>
        <b>Booking Cancelled!</b>
        <p className="text-sm text-gray-600 mt-1">Appointment with {apt.doctor} has been cancelled.</p>
      </div>,
      { duration: 4000, style: { minWidth: '300px' } }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your health and appointments</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass overflow-hidden rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className={`mt-2 text-3xl font-semibold tracking-tight ${item.name === 'Cancelled' ? 'text-red-500' : 'text-gray-900'}`}>{item.value}</dd>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl shadow-sm p-6 bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
            Upcoming Appointments
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{appointments.length} active</span>
          </h2>
          <div className="overflow-hidden">
            <ul role="list" className="divide-y divide-gray-100">
              <AnimatePresence>
                {appointments.length === 0 && (
                  <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-gray-500 py-4 text-center">No upcoming appointments. Book one below!</motion.p>
                )}
                {appointments.map((item) => (
                  <motion.li 
                    key={item.id} 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, scale: 0.9 }}
                    className="py-5 flex flex-col sm:flex-row hover:bg-gray-50 rounded-xl px-4 transition border border-transparent hover:border-gray-100"
                  >
                    <div className="flex flex-col mb-3 sm:mb-0">
                      <p className="text-base font-bold text-gray-900">{item.doctor}</p>
                      <p className="text-sm font-medium text-blue-600 bg-blue-50 w-max px-2 py-1 rounded mt-1">{item.specialty}</p>
                    </div>
                    <div className="sm:ml-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 sm:gap-1">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{item.date}</p>
                        <p className="text-sm text-gray-500">{item.time}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${item.status === 'Confirmed' ? 'bg-green-100 text-green-800' : item.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {item.status}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleCancel(item.id)}
                        className="text-sm text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>

        <div className="glass rounded-2xl shadow-lg p-6 bg-blue-50 border border-blue-100 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Book New Appointment</h2>
          <form onSubmit={handleBook} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Doctor</label>
              <select 
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white"
                value={newBooking.doctorId}
                onChange={e => setNewBooking({...newBooking, doctorId: e.target.value})}
              >
                <option value="" disabled>Choose a Doctor</option>
                {doctorsList.map(doc => (
                  <option key={doc._id} value={doc._id}>
                    {doc.user?.name || 'Dr. Unknown'} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Date</label>
              <input 
                type="date" 
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white"
                value={newBooking.date}
                onChange={e => setNewBooking({...newBooking, date: e.target.value, time: ''})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Time Slot</label>
              <select 
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border bg-white disabled:bg-gray-100"
                value={newBooking.time}
                onChange={e => setNewBooking({...newBooking, time: e.target.value})}
                disabled={!newBooking.date || !newBooking.doctorId}
              >
                <option value="" disabled>Choose a Time</option>
                {(() => {
                  if (!newBooking.date || !newBooking.doctorId) return null;
                  const dateObj = new Date(newBooking.date);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                  const doc = doctorsList.find(d => d._id === newBooking.doctorId);
                  const dayAvail = doc?.availability?.find(a => a.day === dayName);
                  
                  if (!dayAvail || dayAvail.slots.length === 0) {
                    return <option value="" disabled>No slots available on this day</option>;
                  }
                  return dayAvail.slots.map((s, i) => (
                    <option key={i} value={s.startTime}>{s.startTime} - {s.endTime}</option>
                  ));
                })()}
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition active:scale-95"
            >
              Request Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
