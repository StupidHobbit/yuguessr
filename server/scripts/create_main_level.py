from dataclasses import dataclass

from server.resources.redis import RedisResource


@dataclass
class Place:
    latitude: float
    longitude: float
    zenith: float = 60.
    azimuth: float = 200.


class LevelCreator(RedisResource):
    def __init__(self, title):
        super().__init__()
        self.title = title

    def create(self, *places: Place):
        level_id = self.create_object('level', title=self.title, size=len(places))
        for place in places:
            self.create_object(f'level:{level_id}:place', **place.__dict__)


if __name__ == '__main__':
    LevelCreator('world').create(
        Place(60.099722, 55.177752, 207.311798, 23.043420),
        Place(60.099722, 55.177752, 105.311798, 61.043420),
    )
