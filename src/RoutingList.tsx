import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import TagTable from './components/TagTable'

interface RouteProps {
    path: string;
    component: React.ComponentType<any>; // https://medium.com/octopus-wealth/authenticated-routing-with-react-react-router-redux-typescript-677ed49d4bd6
}

const routes: RouteProps[] = [
    {
        path: "/", component: Dashboard,
    },
    {
        path: "/tags", component: TagTable,
    }
]

function RoutingList() {
    const components = routes.map((item) => {
        const exact = item.path.split('/').length === 2;
        return <Route exact={exact} path={item.path} component={item.component} key={item.path} />;
    })
    return <>{components}</>
}

export default RoutingList;