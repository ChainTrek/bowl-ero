import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../pages/Home'
import AdminLayout from '../components/layout/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import MessagesPage from '../pages/admin/MessagesPage'
import LeaguesPage from '../pages/admin/LeaguesPage'
import ScoresPage from '../pages/admin/ScoresPage'
import HoursPage from '../pages/admin/HoursPage'

export default function AppRouter(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path='messages' element={<MessagesPage />} />
          <Route path='leagues' element={<LeaguesPage />} />
          <Route path='scores' element={<ScoresPage />} />
          <Route path='hours' element={<HoursPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}