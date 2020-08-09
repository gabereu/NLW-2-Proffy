import React from 'react'

import './styles.css'

const InputGroup: React.FC = ({children}) => {
    return (
        <div className='input-group'>
            {children}
        </div>
    )
}

export default InputGroup;
