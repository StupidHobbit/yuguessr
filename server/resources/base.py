import falcon


class BaseResource:
    def on_get(self, request: falcon.Request, response: falcon.Response):
        raise NotImplemented

    def on_post(self, request: falcon.Request, response: falcon.Response):
        raise NotImplemented
