import falcon

from server.resources.base import BaseResource


class Resource(BaseResource):
    def on_get(self, request: falcon.Request, response: falcon.Response):
        pass
