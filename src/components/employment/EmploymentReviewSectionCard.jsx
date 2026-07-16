export default function EmploymentReviewSectionCard({
	title,
	onEdit,
	editLabel,
	children,
	className = '',
}) {
	const cardClassName = ['employment-review-section-card', className]
		.filter(Boolean)
		.join(' ')

	return (
		<section className={cardClassName}>
			<div className='employment-review-section-card__header'>
				<h3 className='employment-review-section-card__title'>{title}</h3>

				{onEdit && (
					<button
						type='button'
						className='employment-review-section-card__edit secondary-button'
						onClick={onEdit}
					>
						{editLabel || `Edit ${title}`}
					</button>
				)}
			</div>

			<div className='employment-review-section-card__content'>{children}</div>
		</section>
	)
}