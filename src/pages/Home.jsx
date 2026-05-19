import HoursSection from '../components/public/HoursSection';
import AnnouncementsSection from '../components/public/AnnouncementsSection';
import LeagueScoresSection from '../components/public/LeagueScoresSection';
import TournamentsSection from '../components/public/TournamentsSection';
import CafeMenuSection from '../components/public/CafeMenuSection';

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <h1>Bowl-Ero Lanes</h1>
        <p>Your hometown bowling destination.</p>
      </section>

      <AnnouncementsSection />
      <LeagueScoresSection />
      <TournamentsSection />
      <CafeMenuSection />
      <HoursSection />
    </main>
  );
}