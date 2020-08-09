import React, { createContext, useState } from 'react'

interface IAuthContext{
    signed: boolean | undefined,
    setSigned: Function
}

export const authContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {

    const [signed, setSigned] = useState<boolean>();

    return (
        <authContext.Provider value={{signed, setSigned}}>
            {children}
        </authContext.Provider>
    );
}