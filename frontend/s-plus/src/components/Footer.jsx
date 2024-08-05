import React from 'react'
import "../styles/footer.css"

function Footer() {
  return (
      <footer>
        <p>&copy; 2024 Splus. All rights reserved.</p>
        <div className="footer-links">
          <a href="/about">About Us</a> |<a href="/contact">Contact</a> |
          <a href="/privacy">Privacy Policy</a> |
          <a href="/terms">Terms of Service</a>
        </div>
      </footer>
  );
}

export default Footer
