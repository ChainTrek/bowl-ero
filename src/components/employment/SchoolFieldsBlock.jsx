export default function SchoolFieldsBlock({
  title,
  prefix,
  formData,
  onChange,
}) {
  return (
    <div className="employment-form__school-block">
      <h3>{title}</h3>

      <div className="form-group">
        <label htmlFor={`${prefix}_name`}>School Name & Location</label>
        <input
          id={`${prefix}_name`}
          name={`${prefix}_name`}
          type="text"
          value={formData[`${prefix}_name`]}
          onChange={onChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor={`${prefix}_course_of_study`}>Course of Study</label>
          <input
            id={`${prefix}_course_of_study`}
            name={`${prefix}_course_of_study`}
            type="text"
            value={formData[`${prefix}_course_of_study`]}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${prefix}_years_completed`}>Years Completed</label>
          <input
            id={`${prefix}_years_completed`}
            name={`${prefix}_years_completed`}
            type="text"
            value={formData[`${prefix}_years_completed`]}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor={`${prefix}_diploma_or_degree`}>
          Diploma or Degree Received
        </label>
        <input
          id={`${prefix}_diploma_or_degree`}
          name={`${prefix}_diploma_or_degree`}
          type="text"
          value={formData[`${prefix}_diploma_or_degree`]}
          onChange={onChange}
        />
      </div>
    </div>
  );
}