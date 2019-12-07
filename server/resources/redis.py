import redis

from server.resources.base import BaseResource


class RedisResource(BaseResource):
    def __init__(self) -> None:
        self.redis = redis.Redis('localhost', port=6379, db=0, decode_responses=True)

    def get_game(self, game_id: int):
        pass

    def create_game(self):
        self.create_map()
        return self.create_object('game', total_points=0, map_number=0)

    def create_map(self, map_number=0):
        return self.create_object(
            f'map:{map_number}',
            points=0,
            coordinates=self.generate_random_coords(),
            direction=self.generate_random_direction()
        )

    def create_object(self, name, **kwargs):
        object_id = self.redis.incr(f'{name}:counter')
        self.redis.hmset(f'{name}:{object_id}', kwargs)
        return object_id

    def generate_random_coords(self):
        return (60.099722, 55.177752)

    def generate_random_direction(self):
        return (207.311798, 23.043420)
