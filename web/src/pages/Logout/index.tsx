import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import api from '../../services/api';

const Logout = () => {

    const history = useHistory();

    useEffect(() => {
        let mounted = true;

        api.post('/user/logout')
        .then(()=>{
            if(mounted){
                history.push('/');
            }
        })

        return () => {
            mounted = false;
        }
    })

    return (
        <>
            
        </>
    )
}

export default Logout
