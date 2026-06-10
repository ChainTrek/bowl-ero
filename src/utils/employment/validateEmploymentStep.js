export function validateEmploymentStep(formData, stepKey) {
  switch (stepKey) {
    case 'personal':
      if (!formData.application_date) return 'Please enter the application date.';
      if (!formData.first_name.trim()) return 'Please enter your first name.';
      if (!formData.last_name.trim()) return 'Please enter your last name.';
      if (!formData.email.trim()) return 'Please enter your email.';
      if (!formData.state) return 'Please select your state.';
      return '';

    case 'position':
      if (!formData.position_desired) {
        return 'Please select the position you are applying for.';
      }
      if (!formData.employment_type) {
        return 'Please select an employment type.';
      }
      if (!formData.available_start_date.trim()) {
        return 'Please enter when you are available to begin work.';
      }
      if (!formData.legally_eligible_to_work) {
        return 'Please answer the work eligibility question.';
      }
      if (!formData.over_16) {
        return 'Please answer the age question.';
      }
      if (!formData.has_food_handlers_card) {
        return 'Please answer the food handler’s card question.';
      }
      return '';

    case 'background':
      if (!formData.can_perform_essential_functions) {
        return 'Please answer the essential functions question.';
      }
      if (
        formData.can_perform_essential_functions === 'no' &&
        !formData.essential_functions_explanation.trim()
      ) {
        return 'Please explain why you cannot perform the essential functions.';
      }
      if (!formData.has_convictions) {
        return 'Please answer the convictions question.';
      }
      if (
        formData.has_convictions === 'yes' &&
        !formData.conviction_details.trim()
      ) {
        return 'Please provide details for the convictions question.';
      }
      if (!formData.worked_here_before) {
        return 'Please answer whether you have worked here before.';
      }
      if (!formData.has_company_relatives_or_friends) {
        return 'Please answer whether you have relatives or friends at the company.';
      }
      if (
        formData.has_company_relatives_or_friends === 'yes' &&
        !formData.company_relatives_or_friends_details.trim()
      ) {
        return 'Please provide the relatives or friends details.';
      }
      if (!formData.presently_employed) {
        return 'Please answer whether you are presently employed.';
      }
      if (
        formData.presently_employed === 'yes' &&
        !formData.reason_for_leaving_current_job.trim()
      ) {
        return 'Please explain why you are considering leaving your current job.';
      }
      if (
        formData.presently_employed === 'yes' &&
        !formData.may_contact_current_employer
      ) {
        return 'Please answer whether we may contact your current employer.';
      }
      return '';

    case 'education':
      return '';

    case 'history':
      return '';

    case 'signature':
      if (!formData.applicant_signature.trim()) {
        return 'Please type your signature.';
      }
      if (!formData.applicant_signature_date) {
        return 'Please enter the signature date.';
      }
      if (!formData.applicant_acknowledgement) {
        return 'Please confirm the acknowledgement before submitting.';
      }
      return '';

    default:
      return '';
  }
}