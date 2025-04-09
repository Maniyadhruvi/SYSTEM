import { useState } from 'react';
import styles from './Home.module.css';
// import Image from 'next/image';
import Login from '../Login/Login';

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <h1>Gamification</h1>
        </div>
        <div className={styles.navLinks}>
          <a href="#">Get Started</a>
          <a href="#">Mobile Apps</a>
          <a href="#">Learn More</a>
          <button className={styles.loginBtn} onClick={handleLoginClick}>Login</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.heroContent}>
          <div className={styles.characters}>
            {/* You'll need to add your pixel art character images here */}
            {/* <div className={styles.characterPlaceholder}></div>
            <div className={styles.characterPlaceholder}></div>
            <div className={styles.characterPlaceholder}></div> */}
          </div>
          
          <h1 className={styles.title}>
            Motivate yourself to<br />achieve your goals.
          </h1>
          
          <p className={styles.description}>
            Its time to have fun when you get things done! Join over 4 million
            Habiticans and improve your life one task at a time.
          </p>
        </div>
      </main>

      <div className={styles.decorativeBlocks}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {showLogin && (
        <div className={styles.modalOverlay} onClick={handleCloseLogin}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleCloseLogin}>×</button>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
