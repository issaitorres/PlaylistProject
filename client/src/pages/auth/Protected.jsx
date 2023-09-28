import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'


const Protected = () => {
    const [cookies, setCookies] = useCookies(["access_token"])
    const accessToken = cookies?.access_token != undefined
    return (
        accessToken ? <Outlet /> : <Navigate to="/" />
    )
}

export default Protected