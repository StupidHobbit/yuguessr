import React, { Component, Fragment } from 'react';
import './Map.scss';

class Map extends Component {
    playerId = null;
    // coords = [59.938557, 30.316198];
    coords = [59.98282, 30.316198];
    panoramaType = { layer: 'yandex#panorama' };
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
            this.coords,
            { controls: ['fullscreenControl', 'zoomControl'], suppressMapOpenBlock: true, layer: 'yandex#panorama' },
        )
            .done(
                (player) => {
                    this.playerInstance = player;
                    window.PLAYER = player;
                    this.playerInstance.events.add('panoramachange', () => {
                        this.playerInstance.getPanorama()._markers.length = 0;
                    });
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
        if (!this.playerId) {
            this.playerId = this.generateRandomPlayerID();
        }

        return (
            <Fragment>
                <div className="player" id={this.playerId} />
                <header className="game-header">Yuguesser</header>
                <div className="minimap" />
            </Fragment>
        );
    }
}

export default Map;
