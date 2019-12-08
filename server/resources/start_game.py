import falcon

from server.resources.redis import RedisResource


class Resource(RedisResource):
    def on_post(self, request: falcon.Request, response: falcon.Response):
        game_id = self.create_game()
        response.media = {'game_id': game_id}

    def create_game(self):
        game_id = self.create_object('game', total_points=0, map_number=1)
        self.create_map(game_id)
        return game_id

    def create_map(self, game_id: int) -> int:
        coordinates, direction = self.generate_random_place()
        return self.create_object(
            f'map:{game_id}',
            points=0,
            latitude=coordinates[0],
            longitude=coordinates[1],
            zenith=direction[0],
            azimuth=direction[1],
        )

    def generate_random_place(self):
        return self.generate_random_coords(), self.generate_random_direction()

    def generate_random_coords(self):
        return (60.099722, 55.177752)

    def generate_random_direction(self):
        return (207.311798, 23.043420)
