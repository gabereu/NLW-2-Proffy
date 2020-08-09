import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import TeacherList from './pages/TeacherList'
import TeacherForm from './pages/TeacherForm'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import RedefinePassword from './pages/RedefinePassword'
import Logout from './pages/Logout'
import Account from './pages/Account'

import { AuthProvider } from './contexts/authContext'

export default function Routes() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Route path='/' component={Login} exact />
                <Route path='/cadastro' component={Register} />
                <Route path='/esqueciminhasenha' component={ForgotPassword} />
                <Route path='/redefinir_senha/:token' component={RedefinePassword} />
                <Route path='/sair' component={Logout} />
                <Route path='/inicio' component={Landing} />
                <Route path='/conta' component={Account} />
                <Route path='/study' component={TeacherList} />
                <Route path='/give-classes' component={TeacherForm} />
            </AuthProvider>
        </BrowserRouter>
    )
}