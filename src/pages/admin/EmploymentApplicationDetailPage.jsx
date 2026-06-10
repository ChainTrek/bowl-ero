import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEmploymentApplicationById } from '../../services/supabase/employmentApplications';
import { formatDateTime } from '../../utils/formatDateTime';
import EmploymentApplicationPrintTemplate from '../../components/employment/EmploymentApplicationPrintTemplate';

function displayValue(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }

  return value;
}

function displayBoolean(value) {
  if (value === null || value === undefined) {
    return 'Not provided';
  }

  return value ? 'Yes' : 'No';
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

  function handlePrint() {
    window.print();
  }

  return (
    <section className="admin-page employment-application-detail-page">
      <div className="admin-page__header employment-application-detail-page__header no-print">
        <div>
          <h1>Application Details</h1>
          <p>Review the submitted employment application in full.</p>
        </div>

        <div className="employment-application-detail-page__actions">
          <button
            type="button"
            className="edit-button"
            onClick={handlePrint}
          >
            Print Application
          </button>

          <Link to="/admin/applications" className="secondary-button">
            Back to Applications
          </Link>
        </div>
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
        <>
          <div className="screen-only">
            <div className="employment-application-detail">
              <div className="admin-card employment-application-detail__hero application-print-header">
                <p className="application-print-header__eyebrow">Bowl-Ero Lanes</p>
                <h2>Employment Application</h2>
                <p>
                  Applicant: {application.first_name} {application.last_name}
                </p>
                <p>Submitted: {formatDateTime(application.created_at)}</p>
              </div>

              <div className="admin-card">
                <h2>Personal Information</h2>
                <div className="employment-detail-grid">
                  <div>
                    <strong>Application Date</strong>
                    <p>{displayValue(application.application_date)}</p>
                  </div>

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

                  <div>
                    <strong>Desired Salary</strong>
                    <p>{displayValue(application.desired_salary)}</p>
                  </div>

                  <div>
                    <strong>Employment Type</strong>
                    <p>{displayValue(application.employment_type)}</p>
                  </div>

                  <div>
                    <strong>Available Start Date</strong>
                    <p>{displayValue(application.available_start_date)}</p>
                  </div>

                  <div>
                    <strong>Legally Eligible to Work</strong>
                    <p>{displayBoolean(application.legally_eligible_to_work)}</p>
                  </div>

                  <div>
                    <strong>Over 16</strong>
                    <p>{displayBoolean(application.over_16)}</p>
                  </div>

                  <div>
                    <strong>Food Handler’s Card</strong>
                    <p>{displayBoolean(application.has_food_handlers_card)}</p>
                  </div>

                  <div>
                    <strong>Acknowledgement</strong>
                    <p>{application.applicant_acknowledgement ? 'Confirmed' : 'Not confirmed'}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Work Readiness & Background</h2>
                <div className="employment-detail-grid">
                  <div>
                    <strong>Can Perform Essential Functions</strong>
                    <p>{displayBoolean(application.can_perform_essential_functions)}</p>
                  </div>

                  <div>
                    <strong>Has Convictions</strong>
                    <p>{displayBoolean(application.has_convictions)}</p>
                  </div>

                  <div>
                    <strong>Worked Here Before</strong>
                    <p>{displayBoolean(application.worked_here_before)}</p>
                  </div>

                  <div>
                    <strong>Relatives or Friends at Company</strong>
                    <p>{displayBoolean(application.has_company_relatives_or_friends)}</p>
                  </div>

                  <div>
                    <strong>Presently Employed</strong>
                    <p>{displayBoolean(application.presently_employed)}</p>
                  </div>

                  <div>
                    <strong>May Contact Current Employer</strong>
                    <p>{displayBoolean(application.may_contact_current_employer)}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Essential Functions Explanation</h2>
                <div className="employment-detail-block">
                  <p>{displayValue(application.essential_functions_explanation)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Conviction Details</h2>
                <div className="employment-detail-block">
                  <p>{displayValue(application.conviction_details)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Relatives / Friends Details</h2>
                <div className="employment-detail-block">
                  <p>{displayValue(application.company_relatives_or_friends_details)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Days and Hours Available</h2>
                <div className="employment-detail-block">
                  <p>{displayValue(application.days_hours_available)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Reason for Leaving Current Job</h2>
                <div className="employment-detail-block">
                  <p>{displayValue(application.reason_for_leaving_current_job)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Organizations & Training</h2>
                <div className="employment-detail-block">
                  <strong>Organizations / Memberships</strong>
                  <p>{displayValue(application.organizations_memberships)}</p>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Special Training</strong>
                  <p>{displayValue(application.special_training)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Education</h2>

                <div className="employment-detail-grid">
                  <div>
                    <strong>High School Name</strong>
                    <p>{displayValue(application.high_school_name)}</p>
                  </div>
                  <div>
                    <strong>High School Course of Study</strong>
                    <p>{displayValue(application.high_school_course_of_study)}</p>
                  </div>
                  <div>
                    <strong>High School Years Completed</strong>
                    <p>{displayValue(application.high_school_years_completed)}</p>
                  </div>
                  <div>
                    <strong>High School Diploma / Degree</strong>
                    <p>{displayValue(application.high_school_diploma_or_degree)}</p>
                  </div>

                  <div>
                    <strong>College Name</strong>
                    <p>{displayValue(application.college_name)}</p>
                  </div>
                  <div>
                    <strong>College Course of Study</strong>
                    <p>{displayValue(application.college_course_of_study)}</p>
                  </div>
                  <div>
                    <strong>College Years Completed</strong>
                    <p>{displayValue(application.college_years_completed)}</p>
                  </div>
                  <div>
                    <strong>College Diploma / Degree</strong>
                    <p>{displayValue(application.college_diploma_or_degree)}</p>
                  </div>

                  <div>
                    <strong>Trade School Name</strong>
                    <p>{displayValue(application.trade_school_name)}</p>
                  </div>
                  <div>
                    <strong>Trade School Course of Study</strong>
                    <p>{displayValue(application.trade_school_course_of_study)}</p>
                  </div>
                  <div>
                    <strong>Trade School Years Completed</strong>
                    <p>{displayValue(application.trade_school_years_completed)}</p>
                  </div>
                  <div>
                    <strong>Trade School Diploma / Degree</strong>
                    <p>{displayValue(application.trade_school_diploma_or_degree)}</p>
                  </div>

                  <div>
                    <strong>Graduate Work Name</strong>
                    <p>{displayValue(application.graduate_work_name)}</p>
                  </div>
                  <div>
                    <strong>Graduate Work Course of Study</strong>
                    <p>{displayValue(application.graduate_work_course_of_study)}</p>
                  </div>
                  <div>
                    <strong>Graduate Work Years Completed</strong>
                    <p>{displayValue(application.graduate_work_years_completed)}</p>
                  </div>
                  <div>
                    <strong>Graduate Work Diploma / Degree</strong>
                    <p>{displayValue(application.graduate_work_diploma_or_degree)}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <h2>Employment History</h2>

                <div className="employment-detail-block">
                  <strong>Employer 1 Name</strong>
                  <p>{displayValue(application.employer_1_name)}</p>
                </div>

                <div className="employment-detail-grid employment-detail-grid--spaced">
                  <div>
                    <strong>Employer 1 Phone</strong>
                    <p>{displayValue(application.employer_1_phone)}</p>
                  </div>
                  <div>
                    <strong>Employer 1 Dates</strong>
                    <p>{displayValue(application.employer_1_dates)}</p>
                  </div>
                  <div>
                    <strong>Employer 1 Supervisor</strong>
                    <p>{displayValue(application.employer_1_supervisor)}</p>
                  </div>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Employer 1 Address</strong>
                  <p>{displayValue(application.employer_1_address)}</p>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Employer 1 Reason for Leaving</strong>
                  <p>{displayValue(application.employer_1_reason_for_leaving)}</p>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Employer 1 Work Performed</strong>
                  <p>{displayValue(application.employer_1_work_performed)}</p>
                </div>

                <hr className="employment-detail-divider" />

                <div className="employment-detail-block">
                  <strong>Employer 2 Name</strong>
                  <p>{displayValue(application.employer_2_name)}</p>
                </div>

                <div className="employment-detail-grid employment-detail-grid--spaced">
                  <div>
                    <strong>Employer 2 Phone</strong>
                    <p>{displayValue(application.employer_2_phone)}</p>
                  </div>
                  <div>
                    <strong>Employer 2 Dates</strong>
                    <p>{displayValue(application.employer_2_dates)}</p>
                  </div>
                  <div>
                    <strong>Employer 2 Supervisor</strong>
                    <p>{displayValue(application.employer_2_supervisor)}</p>
                  </div>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Employer 2 Address</strong>
                  <p>{displayValue(application.employer_2_address)}</p>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Employer 2 Reason for Leaving</strong>
                  <p>{displayValue(application.employer_2_reason_for_leaving)}</p>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Employer 2 Work Performed</strong>
                  <p>{displayValue(application.employer_2_work_performed)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Personal References</h2>

                <div className="employment-detail-grid">
                  <div>
                    <strong>Reference 1 Name</strong>
                    <p>{displayValue(application.reference_1_name)}</p>
                  </div>
                  <div>
                    <strong>Reference 1 Phone</strong>
                    <p>{displayValue(application.reference_1_phone)}</p>
                  </div>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Reference 1 Address</strong>
                  <p>{displayValue(application.reference_1_address)}</p>
                </div>

                <hr className="employment-detail-divider" />

                <div className="employment-detail-grid">
                  <div>
                    <strong>Reference 2 Name</strong>
                    <p>{displayValue(application.reference_2_name)}</p>
                  </div>
                  <div>
                    <strong>Reference 2 Phone</strong>
                    <p>{displayValue(application.reference_2_phone)}</p>
                  </div>
                </div>

                <div className="employment-detail-block employment-detail-block--spaced">
                  <strong>Reference 2 Address</strong>
                  <p>{displayValue(application.reference_2_address)}</p>
                </div>
              </div>

              <div className="admin-card">
                <h2>Applicant Signature</h2>
                <div className="employment-detail-grid">
                  <div>
                    <strong>Signature</strong>
                    <p>{displayValue(application.applicant_signature)}</p>
                  </div>
                  <div>
                    <strong>Signature Date</strong>
                    <p>{displayValue(application.applicant_signature_date)}</p>
                  </div>
                  <div>
                    <strong>Acknowledgement</strong>
                    <p>{application.applicant_acknowledgement ? 'Confirmed' : 'Not confirmed'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="application-print-shell application-print-shell--preview">
              <EmploymentApplicationPrintTemplate application={application} />
            </div>
          </div>

          <div className="print-only-shell">
            <EmploymentApplicationPrintTemplate application={application} />
          </div>
        </>
      )}
    </section>
  );
}