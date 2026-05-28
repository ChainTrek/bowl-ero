import { useEffect, useState } from 'react';
import { getEmploymentApplications } from '../../services/supabase/employmentApplications';
import { formatDateTime } from '../../utils/formatDateTime';

export default function EmploymentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      const data = await getEmploymentApplications();
      setApplications(data);
    } catch (error) {
      setStatusMessage(`Error loading applications: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-page employment-applications-page">
      <div className="admin-page__header">
        <h1>Employment Applications</h1>
        <p>Review submitted job applications from the public site.</p>
      </div>

      <div className="admin-card">
        <h2>Submitted Applications</h2>

        {statusMessage && <p className="status-message">{statusMessage}</p>}

        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No applications have been submitted yet.</p>
        ) : (
          <div className="employment-application-list">
            {applications.map((application) => (
              <article className="employment-application-item" key={application.id}>
                <div className="employment-application-item__header">
                  <div>
                    <h3>
                      {application.first_name} {application.last_name}
                    </h3>
                    <p>Submitted: {formatDateTime(application.created_at)}</p>
                  </div>
                </div>

                <div className="employment-application-item__grid">
                  <div>
                    <strong>Email:</strong>
                    <p>{application.email || 'Not provided'}</p>
                  </div>

                  <div>
                    <strong>Phone:</strong>
                    <p>{application.phone || 'Not provided'}</p>
                  </div>

                  <div>
                    <strong>Address:</strong>
                    <p>{application.address || 'Not provided'}</p>
                  </div>

                  <div>
                    <strong>City:</strong>
                    <p>{application.city || 'Not provided'}</p>
                  </div>

                  <div>
                    <strong>State:</strong>
                    <p>{application.state || 'Not provided'}</p>
                  </div>

                  <div>
                    <strong>ZIP:</strong>
                    <p>{application.zip || 'Not provided'}</p>
                  </div>

                  <div>
                    <strong>Position Desired:</strong>
                    <p>{application.position_desired || 'Not provided'}</p>
                  </div>
                </div>

                <div className="employment-application-item__section">
                  <strong>Availability</strong>
                  <p>{application.availability || 'Not provided'}</p>
                </div>

                <div className="employment-application-item__section">
                  <strong>Previous Experience</strong>
                  <p>{application.previous_experience || 'Not provided'}</p>
                </div>

                <div className="employment-application-item__section">
                  <strong>Why They Want to Work Here</strong>
                  <p>{application.why_work_here || 'Not provided'}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}