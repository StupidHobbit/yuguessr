import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import './Landing.scss';
import { API_ORIGIN } from '../../config';
import Map from '../Map/Map';

class Landing extends Component {
    state = {
        gameState: Landing.STATES.NOT_STARTED,
        metadata: null,
    };

    static STATES = {
        NOT_STARTED: 'notStarted',
        READY: 'ready',
    };

    async startGame() {
        try {
            let res;

            res = await fetch(`${API_ORIGIN}/start_game`, {
                method: 'post',
            });

            const { game_id } = await res.json();

            res = await fetch(`${API_ORIGIN}/game/${game_id}`);

            const { current_map: {
                azimuth,
                latitude,
                longitude,
                zenith,
            } = {}, total_points } = await res.json();

            this.setState({
                gameState: Landing.STATES.READY,
                metadata: {
                    azimuth,
                    latitude,
                    longitude,
                    zenith,
                    gameId: game_id,
                    totalPoints: total_points,
                },
            });
        } catch (err) {
            console.log('HTTP Error');
            console.log(err);
        }
    };

    render() {
        const { gameState, metadata } = this.state;

        if (gameState === Landing.STATES.NOT_STARTED) {
            return (
                <main className="landing">
                    <FontAwesomeIcon className="landing__icon" icon={faGlobe} />
                    <button
                        onClick={() => {
                            this.startGame();
                        }}
                        className="landing__start-game-button"
                    >
                        Start Game
                    </button>
                </main>
            );
        }

        if (gameState === Landing.STATES.READY) {
            return (
                <Map data={metadata} />
            );
        }
    }
}

export default Landing;
