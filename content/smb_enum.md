---
title: "SMB Enum"
date: 2024-6-26
tags: ["smb", "enum", "reconnaissance", "domain", "Windows", "ads"]
---

---
### SMB Share Enum

#### Login without password

#### smbmap

```bash
smbmap -H 10.10.11.10 --no-banner
```

```bash
smbmap -H 10.10.11.10 -u null --no-banner
```

```bash
# List known share
smbmap -H 10.10.11.10 -r 'share'
```

#### smbclient

```bash
smbclient -N -L \\\\10.10.11.10\\
```

```bash
#After found an accessible share
smbclient -N \\\\10.10.11.10\\share\\
```

```bash
#After connection
#List all files in a share
recurse ON
```

```bash
ls
```

```bash
#Download all files
mask ""
```

```bash
recurse ON
```

```bash
prompt OFF
```

```bash
mget *
```

```bash
# Fix: Unable to initialize messaging context. protocol negotiation failed: NT_STATUS_CONNECTION_DISCONNECTED
smbclient -N -L \\\\10.10.11.10\\ --option='client min protocol=NT1'
```

#### Login with password

#### smbmap

```bash
smbmap -H 10.10.11.10 -u username -p password
```

```bash
# List known share
smbmap -H 10.10.11.10 -u username -p password -R 'share'
```

```bash
# Download file
smbmap -H 10.10.11.10 -r 'share' --download 'PATH/TO/FILE'
```

```bash
# List files with regex pattern
smbmap -H 10.10.11.10 -u username -p password -r 'share'  -A FILE_PATTERN
```

#### smbclient

```bash
smbclient -L \\\\10.10.11.10\\ -U domain/username%password
```

```bash
#After found an accessible share
smbclient  \\\\10.10.11.10\\share\\ -U domain/username%password
```

<br>

---

### Mount SMB Share

```bash
sudo mount -t cifs "//10.10.11.10/Remote Shares" /mnt
```

```bash
# With creds
sudo mount -t cifs -o ro,username=username,password=password "//10.10.11.10/Remote Shares" /mnt
```

#### Check write permission

```bash
sudo find . -type d | while read directory; do touch ${directory}/test 2>/dev/null && echo "${directory} - write file" && rm ${directory}/test; mkdir ${directory}/test 2>/dev/null && echo "${directory} - write directory" && rmdir ${directory}/test; done
```

```bash
#Check file type you can write
sudo touch {/mnt/,./}test.{lnk,exe,dll,ini}
```

<br>

---

### List Alternate Data Streams (ADS)

```bash
# Inside smbclient session
allinfo "file"
```

```bash
# Example Response
>>>stream: [:Password:$DATA], 15 bytes
```

```bash
# Download specific data stream
get "file:Password"
```

<br>