import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaBrain as BrainIcon, FaBaby as BabyIcon, FaBone as BoneIcon, FaUserMd } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}`}/doctors`);
        setDoctors(res.data.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);
  const specialists = [
    { title: 'Cardiology', icon: <FaHeart className="w-8 h-8 text-rose-500" />, desc: 'Heart and cardiovascular system specialists' },
    { title: 'Neurology', icon: <BrainIcon className="w-8 h-8 text-purple-500" />, desc: 'Experts in brain and nervous system' },
    { title: 'Pediatrics', icon: <BabyIcon className="w-8 h-8 text-blue-500" />, desc: 'Specialized healthcare for children' },
    { title: 'Orthopedics', icon: <BoneIcon className="w-8 h-8 text-orange-500" />, desc: 'Bone, joint, and muscle specialists' },
  ];

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-50 to-white pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-y-0 w-full h-full">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            Accepting New Patients
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6"
          >
            Your Health, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Our Priority</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-gray-600 mb-10"
          >
            Experience world-class healthcare with instant appointment booking, top-tier specialists, and seamless medical record management.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/30">
              Book Appointment Now
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-200 rounded-full font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all">
              Are you a Doctor?
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Find a Specialist Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Find a Specialist</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We have gathered the best doctors across multiple disciplines to provide you with comprehensive care.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialists.map((spec, i) => (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-100 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                  {spec.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{spec.title}</h3>
                <p className="text-gray-600 mb-6">{spec.desc}</p>
                <button 
                  onClick={() => {
                    setSelectedSpecialty(spec.title);
                    document.getElementById('doctors-list').scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-blue-600 font-semibold hover:text-blue-800 flex items-center justify-center gap-2 mx-auto mt-auto cursor-pointer"
                >
                  View Doctors 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor List Section */}
      <div id="doctors-list" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Top Doctors</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">Book an appointment with our experienced medical professionals.</p>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General'].map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedSpecialty === spec 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center text-gray-500">Loading doctors...</div>
          ) : (doctors.filter(d => selectedSpecialty === 'All' || d.specialization === selectedSpecialty).length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.filter(d => selectedSpecialty === 'All' || d.specialization === selectedSpecialty).map((doc, i) => (
                <motion.div
                  key={doc._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={doc.gender === 'Female' ? `https://avatar.iran.liara.run/public/girl?username=${doc.user?.name || 'doc'}` : `https://avatar.iran.liara.run/public/boy?username=${doc.user?.name || 'doc'}`}
                      alt={doc.user?.name || 'Doctor'}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shadow-sm"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{doc.user?.name || 'Dr. Unknown'}</h3>
                      <p className="text-blue-600 font-medium">{doc.specialization}</p>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm space-y-2 mb-6">
                    <p><strong>Experience:</strong> {doc.experience} years</p>
                    <p><strong>Consultation Fee:</strong> ${doc.fees}</p>
                  </div>
                  <Link to="/login" className="block w-full text-center py-3 bg-gray-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold rounded-xl transition-colors border border-blue-100 hover:border-transparent">
                    Book Appointment
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No doctors found for the selected specialty.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
