import inspect
from random import randint

import falcon
import redis

from server.resources.base import BaseResource

POSITIONS = 'positions'


class RedisResource(BaseResource):
    def __init__(self) -> None:
        self.redis = redis.Redis(
            'localhost',
            port=6379,
            db=0,
            decode_responses=True,
            unix_socket_path='/tmp/redis.sock'
        )

    def get_map(self, game_id: int, map_number: int):
        map = self.get_object(f'map:{game_id}', map_number)
        self.set_position(map)
        return map

    def set_position(self, map: dict):
        position_id = map.pop('position_id')
        longitude, latitude = self.redis.geopos(POSITIONS, position_id)[0]
        map['longitude'] = longitude
        map['latitude'] = latitude

    def create_position(self, longitude: float, latitude: float) -> int:
        position_id = self.redis.zcard(POSITIONS) + 1
        self.redis.geoadd(POSITIONS, longitude, latitude, position_id)
        return position_id

    def get_position(self, position_id: int) -> dict:
        longitude, latitude = self.redis.geopos(POSITIONS, position_id)
        return {
            'longitude': longitude,
            'latitude': latitude,
        }

    def create_map(self, game_id: int) -> int:
        level_id = 1
        level = self.get_object('level', level_id)

        place_id = randint(1, int(level['size']))
        place = self.get_object(f'level:{level_id}:place', place_id)

        return self.create_object(
            f'map:{game_id}',
            points=0,
            **place
        )

    def get_object(self, *args) -> dict:
        id = args[-1]
        name = self.construct_collections_name(args)
        obj = self.redis.hgetall(name)
        if not obj:
            raise falcon.HTTPNotFound
        obj['id'] = id
        return obj

    def create_object(self, *args, **kwargs) -> int:
        name = self.construct_collections_name(args)
        object_id = self.redis.incr(f'{name}:counter')
        self.redis.hmset(f'{name}:{object_id}', kwargs)
        return object_id

    def change_object(self, *args, **kwargs):
        name = self.construct_collections_name(args)
        self.redis.hmset(name, kwargs)

    @staticmethod
    def construct_collections_name(args):
        return ':'.join(map(str, args))

    types = dict()

    def create(self, obj):
        cls = type(obj)

        kwargs = {
            key: value
            for key, value in inspect.getmembers(obj)
            if not key.startswith('__')
        }

        if cls not in self.types:
            kwargs['id'] = 0
            self.types[cls] = {key: type(value) for key, value in kwargs}

        id = self.create_object(self.get_name(cls), **kwargs)
        return id

    def get(self, cls, id):
        kwargs = self.get_object(self.get_name(cls), id)
        types = self.types[cls]
        kwargs = {key: types[key](value) for key, value in kwargs}
        id = kwargs.pop('id')
        obj = cls(**kwargs)
        obj.id = id
        return obj

    @staticmethod
    def get_name(cls: type) -> str:
        return cls.__name__.lower()
