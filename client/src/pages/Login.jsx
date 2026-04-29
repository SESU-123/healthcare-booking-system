import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Patient', specialization: '', gender: 'Male', experience: 1
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Logged in successfully!');
        if (res.data.user.role === 'Doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Register User
        const res = await axios.post(`${API_URL}/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        // If Doctor, create Doctor profile
        if (formData.role === 'Doctor') {
          await axios.post(`${API_URL}/doctors`, {
            specialization: formData.specialization || 'General',
            experience: Number(formData.experience) || 1,
            gender: formData.gender,
            fees: 100 // Default fees
          }, {
            headers: {
              Authorization: `Bearer ${res.data.token}`
            }
          });
        }

        toast.success('Registered successfully!');
        if (res.data.user.role === 'Doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Authentication failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 glass p-10 rounded-3xl shadow-2xl"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <div>
                <input
                  name="name" type="text" required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Full Name"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div>
              <input
                name="email" type="email" required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Email address"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input
                name="password" type="password" required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Password"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            {!isLogin && (
              <div>
                <select
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  value={formData.role}
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                </select>
              </div>
            )}
            {!isLogin && formData.role === 'Doctor' && (
              <div className="space-y-4 mt-4">
                <select
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  value={formData.specialization}
                  required
                >
                  <option value="" disabled>Select Specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="General">General</option>
                </select>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">Gender</label>
                    <select
                      className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white"
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      value={formData.gender}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1 ml-1">Years of Exp.</label>
                    <input
                      name="experience" type="number" min="0" required
                      className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      placeholder="Years of Experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-primary hover:text-secondary"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
