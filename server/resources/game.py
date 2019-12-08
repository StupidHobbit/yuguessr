import falcon

from server.resources.redis import RedisResource


class Resource(RedisResource):
    def on_get(self, request: falcon.Request, response: falcon.Response, game_id: int):
        response.media = self.get_game(game_id)

    def get_game(self, game_id: int):
        return self.get_object('game', game_id)
