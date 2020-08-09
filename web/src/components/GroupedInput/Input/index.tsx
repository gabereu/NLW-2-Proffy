import React, { InputHTMLAttributes } from 'react'

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({placeholder, id, ...props}) => {
    return (
        <div className='input-groupable'>
            <input type="text" placeholder=' ' id={id} {...props}/>
            <label htmlFor={id}>{placeholder}</label>
        </div>
    )
}

export default Input;
