import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import './Landing.scss';
import { API_ORIGIN } from '../../config';

class Landing extends Component {
    async startGame() {
        try {
            let res;

            res = await fetch(`${API_ORIGIN}/start_game`, {
                method: 'post',
            });

            const { game_id } = await res.json();

            console.log(`game_id: ${game_id}`);

            res = await fetch(`${API_ORIGIN}/game/${game_id}`);

            const { map_number, total_points } = await res.json();

            console.log(`map_number: ${map_number}`);
            console.log(`total_points: ${total_points}`);

            res = await fetch(`${API_ORIGIN}/game/${game_id}/map/${map_number}`);

            const { azimuth, latitude, longitude, points, zenith } = await res.json();

            console.log('final data:');
            console.log(`azimuth: ${azimuth}`);
            console.log(`latitude: ${latitude}`);
            console.log(`longitude ${longitude}`);
            console.log(`points: ${points}`);
            console.log(`zenith: ${zenith}`);
            console.log(`total points: ${total_points}`);
        } catch (err) {
            console.log('HTTP Error');
            console.log(err);
        }
    };

    render() {
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
}

export default Landing;
