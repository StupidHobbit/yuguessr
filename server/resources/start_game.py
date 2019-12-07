import falcon

from server.resources.redis import RedisResource


class Resource(RedisResource):
    def on_post(self, request: falcon.Request, response: falcon.Response):
        pass
