// Updated Home.js with Carousel
import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick'; // React Slick for carousel functionality
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from '../styles/Home.module.css'; // Using CSS modules for styling

const Home = () => {
  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className={styles.home}>
      <nav className={styles.nav}>
        <div className={styles.logo}>IEEE - IIFoN</div>
        <div>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/features" className={styles.navLink}>Features</Link>
          <Link to="/register" className={styles.navLink}>Register</Link>
          <Link to="/contact" className={styles.navLink}>Contact</Link>
        </div>
      </nav>

      <header className={styles.header}>
        <h1>Hackathon 2024</h1>
        <p>Innovate. Collaborate. Create the Future.</p>
        <button id="cta-button" className={styles.ctaButton}>Register Now</button>
      </header>

      <section className={styles.features} id="features">
        <Slider {...settings}>
          <div className={styles.featureCard}>
            <h3>Real-Time Collaboration</h3>
            <p>Work with teams around the globe in real-time and push the boundaries of innovation.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Cutting-Edge Challenges</h3>
            <p>Compete in challenges designed by industry leaders to test your skills and creativity.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Exciting Prizes</h3>
            <p>Win amazing prizes and gain global recognition for your innovative solutions.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Networking Opportunities</h3>
            <p>Connect with professionals, peers, and mentors to expand your network and horizons.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>Workshops & Webinars</h3>
            <p>Learn from industry experts through engaging workshops and insightful webinars.</p>
          </div>
        </Slider>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 Hackathon Team. All rights reserved. | <Link to="/privacy-policy">Privacy Policy</Link></p>
      </footer>
    </div>
  );
};

export default Home;