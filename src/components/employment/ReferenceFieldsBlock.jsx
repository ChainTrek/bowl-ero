import EmploymentCardSection from './EmploymentCardSection'

export default function ReferenceFieldsBlock({ title, prefix, formData, onChange }) {
	return (
		<EmploymentCardSection title={title}>
			<div className='form-group'>
				<label htmlFor={`${prefix}_name`}>Name</label>
				<input
					id={`${prefix}_name`}
					name={`${prefix}_name`}
					type='text'
					value={formData[`${prefix}_name`]}
					onChange={onChange}
				/>
			</div>

			<div className='form-group'>
				<label htmlFor={`${prefix}_address`}>Full Address</label>
				<input
					id={`${prefix}_address`}
					name={`${prefix}_address`}
					type='text'
					value={formData[`${prefix}_address`]}
					onChange={onChange}
				/>
			</div>

			<div className='form-group'>
				<label htmlFor={`${prefix}_phone`}>Telephone Number</label>
				<input
					id={`${prefix}_phone`}
					name={`${prefix}_phone`}
					type='text'
					value={formData[`${prefix}_phone`]}
					onChange={onChange}
				/>
			</div>
		</EmploymentCardSection>
	)
}