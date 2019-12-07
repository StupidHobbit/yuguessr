import sys
import subprocess


subprocess.run(['npm', 'i'], stdout=sys.stdout)
subprocess.run(['npm', 'run', 'build'], stdout=sys.stdout)
