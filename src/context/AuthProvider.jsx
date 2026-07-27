import { useEffect, useMemo, useState } from 'react'
import AuthContext from './AuthContext'
import {
	getCurrentSession,
	onAuthStateChange,
	signInWithEmail,
	signOutUser,
} from '../services/supabase/auth'

export default function AuthProvider({ children }) {
	const [session, setSession] = useState(null)
	const [authLoading, setAuthLoading] = useState(true)

	useEffect(() => {
		let componentIsMounted = true

		async function loadSession() {
			try {
				const currentSession = await getCurrentSession()

				if (componentIsMounted) {
					setSession(currentSession)
				}
			} finally {
				if (componentIsMounted) {
					setAuthLoading(false)
				}
			}
		}

		loadSession()

		const {
			data: { subscription },
		} = onAuthStateChange((_event, newSession) => {
			if (!componentIsMounted) {
				return
			}

			setSession(newSession)
			setAuthLoading(false)
		})

		return () => {
			componentIsMounted = false
			subscription.unsubscribe()
		}
	}, [])

	async function login(email, password) {
		const data = await signInWithEmail(email, password)
		setSession(data.session)
		return data
	}

	async function logout() {
		await signOutUser()
		setSession(null)
	}

	const contextValue = useMemo(
		() => ({
			session,
			user: session?.user ?? null,
			authLoading,
			isAuthenticated: Boolean(session?.user),
			login,
			logout,
		}),
		[session, authLoading],
	)

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	)
}