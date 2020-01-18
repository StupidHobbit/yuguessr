import falcon
import redis

from server.resources.base import BaseResource


class RedisResource(BaseResource):
    def __init__(self) -> None:
        self.redis = redis.Redis('localhost', port=6379, db=0, decode_responses=True, unix_socket_path='/tmp/redis.sock')

    def get_object(self, name: str, id: int) -> dict:
        obj = self.redis.hgetall(f'{name}:{id}')
        if not obj:
            raise falcon.HTTPNotFound
        return obj

    def create_object(self, name: str, **kwargs) -> int:
        object_id = self.redis.incr(f'{name}:counter')
        self.redis.hmset(f'{name}:{object_id}', kwargs)
        return object_id
