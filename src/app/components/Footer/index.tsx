"use client";
import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Product</h3>
          <nav>
            <a href="#">IOS App</a>
            <a href="#">Android App</a>
            <a href="#">Group Plans</a>
            <a href="#">How It Works</a>
          </nav>
        </div>

        <div className={styles.footerSection}>
          <h3>Company</h3>
          <nav>
            <a href="#">Contact Us</a>
            <a href="#">Press Kit</a>
            <a href="#">Blog</a>
            <a href="#">News</a>
          </nav>
        </div>

        <div className={styles.footerSection}>
          <h3>Community</h3>
          <nav>
            <a href="#">Community Guidelines</a>
            <a href="#">Hall of Heroes</a>
            <a href="#">Contributing to Habitica</a>
            <a href="#">Translate Habitica</a>
          </nav>
        </div>

        <div className={styles.footerSection}>
          <h3>Support</h3>
          <nav>
            <a href="#">FAQ</a>
            <a href="#">Report a Bug</a>
            <a href="#">Request a Feature</a>
          </nav>
        </div>

        <div className={styles.footerSection}>
          <h3>Developers</h3>
          <nav>
            <a href="#">API v3</a>
            <a href="#">Data Display Tool</a>
            <a href="#">Guidance for Blacksmiths</a>
          </nav>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <div className={styles.supportSection}>
            <h3>Help Support Habitica</h3>
            <p>Habitica is an open source project that depends on our users for support. The money you spend on gems helps us keep the servers running, maintain a small staff, develop new features, and provide incentives for our volunteers</p>
            <button className={styles.donateButton}>
              💜 Donate to Habitica
            </button>
          </div>

          <div className={styles.socialSection}>
            <h3>Social</h3>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Tumblr">📝</a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>© 2023 Habitica. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms and Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 