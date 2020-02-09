from functools import lru_cache
from math import sqrt

import falcon
import geopy.distance

from server.resources.redis import RedisResource


class Resource(RedisResource):
    def on_get(self, request: falcon.Request, response: falcon.Response, game_id: int):
        response.media = self.get_game(game_id)

    def on_put(self, request: falcon.Request, response: falcon.Response, game_id: int):
        game = self.get_game(game_id)
        current_map = game['current_map']

        dist = geopy.distance.vincenty(
            (current_map['longitude'], current_map['latitude']),
            (request.params['longitude'], request.params['latitude']),
        )

        points = self.points_from_distance(dist)

        new_map_id = self.create_map(game_id)

        self.change_object(
            'game',
            game_id,
            total_points=int(game['total_points']) + points,
            map_number=new_map_id,
        )

        self.change_object(
            'map',
            game_id,
            current_map['id'],
            points=points,
        )

        response.media = {
            'distance': dist.meters,
            'points': points,
        }

    MAX_POINTS = 5000

    def points_from_distance(self, dist):
        return int(self.MAX_POINTS - dist.km)

    def get_game(self, game_id: int):
            game = self.get_object('game', game_id)
            map_number = game.pop('map_number')
            game['current_map'] = self.get_map(game_id, map_number)
            return game
