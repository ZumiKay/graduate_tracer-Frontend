import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({
    isAllowed ,
    redirectPath ,
    children,
}) => {
    if(!isAllowed) {
        return <Navigate to={redirectPath} replace/>
    }
    return children ? children: <Outlet/>
}

export default PrivateRoute