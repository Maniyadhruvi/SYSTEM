import { useState } from 'react';
import styles from './Login.module.css';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  password: string;
  username: string;
}

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: ''
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Check credentials against stored users
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email);

    if (!user) {
      newErrors.email = 'Email not registered';
      isValid = false;
    } else if (user.password !== formData.password) {
      newErrors.password = 'Incorrect password';
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
      // Store the current user's email in localStorage
      localStorage.setItem('currentUserEmail', formData.email);
      
      // Show success toast
      setShowToast(true);
      
      // Hide toast after 3 seconds and redirect
      setTimeout(() => {
        setShowToast(false);
        // After successful login, redirect to TaskManager
        router.push('/tasks');
      }, 3000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpClick = () => {
    router.push('/register');
  };

  return (
    <div className={styles.container}>
      {showToast && (
        <div className={styles.toast}>
          Login successful! Redirecting...
        </div>
      )}

      <div className={styles.loginBox}>
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? styles.error : ''}
              required
            />
            {errors.email && (
              <span className={styles.errorMessage}>{errors.email}</span>
            )}
          </div>
          
          <div className={styles.inputGroup}>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? styles.error : ''}
                required
              />
              <button 
                type="button"
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password}</span>
            )}
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <div className={styles.signupLink}>
            Don&apos;t have a Gamification account?{' '}
            <button 
              type="button" 
              className={styles.signupButton}
              onClick={handleSignUpClick}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
