import React, { Component, Fragment } from 'react';
import './Map.scss';

class Map extends Component {
    playerId = null;
    playerInstance = null;

    componentDidMount() {
        if (!window.ymaps) {
            // Yandex Maps Script isn't loaded yet, wait for it
            const listener = () => {
                window.removeEventListener('load', listener);
                window.ymaps.ready(this.buildMap);
            };
            window.addEventListener('load', listener);
        } else {
            window.ymaps.ready(this.buildMap);
        }
    }

    componentWillUnmount() {
        if (this.playerInstance) {
            this.playerInstance.destroy();
            this.playerInstance = null;
        }
    }

    handlePanoramaError = (error) => {
        console.error('Poop: panorama error', error);
    };

    buildMap = () => {
        const { data: {
            gameId, // TODO: send on map submit
            azimuth,
            latitude,
            longitude,
            zenith,
        } = {} } = this.props;
        const ymaps = window.ymaps;

        if (!ymaps) {
            this.handlePanoramaError(new Error('Yandex Maps script didn\'t load'));
            return;
        }

        if (!ymaps.panorama.isSupported()) {
            console.warn('Yandex Maps not supported'); // TODO: render better message
            return;
        }

        // ymaps.panorama.createPlayer will try to find the nearest possible
        // panorama in the area of the specified coordinates
        ymaps.panorama.createPlayer(
            this.playerId,
            [longitude, latitude],
            {
                controls: ['fullscreenControl', 'zoomControl'],
                suppressMapOpenBlock: true,
                layer: 'yandex#panorama',
                direction: [zenith, azimuth],
            },
        )
            .done(
                (player) => {
                    this.playerInstance = player;
                },
                (error) => {
                    this.handlePanoramaError(error);
                },
            );
    };

    generateRandomPlayerID = () => {
        return `player-${String(Math.random()).slice(2)}`;
    };

    render() {
        const { data: { totalPoints } = {} } = this.props;

        if (!this.playerId) {
            this.playerId = this.generateRandomPlayerID();
        }

        return (
            <Fragment>
                <header className="game-header">Yuguesser, Score: {totalPoints}</header>
                <div className="player" id={this.playerId} />
                <div className="minimap" />
            </Fragment>
        );
    }
}

export default Map;
