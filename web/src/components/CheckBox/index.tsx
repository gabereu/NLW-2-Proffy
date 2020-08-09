import React, { InputHTMLAttributes } from 'react'

import './styles.css'

interface CheckBoxProsp extends InputHTMLAttributes<HTMLInputElement>{
    label?: string,
}

const CheckBox: React.FC<CheckBoxProsp> = ({ label='', ...props }) => {
    return (
        <label className="checkbox-container">
            {label}
            <input type="checkbox" {...props} />
            <span className="checkbox-checkmark"></span>
        </label>
    )
}

export default CheckBox
