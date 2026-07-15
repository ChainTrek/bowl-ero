export default function PublicInfoPanel({
	eyebrow,
	title,
	description,
	items = [],
	children,
	className = '',
}) {
	const panelClassName = ['public-info-panel', className].filter(Boolean).join(' ')

	return (
		<div className={panelClassName}>
			<div className='public-info-panel__header'>
				{eyebrow && <span className='public-eyebrow'>{eyebrow}</span>}
				{title && <h2>{title}</h2>}
				{description && <p>{description}</p>}
			</div>

			{items.length > 0 && (
				<div className='public-info-panel__items'>
					{items.map(item => (
						<div className='public-info-panel__item' key={item.title}>
							<h3>{item.title}</h3>

							{Array.isArray(item.lines)
								? item.lines.map(line => <p key={line}>{line}</p>)
								: item.content && <p>{item.content}</p>}
						</div>
					))}
				</div>
			)}

			{children}
		</div>
	)
}