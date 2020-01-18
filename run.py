import os
import sys
import subprocess
from os import path
from time import sleep

REDIS_VERSION = '5.0.7'


def run():
    redis = run_redis()
    gunicorn = subprocess.Popen(['gunicorn', 'server.main:app', '-c', 'gunicorn_config.py'])
    try:
        while True:
            sleep(1)
    except KeyboardInterrupt:
        redis.terminate()
        gunicorn.terminate()


def run_redis():
    if not path.exists(f'redis/redis-{REDIS_VERSION}'):
        download_redis()
    os.chdir('redis')
    redis = subprocess.Popen([
        f'redis-{REDIS_VERSION}/src/redis-server',
        f'redis-{REDIS_VERSION}/redis.conf'
    ], stdout=sys.stdout)
    os.chdir('..')
    return redis


def download_redis():
    if not path.exists('redis'):
        os.mkdir('redis')
    os.chdir('redis')
    subprocess.call(['wget', f'http://download.redis.io/releases/redis-{REDIS_VERSION}.tar.gz'], stdout=sys.stdout)
    subprocess.call(['tar', 'xzf', f'redis-{REDIS_VERSION}.tar.gz'], stdout=sys.stdout)
    os.chdir(f'redis-{REDIS_VERSION}')
    subprocess.call(['make'], stdout=sys.stdout)
    os.chdir('../..')


if __name__ == '__main__':
    run()
