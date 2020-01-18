from os import path

import falcon
from falcon_cors import CORS

from server.resources import main_page, game, start_game, map

USER_URL = 'http://localhost:8080'


def make_app():
    cors = CORS(allow_origins_list=[USER_URL])

    app = falcon.API(middleware=[cors.middleware])

    app.add_static_route('/', path.abspath('build'))

    app.add_route('/', main_page.Resource())
    app.add_route('/game/{game_id:int}', game.Resource())
    app.add_route('/start_game', start_game.Resource())
    app.add_route('/game/{game_id:int}/map/{map_number:int}', map.Resource())

    return app
