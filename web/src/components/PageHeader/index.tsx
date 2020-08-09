import React from 'react'
import { Link } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import backIcon from '../../assets/images/icons/back.svg'

import './styles.css'

interface PageHeaderProps {
    title: string,
    description?: string,
    indicator?: string,
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children, description, indicator }) => {
    return (
        <header className="page-header">
            <div className="top-bar-container">
                <Link to='/inicio'>
                    <img src={backIcon} alt="Voltar"/>
                </Link>
                {indicator}
                <img src={logoImg} alt="Proffy"/>
            </div>
            <div className="header-content">
                <strong>{title}</strong>
                {description && <p>{description}</p>}
                {children}
            </div>
        </header>
    )
}

export default PageHeader;