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

#### Others

```bash
# Check all mounted drives
mount

# Check how shares are mounted
cat /etc/exports

# root_squash  : running as root on local system will be treated as the default nobody user in target
# no_all_squash: every other users permission will translate from local system to target
```

<br>

---

### SMB 

#### Mount share

```bash
sudo mount -t cifs //10.10.11.10/share /mnt

# With creds
sudo mount -t cifs -o user=username,pass=password //10.10.11.10/share /mnt
```

<br>