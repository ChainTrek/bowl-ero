export default function ReferenceFieldsBlock({
  title,
  prefix,
  formData,
  onChange,
}) {
  return (
    <div className="employment-form__school-block">
      <h3>{title}</h3>

      <div className="form-group">
        <label htmlFor={`${prefix}_name`}>Name</label>
        <input
          id={`${prefix}_name`}
          name={`${prefix}_name`}
          type="text"
          value={formData[`${prefix}_name`]}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${prefix}_address`}>Full Address</label>
        <textarea
          id={`${prefix}_address`}
          name={`${prefix}_address`}
          rows="3"
          value={formData[`${prefix}_address`]}
          onChange={onChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor={`${prefix}_phone`}>Telephone Number</label>
        <input
          id={`${prefix}_phone`}
          name={`${prefix}_phone`}
          type="text"
          value={formData[`${prefix}_phone`]}
          onChange={onChange}
        />
      </div>
    </div>
  );
}