import { useState } from 'react';
import { createEmploymentApplication } from '../services/supabase/publicEmployment';

const initialForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  position_desired: '',
  availability: '',
  previous_experience: '',
  why_work_here: '',
};

export default function EmploymentPage() {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.first_name.trim()) {
      setStatusMessage('Please enter your first name.');
      setIsSuccess(false);
      return;
    }

    if (!formData.last_name.trim()) {
      setStatusMessage('Please enter your last name.');
      setIsSuccess(false);
      return;
    }

    if (!formData.email.trim()) {
      setStatusMessage('Please enter your email.');
      setIsSuccess(false);
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage('');

      await createEmploymentApplication({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        zip: formData.zip.trim() || null,
        position_desired: formData.position_desired.trim() || null,
        availability: formData.availability.trim() || null,
        previous_experience: formData.previous_experience.trim() || null,
        why_work_here: formData.why_work_here.trim() || null,
      });

      setFormData(initialForm);
      setStatusMessage('Your application has been submitted successfully.');
      setIsSuccess(true);
    } catch (error) {
      setStatusMessage(`Unable to submit application: ${error.message}`);
      setIsSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="employment-page public-page">
      <section className="public-section">
        <div className="public-container">
          <div className="public-section-header">
            <span className="public-eyebrow">Join the Team</span>
            <h1 className="public-heading">Employment Application</h1>
            <p className="public-subheading">
              Fill out the application below if you are interested in working at Bowl-Ero.
            </p>
          </div>

          <div className="employment-page__layout">
            <div className="employment-page__info public-card">
              <h2>Work with us</h2>
              <p>
                We are always interested in hearing from dependable people who want
                to help create a great experience for our guests.
              </p>
            </div>

            <div className="employment-page__form-wrapper public-card">
              <form className="employment-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="first_name">First Name</label>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="zip">ZIP</label>
                  <input
                    id="zip"
                    name="zip"
                    type="text"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="position_desired">Position Desired</label>
                  <input
                    id="position_desired"
                    name="position_desired"
                    type="text"
                    value={formData.position_desired}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <textarea
                    id="availability"
                    name="availability"
                    rows="3"
                    value={formData.availability}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="previous_experience">Previous Experience</label>
                  <textarea
                    id="previous_experience"
                    name="previous_experience"
                    rows="4"
                    value={formData.previous_experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="why_work_here">Why would you like to work here?</label>
                  <textarea
                    id="why_work_here"
                    name="why_work_here"
                    rows="4"
                    value={formData.why_work_here}
                    onChange={handleChange}
                  />
                </div>

                {statusMessage && (
                  <p className={isSuccess ? 'employment-form__success' : 'employment-form__error'}>
                    {statusMessage}
                  </p>
                )}

                <button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}