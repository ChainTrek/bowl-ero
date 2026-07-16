export default function EmploymentCardSection({ title, children, className = '' }) {
	const sectionClassName = ['employment-card-section', className]
		.filter(Boolean)
		.join(' ')

	return (
		<section className={sectionClassName}>
			{title && <h3 className='employment-card-section__title'>{title}</h3>}
			<div className='employment-card-section__content'>{children}</div>
		</section>
	)
}