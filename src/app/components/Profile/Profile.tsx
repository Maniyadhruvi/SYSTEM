"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../Header';
import Footer from '../Footer';
import styles from './Profile.module.css';

interface User {
  username: string;
  email: string;
  password: string;
}

const Profile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    // Load current user data
    const loadUserData = () => {
      const userEmail = localStorage.getItem('currentUserEmail');
      if (userEmail) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: User) => u.email === userEmail);
        if (user) {
          setFormData({
            username: user.username,
            email: user.email,
            password: user.password
          });
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };

    loadUserData();
  }, [router]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: ''
    };

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Update user data in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: User) => {
        if (user.email === localStorage.getItem('currentUserEmail')) {
          return {
            ...user,
            username: formData.username,
            email: formData.email
          };
        }
        return user;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUserEmail', formData.email);
      
      // Show success toast
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <main className={styles.mainContent}>
        <div className={styles.profileBox}>
          <h2>Update Your Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? styles.error : ''}
                required
              />
              {errors.username && (
                <span className={styles.errorMessage}>{errors.username}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? styles.error : ''}
                required
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

            <button type="submit" className={styles.updateButton}>
              Update Profile
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
