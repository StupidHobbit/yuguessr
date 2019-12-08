from os import path

import falcon

from server.resources import main_page, game, start_game, map


def make_app():
    app = falcon.API()

    app.add_static_route('/', path.abspath('build'))

    app.add_route('/', main_page.Resource())
    app.add_route('/game/{game_id:int}', game.Resource())
    app.add_route('/start_game', start_game.Resource())
    app.add_route('/game/{game_id:int}/map/{map_number:int}', map.Resource())
    return app
