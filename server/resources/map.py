import falcon

from server.resources.redis import RedisResource


class Resource(RedisResource):

    def on_get(self, request: falcon.Request, response: falcon.Response, game_id: int, map_number: int):
        response.media = self.get_map(game_id, map_number)

