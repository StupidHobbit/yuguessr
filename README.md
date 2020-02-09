# YaGuesser

Geoguessr based on Yandex Maps

## API documentation

### POST `/start_game`

#### Description

Start game and return it id

##### Response format

- `game_id: number` - id of the game

##### Response example

```json
{
  "game_id": 3
}
```

### GET `/game/{game_id}`

#### Description

Get information about game with id = {game_id}

##### Response format

- `total_points: string` amount of points earned by player in that game throughout all maps
- `current_map: ↓` data about the current map
        - `azimuth: number`
        - `latitude: number`
        - `longitude: number`
        - `zenith: number`

##### Response example

```json
{
  "total_points": "0",
  "current_map": {
    "longitude": 30.316198,
    "latitude": 59.938557,
    "zenith": 207.311798,
    "azimuth": 23.04342
  }
}
```

### PUT `/game/{game_id}/`

Guess position for game with id = {game_id} for current_map

##### Request params

- `longitude: float` 
- `latitude: float` 

##### Response format

- `distance: string` distance (meters) between real position and the guessed one
- `points: int` amount of earned points for the current map 

##### Response example:

```json
{
    "distance": 22.26535965421287,
    "points": 4999
}
```

### GET `/game/{game_id}/map/{map_number}`

Get information about map with number = {map_number} for game with id = {game_id}

##### Response format

- `total_points: string` amount of points earned by player in that game throughout all maps
- `current_map: ↓` data about the current map
        - `azimuth: number`
        - `latitude: number`
        - `longitude: number`
        - `zenith: number`

##### Response example:

```json
{
  "total_points": "0",
  "current_map": {
    "longitude": 30.316198,
    "latitude": 59.938557,
    "zenith": 207.311798,
    "azimuth": 23.04342
  }
}
```
