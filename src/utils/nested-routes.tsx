import React from 'react'
import { RouteProps, useRouter, useLocation, Router } from 'wouter'

const NestedRoutes: React.FC<RouteProps> = props => {
  const router = useRouter()
  const [location] = useLocation()

  if (!location.startsWith(props.path)) return null
  const newBase = router.base + props.path

  return <Router base={newBase}>{props.children}</Router>
}

export default NestedRoutes
