import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'

const routes = [
    (
        <Route path="/" component={Dashboard} key="/" />
    )
]

export default routes;