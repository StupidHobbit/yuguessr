import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import './Landing.scss';

class Landing extends Component {
    render() {
        return (
            <main className="landing">
                <FontAwesomeIcon className="landing__icon" icon={faGlobe} />
                <Link to="/game">
                    <button className="landing__start-game-button">
                        Start Game
                    </button>
                </Link>
            </main>
        );
    }
}

export default Landing;