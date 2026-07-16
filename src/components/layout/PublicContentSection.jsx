export default function PublicContentSection({
	children,
	sectionClassName = '',
	containerClassName = '',
}) {
	const sectionClass = ['public-section', sectionClassName].filter(Boolean).join(' ')
	const containerClass = ['public-container', containerClassName]
		.filter(Boolean)
		.join(' ')

	return (
		<section className={sectionClass}>
			<div className={containerClass}>{children}</div>
		</section>
	)
}