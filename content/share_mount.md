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
sudo mount -t cifs "//10.10.11.10/Remote Shares" /mnt
```

<br>