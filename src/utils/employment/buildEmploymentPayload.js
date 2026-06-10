function normalizeBoolean(value) {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return null;
}

function normalizeText(value) {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue === '' ? null : trimmedValue;
}

export function buildEmploymentPayload(formData) {
  return {
    application_date: formData.application_date || null,
    first_name: formData.first_name.trim(),
    last_name: formData.last_name.trim(),
    email: formData.email.trim(),
    phone: normalizeText(formData.phone),
    address: normalizeText(formData.address),
    city: normalizeText(formData.city),
    state: formData.state || null,
    zip: normalizeText(formData.zip),

    position_desired: formData.position_desired || null,
    desired_salary: normalizeText(formData.desired_salary),
    employment_type: formData.employment_type || null,
    available_start_date: normalizeText(formData.available_start_date),

    legally_eligible_to_work: normalizeBoolean(formData.legally_eligible_to_work),
    over_16: normalizeBoolean(formData.over_16),
    has_food_handlers_card: normalizeBoolean(formData.has_food_handlers_card),

    can_perform_essential_functions: normalizeBoolean(
      formData.can_perform_essential_functions
    ),
    essential_functions_explanation: normalizeText(
      formData.essential_functions_explanation
    ),

    has_convictions: normalizeBoolean(formData.has_convictions),
    conviction_details: normalizeText(formData.conviction_details),

    worked_here_before: normalizeBoolean(formData.worked_here_before),
    has_company_relatives_or_friends: normalizeBoolean(
      formData.has_company_relatives_or_friends
    ),
    company_relatives_or_friends_details: normalizeText(
      formData.company_relatives_or_friends_details
    ),

    days_hours_available: normalizeText(formData.days_hours_available),
    presently_employed: normalizeBoolean(formData.presently_employed),
    reason_for_leaving_current_job: normalizeText(
      formData.reason_for_leaving_current_job
    ),
    may_contact_current_employer: normalizeBoolean(
      formData.may_contact_current_employer
    ),

    organizations_memberships: normalizeText(formData.organizations_memberships),
    special_training: normalizeText(formData.special_training),

    high_school_name: normalizeText(formData.high_school_name),
    high_school_course_of_study: normalizeText(
      formData.high_school_course_of_study
    ),
    high_school_years_completed: normalizeText(
      formData.high_school_years_completed
    ),
    high_school_diploma_or_degree: normalizeText(
      formData.high_school_diploma_or_degree
    ),

    college_name: normalizeText(formData.college_name),
    college_course_of_study: normalizeText(formData.college_course_of_study),
    college_years_completed: normalizeText(formData.college_years_completed),
    college_diploma_or_degree: normalizeText(
      formData.college_diploma_or_degree
    ),

    trade_school_name: normalizeText(formData.trade_school_name),
    trade_school_course_of_study: normalizeText(
      formData.trade_school_course_of_study
    ),
    trade_school_years_completed: normalizeText(
      formData.trade_school_years_completed
    ),
    trade_school_diploma_or_degree: normalizeText(
      formData.trade_school_diploma_or_degree
    ),

    graduate_work_name: normalizeText(formData.graduate_work_name),
    graduate_work_course_of_study: normalizeText(
      formData.graduate_work_course_of_study
    ),
    graduate_work_years_completed: normalizeText(
      formData.graduate_work_years_completed
    ),
    graduate_work_diploma_or_degree: normalizeText(
      formData.graduate_work_diploma_or_degree
    ),

    employer_1_name: normalizeText(formData.employer_1_name),
    employer_1_phone: normalizeText(formData.employer_1_phone),
    employer_1_address: normalizeText(formData.employer_1_address),
    employer_1_supervisor: normalizeText(formData.employer_1_supervisor),
    employer_1_dates: normalizeText(formData.employer_1_dates),
    employer_1_reason_for_leaving: normalizeText(
      formData.employer_1_reason_for_leaving
    ),
    employer_1_work_performed: normalizeText(formData.employer_1_work_performed),

    employer_2_name: normalizeText(formData.employer_2_name),
    employer_2_phone: normalizeText(formData.employer_2_phone),
    employer_2_address: normalizeText(formData.employer_2_address),
    employer_2_supervisor: normalizeText(formData.employer_2_supervisor),
    employer_2_dates: normalizeText(formData.employer_2_dates),
    employer_2_reason_for_leaving: normalizeText(
      formData.employer_2_reason_for_leaving
    ),
    employer_2_work_performed: normalizeText(formData.employer_2_work_performed),

    reference_1_name: normalizeText(formData.reference_1_name),
    reference_1_address: normalizeText(formData.reference_1_address),
    reference_1_phone: normalizeText(formData.reference_1_phone),

    reference_2_name: normalizeText(formData.reference_2_name),
    reference_2_address: normalizeText(formData.reference_2_address),
    reference_2_phone: normalizeText(formData.reference_2_phone),

    previous_experience: normalizeText(formData.previous_experience),
    why_work_here: normalizeText(formData.why_work_here),

    applicant_signature: formData.applicant_signature.trim(),
    applicant_signature_date: formData.applicant_signature_date || null,
    applicant_acknowledgement: Boolean(formData.applicant_acknowledgement),
  };
}