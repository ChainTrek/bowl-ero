import {
  formatEmploymentReviewValue,
  formatEmploymentReviewYesNo,
} from '../../utils/employment/formatEmploymentReviewValue';

function ReviewItem({ label, value }) {
  return (
    <div className="employment-review__item">
      <strong>{label}</strong>
      <p>{value}</p>
    </div>
  );
}

export default function EmploymentReviewSummary({ formData }) {
  return (
    <div className="employment-review">
      <h3>Review Your Application</h3>
      <p className="employment-review__intro">
        Please review your information before submitting.
      </p>

      <div className="employment-review__section">
        <h4>Personal Information</h4>
        <div className="employment-review__grid">
          <ReviewItem label="Application Date" value={formatEmploymentReviewValue(formData.application_date)} />
          <ReviewItem label="First Name" value={formatEmploymentReviewValue(formData.first_name)} />
          <ReviewItem label="Last Name" value={formatEmploymentReviewValue(formData.last_name)} />
          <ReviewItem label="Email" value={formatEmploymentReviewValue(formData.email)} />
          <ReviewItem label="Phone" value={formatEmploymentReviewValue(formData.phone)} />
          <ReviewItem label="Address" value={formatEmploymentReviewValue(formData.address)} />
          <ReviewItem label="City" value={formatEmploymentReviewValue(formData.city)} />
          <ReviewItem label="State" value={formatEmploymentReviewValue(formData.state)} />
          <ReviewItem label="ZIP" value={formatEmploymentReviewValue(formData.zip)} />
        </div>
      </div>

      <div className="employment-review__section">
        <h4>Position & Eligibility</h4>
        <div className="employment-review__grid">
          <ReviewItem label="Position Applying For" value={formatEmploymentReviewValue(formData.position_desired)} />
          <ReviewItem label="Desired Salary" value={formatEmploymentReviewValue(formData.desired_salary)} />
          <ReviewItem label="Employment Type" value={formatEmploymentReviewValue(formData.employment_type)} />
          <ReviewItem label="Available Start Date" value={formatEmploymentReviewValue(formData.available_start_date)} />
          <ReviewItem
            label="Legally Eligible to Work"
            value={formatEmploymentReviewYesNo(formData.legally_eligible_to_work)}
          />
          <ReviewItem label="Over 16" value={formatEmploymentReviewYesNo(formData.over_16)} />
          <ReviewItem
            label="Food Handler’s Card"
            value={formatEmploymentReviewYesNo(formData.has_food_handlers_card)}
          />
        </div>
      </div>

      <div className="employment-review__section">
        <h4>Background & Availability</h4>
        <div className="employment-review__grid">
          <ReviewItem
            label="Can Perform Essential Functions"
            value={formatEmploymentReviewYesNo(formData.can_perform_essential_functions)}
          />
          <ReviewItem
            label="Essential Functions Explanation"
            value={formatEmploymentReviewValue(formData.essential_functions_explanation)}
          />
          <ReviewItem
            label="Has Convictions"
            value={formatEmploymentReviewYesNo(formData.has_convictions)}
          />
          <ReviewItem
            label="Conviction Details"
            value={formatEmploymentReviewValue(formData.conviction_details)}
          />
          <ReviewItem
            label="Worked Here Before"
            value={formatEmploymentReviewYesNo(formData.worked_here_before)}
          />
          <ReviewItem
            label="Relatives or Friends at Company"
            value={formatEmploymentReviewYesNo(formData.has_company_relatives_or_friends)}
          />
          <ReviewItem
            label="Relatives/Friends Details"
            value={formatEmploymentReviewValue(formData.company_relatives_or_friends_details)}
          />
          <ReviewItem
            label="Days and Hours Available"
            value={formatEmploymentReviewValue(formData.days_hours_available)}
          />
          <ReviewItem
            label="Presently Employed"
            value={formatEmploymentReviewYesNo(formData.presently_employed)}
          />
          <ReviewItem
            label="Reason for Leaving Current Job"
            value={formatEmploymentReviewValue(formData.reason_for_leaving_current_job)}
          />
          <ReviewItem
            label="May Contact Current Employer"
            value={formatEmploymentReviewYesNo(formData.may_contact_current_employer)}
          />
        </div>
      </div>

      <div className="employment-review__section">
        <h4>Organizations, Training & Education</h4>
        <div className="employment-review__grid">
          <ReviewItem
            label="Organizations / Memberships"
            value={formatEmploymentReviewValue(formData.organizations_memberships)}
          />
          <ReviewItem
            label="Special Training"
            value={formatEmploymentReviewValue(formData.special_training)}
          />
          <ReviewItem label="High School" value={formatEmploymentReviewValue(formData.high_school_name)} />
          <ReviewItem label="College" value={formatEmploymentReviewValue(formData.college_name)} />
          <ReviewItem label="Trade School" value={formatEmploymentReviewValue(formData.trade_school_name)} />
          <ReviewItem label="Graduate Work" value={formatEmploymentReviewValue(formData.graduate_work_name)} />
        </div>
      </div>

      <div className="employment-review__section">
        <h4>Employment History & References</h4>
        <div className="employment-review__grid">
          <ReviewItem label="Employer 1" value={formatEmploymentReviewValue(formData.employer_1_name)} />
          <ReviewItem label="Employer 2" value={formatEmploymentReviewValue(formData.employer_2_name)} />
          <ReviewItem label="Reference 1" value={formatEmploymentReviewValue(formData.reference_1_name)} />
          <ReviewItem label="Reference 2" value={formatEmploymentReviewValue(formData.reference_2_name)} />
        </div>
      </div>

      <div className="employment-review__section">
        <h4>Final Confirmation</h4>
        <div className="employment-review__grid">
          <ReviewItem
            label="Previous Experience"
            value={formatEmploymentReviewValue(formData.previous_experience)}
          />
          <ReviewItem
            label="Why Work Here"
            value={formatEmploymentReviewValue(formData.why_work_here)}
          />
          <ReviewItem
            label="Signature"
            value={formatEmploymentReviewValue(formData.applicant_signature)}
          />
          <ReviewItem
            label="Signature Date"
            value={formatEmploymentReviewValue(formData.applicant_signature_date)}
          />
          <ReviewItem
            label="Acknowledgement"
            value={formData.applicant_acknowledgement ? 'Confirmed' : 'Not confirmed'}
          />
        </div>
      </div>
    </div>
  );
}