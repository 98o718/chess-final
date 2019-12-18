import React from 'react'
import { Route, Redirect, Switch } from 'wouter'
import { NestedRoutes } from '../../utils'
import { List, Create, Edit } from '.'

const MatchesRouter: React.FC = () => {
  return (
    <NestedRoutes path="/matches">
      <Switch>
        <Route path="/">
          <Redirect to="/list/1" />
        </Route>
        <Route path="/list/:page">
          {({ page }) => <List page={parseInt(page)} />}
        </Route>
        <Route path="/create" component={Create} />
        <Route path="/:id/edit" component={Edit} />
        <Route path="/:rest*">
          404, НИЧЕГО НЕ НАЙДЕНО{' '}
          <span role="img" aria-label="clown">
            🤡
          </span>
        </Route>
      </Switch>
    </NestedRoutes>
  )
}

export default MatchesRouter
