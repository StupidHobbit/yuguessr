import falcon

from server.resources import main_page, game, start_game


def make_app():
    app = falcon.API()
    app.add_route('/', main_page.Resource)
    app.add_route('/game/{id}', game.Resource)
    app.add_route('/start_game', start_game.Resource)
    return app
