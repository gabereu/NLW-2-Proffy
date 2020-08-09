import axios from 'axios'
import { useContext } from 'react'
import { authContext } from '../contexts/authContext'

const api = axios.create({
    baseURL: 'http://localhost:3333',
    withCredentials: true,
})

api.interceptors.response.use(
    response=>response,
    response => {
    const { setSigned } = useContext(authContext);
    if(response.status === 401){
        setSigned(false);
    }
    return response;
})

export default api