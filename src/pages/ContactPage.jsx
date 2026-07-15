import { useState } from 'react'
import PublicPageShell from '../components/layout/PublicPageShell'
import PublicInfoPanel from '../components/public/PublicInfoPanel'
import { createPublicMessage } from '../services/supabase/publicContact'

const initialForm = {
	name: '',
	email: '',
	phone: '',
	subject: '',
	message: '',
}

const contactInfoItems = [
	{
		title: 'Visit',
		lines: ['2530 Channing Way', 'Idaho Falls, ID'],
	},
	{
		title: 'Call',
		lines: ['(208) 529-3000'],
	},
	{
		title: 'Best for',
		lines: ['Questions about leagues, events, tournaments, and general info.'],
	},
]

export default function ContactPage() {
	const [formData, setFormData] = useState(initialForm)
	const [submitting, setSubmitting] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')
	const [isSuccess, setIsSuccess] = useState(false)

	function handleChange(event) {
		const { name, value } = event.target

		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	async function handleSubmit(event) {
		event.preventDefault()

		if (!formData.name.trim()) {
			setStatusMessage('Please enter your name.')
			setIsSuccess(false)
			return
		}

		if (!formData.email.trim()) {
			setStatusMessage('Please enter your email address.')
			setIsSuccess(false)
			return
		}

		if (!formData.subject.trim()) {
			setStatusMessage('Please enter a subject.')
			setIsSuccess(false)
			return
		}

		if (!formData.message.trim()) {
			setStatusMessage('Please enter your message.')
			setIsSuccess(false)
			return
		}

		try {
			setSubmitting(true)
			setStatusMessage('')

			await createPublicMessage({
				name: formData.name.trim(),
				email: formData.email.trim(),
				phone: formData.phone.trim() || null,
				subject: formData.subject.trim(),
				message: formData.message.trim(),
			})

			setFormData(initialForm)
			setStatusMessage('Your message has been sent successfully.')
			setIsSuccess(true)
		} catch (error) {
			setStatusMessage(`Unable to send message: ${error.message}`)
			setIsSuccess(false)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<PublicPageShell
			eyebrow='Get In Touch'
			title='Contact Us'
			description='Send a message to Bowl-Ero and a member of the team will review it and get back to you as soon as possible.'
			mainClassName='contact-page'
		>
			<section className='public-section'>
				<div className='public-container'>
					<div className='contact-page__layout'>
						<div className='contact-page__info public-card'>
							<PublicInfoPanel
								eyebrow='Reach Out'
								title='We’d love to hear from you'
								description='Use this form to ask a question, send feedback, or reach out about leagues, tournaments, events, or general information.'
								items={contactInfoItems}
							/>
						</div>

						<div className='contact-page__form-wrapper public-card'>
							<form className='contact-form' onSubmit={handleSubmit}>
								<div className='form-group'>
									<label htmlFor='name'>Name</label>
									<input
										id='name'
										name='name'
										type='text'
										value={formData.name}
										onChange={handleChange}
									/>
								</div>

								<div className='form-row'>
									<div className='form-group'>
										<label htmlFor='email'>Email</label>
										<input
											id='email'
											name='email'
											type='email'
											value={formData.email}
											onChange={handleChange}
										/>
									</div>

									<div className='form-group'>
										<label htmlFor='phone'>Phone</label>
										<input
											id='phone'
											name='phone'
											type='tel'
											value={formData.phone}
											onChange={handleChange}
										/>
									</div>
								</div>

								<div className='form-group'>
									<label htmlFor='subject'>Subject</label>
									<input
										id='subject'
										name='subject'
										type='text'
										value={formData.subject}
										onChange={handleChange}
									/>
								</div>

								<div className='form-group'>
									<label htmlFor='message'>Message</label>
									<textarea
										id='message'
										name='message'
										rows='7'
										value={formData.message}
										onChange={handleChange}
									/>
								</div>

								{statusMessage && (
									<p className={isSuccess ? 'contact-form__success' : 'contact-form__error'}>
										{statusMessage}
									</p>
								)}

								<button type='submit' disabled={submitting}>
									{submitting ? 'Sending...' : 'Send Message'}
								</button>
							</form>
						</div>
					</div>
				</div>
			</section>
		</PublicPageShell>
	)
}