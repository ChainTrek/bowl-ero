import { Navigate } from 'react-router-dom'
import useAuth from '../../context/useAuth'

export default function ProtectedRoute({ children }) {
	const { isAuthenticated, authLoading } = useAuth()

	if (authLoading) {
		return (
			<p role='status' aria-live='polite'>
				Checking login...
			</p>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to='/admin/login' replace />
	}

	return children
}