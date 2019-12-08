# YaGuesser

Geoguessr based on Yandex Maps

## API documentation
#### POST /start_game
Start game and return it id
##### Response format:
* game_id: string with id of the game
##### Response example:
{"game_id": 3}

#### GET /game/{game_id}
Get information about game with id = {game_id}
##### Response format:
* total_points: string with amount of points earned by player in that game throughout all maps
* map_number: string with number of current map
##### Response example:
{"total_points": "0", "map_number": "0"}

#### GET /game/{game_id}/map/{map_number}
Get information about map with number = {map_number} for game with id = {game_id}
##### Response format:
* points: string with amount of points earned by player for that map
* longitude: string 
* latitude: string 
* zenith: string 
* azimuth: string 
##### Response example:
{"points": "0", "latitude": "60.099722", "longitude": "55.177752", "zenith": "207.311798", "azimuth": "23.04342"}

