import falcon
import geopy.distance

from server.resources.redis import RedisResource


class Resource(RedisResource):
    def on_post(self, request: falcon.Request, response: falcon.Response, game_id: int):
        dist = geopy.distance.vincenty()
        response.media = self.get_game(game_id)

    def get_game(self, game_id: int):
        game = self.get_object('game', game_id)
        map_number = game.pop('map_number')
        game['current_map'] = self.get_map(game_id, map_number)
        return game
