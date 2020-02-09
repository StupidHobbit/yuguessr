from random import randint

import falcon

from server.resources.redis import RedisResource


class Resource(RedisResource):
    def on_post(self, request: falcon.Request, response: falcon.Response):
        game_id = self.create_game()
        response.media = {'game_id': game_id}

    def create_game(self):
        game_id = self.create_object('game', total_points=0, map_number=1, current_map=1)
        self.create_map(game_id)
        return game_id
