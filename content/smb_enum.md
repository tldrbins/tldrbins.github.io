---
title: "SMB Enumeration"
date: 2024-6-26
tags: ["smb", "enum", "reconnaissance", "domain", "Windows", "ntlm"]
---

---
### SMB Share Enum

#### Login without password

#### smbmap

```bash
smbmap -H 10.10.11.10
smbmap -H 10.10.11.10 -u null
```

#### smbclient

```bash
smbclient -N -L \\\\10.10.11.10\\

#After found an accessible share
smbclient -N \\\\10.10.11.10\\share\\

#After connection
#List all files in a share
recurse ON
ls

#Download all files
mask ""
recurse ON
prompt OFF
mget *
```

#### Login with password

```bash
smbclient -L \\\\10.10.11.10\\ -U domain/username%password

#After found an accessible share
smbclient  \\\\10.10.11.10\\share\\ -U domain/username%password
```

<br>

---

### Mount SMB Share

```bash
sudo mount -t cifs "//10.10.11.10/Remote Shares" /mnt
```

#### Check write permission

```bash
sudo find . -type d | while read directory; do touch ${directory}/test 2>/dev/null && echo "${directory} - write file" && rm ${directory}/test; mkdir ${directory}/test 2>/dev/null && echo "${directory} - write directory" && rmdir ${directory}/test; done

#Check file type you can write
sudo touch {/mnt/,./}test.{lnk,exe,dll,ini}
```

<br>