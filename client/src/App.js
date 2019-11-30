import React, { Fragment, Component } from 'react';
import './App.scss';
import Map from './components/Map/Map';

class App extends Component {
    state = {
        showMap: true,
    };

    render() {
        const { showMap } = this.state;
        return (
            <Fragment>
            <h1>YuGuesser</h1>
            <button onClick={() => {
                this.setState(({ showMap: prevShowMap }) => ({
                    showMap: !prevShowMap,
                }));
            }}>Toggle Map</button>
            { showMap && <Map/> }
            </Fragment>
        );
    }
}

export default App;
