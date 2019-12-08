import falcon


class BaseResource:
    def on_get(self, request: falcon.Request, response: falcon.Response):
        raise falcon.HTTPMethodNotAllowed

    def on_post(self, request: falcon.Request, response: falcon.Response):
        raise falcon.HTTPMethodNotAllowed
