import EmploymentCardSection from './EmploymentCardSection'

export default function EmployerFieldsBlock({ title, prefix, formData, onChange }) {
	return (
		<EmploymentCardSection title={title}>
			<div className='form-group'>
				<label htmlFor={`${prefix}_name`}>Employer Name</label>
				<input
					id={`${prefix}_name`}
					name={`${prefix}_name`}
					type='text'
					value={formData[`${prefix}_name`]}
					onChange={onChange}
				/>
			</div>

			<div className='employment-form__grid'>
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

				<div className='form-group'>
					<label htmlFor={`${prefix}_dates`}>Dates Employed</label>
					<input
						id={`${prefix}_dates`}
						name={`${prefix}_dates`}
						type='text'
						value={formData[`${prefix}_dates`]}
						onChange={onChange}
					/>
				</div>
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
				<label htmlFor={`${prefix}_supervisor`}>Supervisor Name and Title</label>
				<input
					id={`${prefix}_supervisor`}
					name={`${prefix}_supervisor`}
					type='text'
					value={formData[`${prefix}_supervisor`]}
					onChange={onChange}
				/>
			</div>

			<div className='form-group'>
				<label htmlFor={`${prefix}_reason_for_leaving`}>Reason for Leaving</label>
				<textarea
					id={`${prefix}_reason_for_leaving`}
					name={`${prefix}_reason_for_leaving`}
					rows='3'
					value={formData[`${prefix}_reason_for_leaving`]}
					onChange={onChange}
				/>
			</div>

			<div className='form-group'>
				<label htmlFor={`${prefix}_work_performed`}>Describe the Work Performed</label>
				<textarea
					id={`${prefix}_work_performed`}
					name={`${prefix}_work_performed`}
					rows='4'
					value={formData[`${prefix}_work_performed`]}
					onChange={onChange}
				/>
			</div>
		</EmploymentCardSection>
	)
}