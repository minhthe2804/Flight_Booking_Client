import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { path } from './constants/path'
import MainLayout from './Layouts/MainLayout'
import Home from './pages/Home'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    }
  ])
  return routeElements
}
