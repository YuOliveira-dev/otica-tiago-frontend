import os, time

for root, dirs, files in os.walk('.'):
    if any(ignore in root for ignore in ['.next', 'node_modules', '.git']):
        continue
    for f in files:
        path = os.path.join(root, f)
        try:
            mtime = os.path.getmtime(path)
            if time.time() - mtime < 7200:
                t_str = time.strftime("%H:%M:%S", time.localtime(mtime))
                print(f"{t_str} - {path}")
        except:
            pass
