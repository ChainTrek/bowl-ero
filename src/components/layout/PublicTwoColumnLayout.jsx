export default function PublicTwoColumnLayout({
	left,
	right,
	className = '',
	leftClassName = '',
	rightClassName = '',
}) {
	const layoutClassName = ['public-two-column-layout', className]
		.filter(Boolean)
		.join(' ')

	const leftPanelClassName = ['public-two-column-layout__left', leftClassName]
		.filter(Boolean)
		.join(' ')

	const rightPanelClassName = ['public-two-column-layout__right', rightClassName]
		.filter(Boolean)
		.join(' ')

	return (
		<div className={layoutClassName}>
			<div className={leftPanelClassName}>{left}</div>
			<div className={rightPanelClassName}>{right}</div>
		</div>
	)
}