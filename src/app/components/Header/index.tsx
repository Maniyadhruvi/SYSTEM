"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.css';

interface User {
  username: string;
  email: string;
}

export default function Header() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Get the current user from localStorage
    const getCurrentUser = () => {
      const userEmail = localStorage.getItem('currentUserEmail');
      if (userEmail) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: User) => u.email === userEmail);
        if (user) {
          setCurrentUser(user);
        } else {
          // If user not found, redirect to login
          router.push('/login');
        }
      } else {
        // If no current user email, redirect to login
        router.push('/login');
      }
    };

    getCurrentUser();
  }, [router]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.userProfile}`)) {
        setShowProfileMenu(false);
      }
      if (!target.closest(`.${styles.mobileMenuButton}`) && !target.closest(`.${styles.navigation}`)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUserEmail');
    router.push('/login');
  };

  // If user is not loaded yet, you might want to show a loading state
  if (!currentUser) {
    return null; // Or return a loading spinner
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <button 
            className={styles.mobileMenuButton}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <h1 className={styles.logo}>Gamification</h1>
          <nav className={`${styles.navigation} ${showMobileMenu ? styles.mobileActive : ''}`}>
            <Link href="/tasks" className={styles.navLink} onClick={() => setShowMobileMenu(false)}>
              Tasks
            </Link>
          </nav>
        </div>
        
        <div className={styles.rightSection}>
          <div className={styles.searchBar}>
            <input 
              type="search" 
              placeholder="Search tasks..." 
              className={styles.searchInput}
            />
            <button className={styles.searchButton} aria-label="Search">
              🔍
            </button>
          </div>
          
          <div className={styles.userSection}>
            <button className={styles.notificationButton} aria-label="Notifications">
              🔔
              <span className={styles.notificationBadge}>3</span>
            </button>
            <div className={styles.userProfile}>
              <button 
                className={styles.profileButton}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="User menu"
              >
                <div className={styles.avatar}>
                  👤
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{currentUser.username}</span>
                  <span className={styles.userRole}>Premium User</span>
                </div>
              </button>
              
              {showProfileMenu && (
                <div className={styles.profileMenu}>
                  <Link 
                    href="/profile" 
                    className={styles.menuItem}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <span className={styles.menuIcon}>👤</span>
                    My Profile
                  </Link>
                  <button 
                    className={styles.menuItem}
                    onClick={handleLogout}
                  >
                    <span className={styles.menuIcon}>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 