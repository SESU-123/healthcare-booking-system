import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [photo, setPhoto] = useState("https://i.pravatar.cc/150?img=32");
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availDay, setAvailDay] = useState('Monday');
  const [availStart, setAvailStart] = useState('09:00');
  const [availEnd, setAvailEnd] = useState('17:00');

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch doctor profile to get specialization
        const docsRes = await axios.get('http://localhost:5000/api/doctors');
        const myProfile = docsRes.data.data.find(d => d.user?._id === user.id || d.user === user.id);
        setDoctorProfile(myProfile);

        // Fetch doctor's appointments
        const aptRes = await axios.get('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(aptRes.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [token, user.id]);

  const stats = [
    { name: 'Total Patients', value: appointments.length.toString() },
    { name: 'Today\'s Appointments', value: appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length.toString() },
    { name: 'Pending Approvals', value: appointments.filter(a => a.status === 'Pending').length.toString() },
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    if (!doctorProfile) return;
    
    try {
      const newSlot = { startTime: availStart, endTime: availEnd };
      let newAvailability = [...(doctorProfile.availability || [])];
      
      const dayIndex = newAvailability.findIndex(a => a.day === availDay);
      if (dayIndex > -1) {
        newAvailability[dayIndex].slots.push(newSlot);
      } else {
        newAvailability.push({ day: availDay, slots: [newSlot] });
      }

      const res = await axios.put(`http://localhost:5000/api/doctors/${doctorProfile._id}`, 
        { availability: newAvailability },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctorProfile(res.data.data);
      toast.success('Availability updated!');
    } catch (err) {
      toast.error('Failed to update availability');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(appointments.map(a => a._id === id ? { ...a, status: newStatus } : a));
      toast.success(`Appointment ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative group">
          <img 
            src={photo !== "https://i.pravatar.cc/150?img=32" ? photo : (doctorProfile?.gender === 'Female' ? `https://avatar.iran.liara.run/public/girl?username=${user.name || 'doc'}` : `https://avatar.iran.liara.run/public/boy?username=${user.name || 'doc'}`)} 
            alt="Doctor Profile" 
            className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-md bg-blue-50"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <span className="text-white text-xs font-semibold">Change</span>
            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </label>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name || 'Dr. Unknown'}</h1>
          <p className="mt-1 text-sm text-gray-500">{doctorProfile?.specialization || 'General'} • MD, FACC</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {stats.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass overflow-hidden rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">{item.value}</dd>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Appointments</h2>
          <div className="overflow-hidden">
            <ul role="list" className="divide-y divide-gray-200">
              {loading ? (
                <li className="py-4 text-center text-gray-500">Loading appointments...</li>
              ) : appointments.length === 0 ? (
                <li className="py-4 text-center text-gray-500">No appointments scheduled yet.</li>
              ) : appointments.map((apt) => (
                <li key={apt._id} className="py-4 flex flex-col sm:flex-row hover:bg-gray-50/50 rounded-lg px-2 transition sm:items-center">
                  <div className="flex flex-col mb-2 sm:mb-0">
                    <p className="text-sm font-bold text-gray-900">{apt.patient?.name || 'Unknown Patient'}</p>
                    <p className="text-xs font-medium text-gray-500">Reason: {apt.reason}</p>
                  </div>
                  <div className="sm:ml-auto flex flex-col sm:items-end mr-6 mb-2 sm:mb-0">
                    <p className="text-sm font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">{apt.startTime} - {apt.endTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {apt.status === 'Pending' ? (
                      <>
                        <button onClick={() => handleUpdateStatus(apt._id, 'Confirmed')} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded hover:bg-green-200">Accept</button>
                        <button onClick={() => handleUpdateStatus(apt._id, 'Cancelled')} className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded hover:bg-red-200">Decline</button>
                      </>
                    ) : (
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {apt.status}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass rounded-2xl shadow-sm p-6 bg-white h-fit border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Availability</h2>
          <form onSubmit={handleUpdateAvailability} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Day</label>
              <select className="w-full p-2 border rounded-xl" value={availDay} onChange={e => setAvailDay(e.target.value)}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start</label>
                <input type="time" className="w-full p-2 border rounded-xl" value={availStart} onChange={e => setAvailStart(e.target.value)} required />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">End</label>
                <input type="time" className="w-full p-2 border rounded-xl" value={availEnd} onChange={e => setAvailEnd(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Add Slot</button>
          </form>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Current Slots</h3>
            {doctorProfile?.availability?.length > 0 ? (
              <ul className="space-y-3">
                {doctorProfile.availability.map((avail, i) => (
                  <li key={i} className="text-sm border-b pb-2">
                    <strong className="block text-gray-900">{avail.day}</strong>
                    <div className="text-gray-600 mt-1 flex flex-wrap gap-1">
                      {avail.slots.map((s, j) => <span key={j} className="bg-gray-100 px-2 py-1 rounded text-xs">{s.startTime} - {s.endTime}</span>)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500">No availability set.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
