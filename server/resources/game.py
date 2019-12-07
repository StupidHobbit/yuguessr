import falcon

from server.resources.redis import RedisResource


class Resource(RedisResource):
    def on_get(self, request: falcon.Request, response: falcon.Response, id: int):
        pass
