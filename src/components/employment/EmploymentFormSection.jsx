export default function EmploymentFormSection({
  title,
  description = '',
  children,
}) {
  return (
    <div className="employment-form__section">
      <h2>{title}</h2>
      {description && <p className="employment-form__section-copy">{description}</p>}
      {children}
    </div>
  );
}