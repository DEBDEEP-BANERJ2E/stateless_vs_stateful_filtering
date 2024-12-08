import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/LandingPage.css'; // Ensure this path is correct

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <div className="logo">
          <h1>FilterBench</h1>
          <p>Stateful vs. Stateless Filtering Performance Comparison</p>
        </div>
        <br></br>
        {/* Use Link to navigate to another page */}
        <Link to="/login-register">
          <button className="landing-page-cta-button">Get Started</button>
        </Link>
      </header>

      <section className="landing-page-section landing-page-about">
        <h2 className="landing-page-h2">About the Project</h2>
        <p>
          FilterBench is a benchmarking tool designed to compare the performance
          of stateful and stateless network filtering techniques in terms of
          latency, throughput, and resource usage. This tool will help network
          administrators optimize security device performance.
        </p>
      </section>

      <section className="landing-page-section landing-page-key-features">
        <h2 className="landing-page-h2">Key Features</h2>
        <ul>
          <li>
            <strong>Real-time Performance Metrics:</strong> Compare latency, CPU
            usage, and throughput.
          </li>
          <li>
            <strong>Short-lived vs. Long-lived Connections:</strong> Test under
            various traffic scenarios.
          </li>
          <li>
            <strong>Stateful vs. Stateless Comparison:</strong> Understand the
            trade-offs for your network.
          </li>
        </ul>
      </section>

      <section className="landing-page-section landing-page-how-it-works">
        <h2 className="landing-page-h2">How It Works</h2>
        <p>
          This tool runs a series of benchmarks on your device to evaluate the
          performance of stateful and stateless filtering techniques. The results
          are displayed in real-time to help you make informed decisions about
          optimizing your network security.
        </p>
      </section>

      <section className="landing-page-section landing-page-benefits">
        <h2 className="landing-page-h2">Why Use FilterBench?</h2>
        <ul>
          <li>
            <strong>Comprehensive Analysis:</strong> Full comparison of performance
            metrics.
          </li>
          <li>
            <strong>Optimize Resources:</strong> Reduce latency and improve throughput
            based on your filtering needs.
          </li>
          <li>
            <strong>Cost-Effective:</strong> Maximize network security efficiency
            without additional hardware investments.
          </li>
        </ul>
      </section>

      <section className="landing-page-section landing-page-contact">
        <h2 className="landing-page-h2">Contact Us</h2>
        <form className="landing-page-form">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Message" required></textarea>
          <button type="submit" className="landing-page-cta-button">Send Message</button>
        </form>
      </section>

      <footer className="landing-page-footer">
        <p>&copy; 2024 FilterBench. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
