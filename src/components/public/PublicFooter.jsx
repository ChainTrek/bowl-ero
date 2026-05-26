import { Link } from 'react-router-dom';
import bowleroLogo from '../../assets/bowlero-logo.png';
import HoursSection from './HoursSection';

export default function PublicFooter() {
  return (
    <footer className="public-footer" id="footer">
      <div className="public-container public-footer__inner">
        <div className="public-footer__top">
          <div className="public-footer__brand">
            <Link to="/" className="site-logo-link" aria-label="Go to home page">
              <img
                className="site-logo site-logo--footer"
                src={bowleroLogo}
                alt="Bowlero logo"
              />
            </Link>

            <div className="public-footer__brand-text">
              <h2>Bowl-Ero Lanes</h2>
              <p>Bowling, leagues, tournaments, food, and more.</p>
            </div>
          </div>

          <nav className="public-footer__nav" aria-label="Footer navigation">
            <h3>Explore</h3>
            <a href="#top">Top</a>
            <a href="#announcements">Announcements</a>
            <a href="#tournaments">Tournaments</a>
            <a href="#league-scores">League Scores</a>
            <a href="#cafe-menu">Cafe Menu</a>
            <Link to="/contact">Contact Us</Link>
            <Link to="/employment">Employment</Link>
          </nav>
        </div>

        <div className="public-footer__hours">
          <HoursSection isFooter />
        </div>

        <div className="public-footer__bottom">
          <p>© {new Date().getFullYear()} Bowl-Ero Lanes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}