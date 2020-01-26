import inspect

import falcon
import redis

from server.resources.base import BaseResource


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
        return self.get_object(f'map:{game_id}', map_number)

    def get_object(self, name: str, id: int) -> dict:
        obj = self.redis.hgetall(f'{name}:{id}')
        if not obj:
            raise falcon.HTTPNotFound
        obj['id'] = id
        return obj

    def create_object(self, name: str, **kwargs) -> int:
        object_id = self.redis.incr(f'{name}:counter')
        self.redis.hmset(f'{name}:{object_id}', kwargs)
        return object_id

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
