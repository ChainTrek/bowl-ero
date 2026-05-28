import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEmploymentApplicationById } from '../../services/supabase/employmentApplications';
import { formatDateTime } from '../../utils/formatDateTime';

function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  return value;
}

export default function EmploymentApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadApplication();
  }, [id]);

  async function loadApplication() {
    try {
      setLoading(true);
      const data = await getEmploymentApplicationById(id);
      setApplication(data);
    } catch (error) {
      setStatusMessage(`Error loading application: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-page employment-application-detail-page">
      <div className="admin-page__header employment-application-detail-page__header">
        <div>
          <h1>Application Details</h1>
          <p>Review the submitted employment application in full.</p>
        </div>

        <Link to="/admin/applications" className="secondary-button">
          Back to Applications
        </Link>
      </div>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {loading ? (
        <div className="admin-card">
          <p>Loading application...</p>
        </div>
      ) : !application ? (
        <div className="admin-card">
          <p>Application not found.</p>
        </div>
      ) : (
        <div className="employment-application-detail">
          <div className="admin-card employment-application-detail__hero">
            <h2>
              {application.first_name} {application.last_name}
            </h2>
            <p>Submitted: {formatDateTime(application.created_at)}</p>
          </div>

          <div className="admin-card">
            <h2>Personal Information</h2>
            <div className="employment-detail-grid">
              <div>
                <strong>First Name</strong>
                <p>{displayValue(application.first_name)}</p>
              </div>

              <div>
                <strong>Last Name</strong>
                <p>{displayValue(application.last_name)}</p>
              </div>

              <div>
                <strong>Email</strong>
                <p>{displayValue(application.email)}</p>
              </div>

              <div>
                <strong>Phone</strong>
                <p>{displayValue(application.phone)}</p>
              </div>

              <div>
                <strong>Address</strong>
                <p>{displayValue(application.address)}</p>
              </div>

              <div>
                <strong>City</strong>
                <p>{displayValue(application.city)}</p>
              </div>

              <div>
                <strong>State</strong>
                <p>{displayValue(application.state)}</p>
              </div>

              <div>
                <strong>ZIP</strong>
                <p>{displayValue(application.zip)}</p>
              </div>

              <div>
                <strong>Position Desired</strong>
                <p>{displayValue(application.position_desired)}</p>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2>Availability</h2>
            <div className="employment-detail-block">
              <p>{displayValue(application.availability)}</p>
            </div>
          </div>

          <div className="admin-card">
            <h2>Previous Experience</h2>
            <div className="employment-detail-block">
              <p>{displayValue(application.previous_experience)}</p>
            </div>
          </div>

          <div className="admin-card">
            <h2>Why They Want to Work Here</h2>
            <div className="employment-detail-block">
              <p>{displayValue(application.why_work_here)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}