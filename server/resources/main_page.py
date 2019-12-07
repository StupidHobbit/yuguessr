import os

import falcon

from server.resources.base import BaseResource


class Resource(BaseResource):
    def __init__(self):
        path = 'build/index.html'
        stream = open(path, 'rb')
        self.content_length = os.path.getsize(path)
        self.body = stream.read()

    def on_get(self, request: falcon.Request, response: falcon.Response):
        response.body = self.body
        response.content_length = self.content_length
        response.content_type = 'text/html'
