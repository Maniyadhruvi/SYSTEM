"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    };

    if (isPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.leftSection}>
          <h1 className={styles.logo}>Gamification</h1>
          <nav className={styles.navigation}>
            {/* <Link href="/dashboard" className={styles.navLink}>Dashboard</Link> */}
            <Link href="/tasks" className={styles.navLink}>Tasks</Link>
            {/* <Link href="/calendar" className={styles.navLink}>Calendar</Link> */}
          </nav>
        </div>
        
        <div className={styles.rightSection}>
          <div className={styles.searchBar}>
            <input 
              type="search" 
              placeholder="Search tasks..." 
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>
              🔍
            </button>
          </div>
          
          <div className={styles.userSection}>
            <button 
              ref={buttonRef}
              className={styles.notificationButton}
              onClick={() => setIsPopupOpen(!isPopupOpen)}
            >
              🔔
              <span className={styles.notificationBadge}>3</span>
            </button>

            {isPopupOpen && (
              <div className={styles.notificationPopup} ref={popupRef}>
                <div className={styles.popupHeader}>
                  <h3>Notifications</h3>
                  <button 
                    className={styles.closeButton}
                    onClick={() => setIsPopupOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className={styles.popupContent}>
                  <div className={styles.notificationItem}>
                    <span className={styles.notificationIcon}>🎉</span>
                    <div className={styles.notificationText}>
                      <p>You completed a task!</p>
                      <span className={styles.notificationTime}>2 minutes ago</span>
                    </div>
                  </div>
                  <div className={styles.notificationItem}>
                    <span className={styles.notificationIcon}>💰</span>
                    <div className={styles.notificationText}>
                      <p>You earned 10 gold!</p>
                      <span className={styles.notificationTime}>5 minutes ago</span>
                    </div>
                  </div>
                  <div className={styles.notificationItem}>
                    <span className={styles.notificationIcon}>⭐</span>
                    <div className={styles.notificationText}>
                      <p>Level up! Youre now level 5</p>
                      <span className={styles.notificationTime}>10 minutes ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                👤
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>John Doe</span>
                <span className={styles.userRole}>Premium User</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 