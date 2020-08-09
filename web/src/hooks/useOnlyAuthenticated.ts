import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { authContext } from '../contexts/authContext'
import api from '../services/api';

const useOnlyAuthenticated = () => {
    const { signed, setSigned } = useContext(authContext);

    const history = useHistory();

    useEffect(() => {
        let mounted = true;

        if(signed === false){
            history.push('/');
        }
        
        if(signed === undefined){
            api.get('/user/isAuthenticated')
            .then(()=>{
                if(mounted)
                    setSigned(true)
            })
            .catch(()=>{
                if(mounted)
                    setSigned(false)
            })
        }

        return () => {
            mounted = false;
        }
    }, [signed, history, setSigned])
    
    return signed;
}

export default useOnlyAuthenticated;