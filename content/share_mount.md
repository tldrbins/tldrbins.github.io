---
title: "Mount Share"
date: 2024-6-26
tags: ["smb", "share", "mount", "cifs", "enum", "nfs"]
---

---
### NFS

#### List share

```bash
showmount -e 10.10.11.10
```

#### Mount share

```bash
sudo mount -t nfs 10.10.11.10:/share /mnt/share/
```

#### Unmount share

```bash
sudo umount /mnt/share/
```

#### Others

```bash
# Check all mounted drives
mount
```

```bash
# Check how shares are mounted
cat /etc/exports
```

<br>

```bash
+-----------------------------------------------------------------------------------------+
| root_squash  : running as root on local system will be treated as nobody user in target |
| no_all_squash: every other users permission will translate from local system to target  |
+-----------------------------------------------------------------------------------------+
```

<br>

```bash
# Add dummy user
sudo useradd dummy
```

```bash
# Change uid
sudo usermod -u 1001 dummy 
```

```bash
# Switch to dummy user
sudo su dummy -c bash
```

<br>

---

### SMB 

#### Mount share

```bash
sudo mount -t cifs //10.10.11.10/share /mnt
```

```bash
# Without creds
sudo mount -t cifs -o user=,password= //10.10.11.10/share /mnt
```

```bash
# With creds
sudo mount -t cifs -o user=<USER>,pass=<PASSWORD> //10.10.11.10/share /mnt
```

### From inside the target

```powershell
# Mount
net use \\localhost\c$ /u:<DOMAIN>\<USER> <PASSWORD>
```

```powershell
# Check
dir \\localhost\c$\users\administrator\desktop
```

<br>