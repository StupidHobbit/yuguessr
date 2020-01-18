import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import './Landing.scss';

class Landing extends Component {
    startGame = () => {
        console.log('satrt game');
    };

    render() {
        return (
            <main className="landing">
                <FontAwesomeIcon className="landing__icon" icon={faGlobe} />
                <Link
                    onClick={this.startGame}
                    className="landing__start-game-button"
                    to="/game"
                >
                    Start Game
                </Link>
            </main>
        );
    }
}

export default Landing;