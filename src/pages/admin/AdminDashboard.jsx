import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase/client';

export default function AdminDashboard() {
  const [status, setStatus] = useState('Checking database...');
  const [leagueCount, setLeagueCount] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data, error } = await supabase.from('leagues').select('*');

        console.log('LEAGUES DATA:', data);
        console.log('LEAGUES ERROR:', error);

        if (error) {
          setStatus(`Database error: ${error.message}`);
          return;
        }

        setLeagueCount(data.length);
        setStatus('Database connection successful.');
      } catch (err) {
        console.log('UNEXPECTED ERROR:', err);
        setStatus(`Unexpected error: ${err.message}`);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <section className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>{status}</p>
      <p>Total leagues: {leagueCount}</p>
    </section>
  );
}