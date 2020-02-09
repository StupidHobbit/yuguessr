import React, { Component, Fragment } from 'react';
import { API_ORIGIN } from '../../config';
import './Map.scss';

class Map extends Component {
    state = {
        guessSelected: false,
    };

    playerId = null;
    playerInstance = null;
    minimapInstance = null;
    minimapContainer = null;
    selectedCoords = null;
    placemark = null;
    minimapContainerId = 'minimap';

    MINIMAP_CENTER = [55.76, 37.64];

    componentDidMount() {
        if (!window.ymaps) {
            // Yandex Maps Script isn't loaded yet, wait for it
            const listener = () => {
                window.removeEventListener('load', listener);
                window.ymaps.ready(this.yaMapsReady);
            };
            window.addEventListener('load', listener);
        } else {
            window.ymaps.ready(this.yaMapsReady);
        }
    }

    componentWillUnmount() {
        this.destroyEverything();
    }

    destroyEverything = () => {
        if (this.playerInstance) {
            this.playerInstance.destroy();
            this.playerInstance = null;
        }
        if (this.minimapInstance) {
            this.minimapInstance.destroy();
            this.minimapInstance = null;
        }
    };

    buildEverything = () => {
        this.buildPanoram();
        this.buildMiniMap();
    };

    reset = () => {
        this.destroyEverything();
        this.buildEverything();
    };

    yaMapsReady = () => {
        this.buildEverything();
    };

    handlePanoramaError = (error) => {
        console.error('Poop: panorama error', error);
    };

    handleMiniMapClick = (e) => {
        const { guessSelected } = this.state;
        if (this.placemark) {
            this.minimapInstance.geoObjects.remove(this.placemark);
            this.placemark = null;
        }
        this.selectedCoords = e.get('coords');
        this.placemark = (
            new ymaps.Placemark(this.selectedCoords, {}, {
                iconLayout: 'default#image',
                iconImageSize: [30, 42],
                iconImageOffset: [-3, -42]
            })
        );
        this.minimapInstance.geoObjects.add(this.placemark);
        if (!guessSelected) {
            this.setState({ guessSelected: true });
        }
    };

    sendGuess = () => {
        const { data: {
            gameId,
        } = {} } = this.props;
        const [longitude, latitude] = this.selectedCoords;
        fetch(`${API_ORIGIN}/game/${gameId}?longitude=${longitude}&latitude=${latitude}`, {
            method: 'PUT',
        }).then((res) => {
            return res.json();
        }).then((data) => {
            // TODO: render the victory screen
        }).catch((err) => {
            this.handlePanoramaError(err);
        });
    };

    buildMiniMap = () => {
        this.minimapInstance = new ymaps.Map(this.minimapContainerId, {
            center: this.MINIMAP_CENTER,
            zoom: 2,
            controls: ['zoomControl'],
        }, {
            suppressMapOpenBlock: true,
        });
        this.minimapInstance.events.add('click', this.handleMiniMapClick);
    };

    buildPanoram = () => {
        const { data: {
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
        const { guessSelected } = this.state;
        const { data: { totalPoints } = {} } = this.props;

        if (!this.playerId) {
            this.playerId = this.generateRandomPlayerID();
        }

        return (
            <Fragment>
                <header className="game-header">Yuguesser, Score: {totalPoints}</header>
                <div className="player" id={this.playerId} />
                <div
                    ref={(el) => {
                        this.minimapContainer = el;
                    }}
                    className="minimap"
                >
                    <div className="minimap__outer-wrapper">
                        <div
                            className="minimap__wrapper"
                            id={this.minimapContainerId}
                        />
                    </div>
                </div>
                <button
                    onClick={this.sendGuess}
                    className={`guess-button ${guessSelected ? 'guess-button_visible' : '' }`}
                >
                    Guess my ass
                </button>
            </Fragment>
        );
    }
}

export default Map;
