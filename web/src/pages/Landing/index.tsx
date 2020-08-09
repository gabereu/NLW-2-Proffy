import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import landingImg from '../../assets/images/landing.svg'

import studyIcon from '../../assets/images/icons/study.svg'
import giveClassesIcon from '../../assets/images/icons/give-classes.svg'
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg'
import userIcon from '../../assets/images/icons/user.svg'

import api from '../../services/api'

import './styles.css'
import useOnlyAuthenticated from '../../hooks/useOnlyAuthenticated'

export default function Landing() {

    useOnlyAuthenticated();

    const [totalConnections, setTotalConnections] = useState(0);
    const [name, setName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();

    useEffect(() => {
        let mounted = true;

        api.get('/connections')
        .then(response => {
            const {total} = response.data;
            if(mounted){
                setTotalConnections(total);
            }
        })

        api.get('/user/profile')
        .then(response => {
            const {name, avatar} = response.data;
            setName(name)
            setAvatar(avatar)
        })
        
        return () => {
            mounted = false;
        }
    }, []);

    return (
        <div id='page-landing'>

            <header>
                <Link to='/conta' id='page-landing-header-user'>
                    <img src={avatar? avatar : userIcon} alt='avatar' />
                    {name}
                </Link>
                <Link to='/sair' id='page-landing-header-logout'>
                    Sair
                </Link>
            </header>

            <div id="page-landing-content" className="container">
                <div className="logo-container">
                    <img src={logoImg} alt="Proffy"/>
                    <h2>Sua plataforma de estudos online.</h2>
                </div>

                <img src={landingImg} alt="Plataforma de estudos" className="hero-image"/>

                <div className="buttons-container">
                    <Link to="/study" className="study">
                        <img src={studyIcon} alt="Estudar" />
                        Estudar
                    </Link>

                    <Link to="/give-classes" className="give-classes">
                        <img src={giveClassesIcon} alt="Dar aulas" />
                        Dar aulas
                    </Link>
                </div>

                <span className="total-connections">
                    Total de {totalConnections} conexões já realizadas <img src={purpleHeartIcon} alt="Coração Roxo" />
                </span>

            </div>
        </div>
    )
}
