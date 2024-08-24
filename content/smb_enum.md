---
title: "SMB Enum"
date: 2024-6-26
tags: ["smb", "enum", "reconnaissance", "<DOMAIN>", "Windows", "ads", "sid", "ad"]
---

---
### SMB Share Enum

#### nmap script

```bash
sudo nmap --script=smb-enum-shares -p 445 <TARGET>
```

#### Login without password

#### smbmap

```bash
smbmap -H <TARGET> --no-banner
```

```bash
smbmap -H <TARGET> -u null --no-banner
```

```bash
# List known share
smbmap -H <TARGET> -r <SHARE>
```

#### smbclient

```bash
smbclient -N -L \\\\<TARGET>\\
```

```bash
# After found an accessible share
smbclient -N \\\\<TARGET>\\<SHARE>\\
```

```bash
# Fix: Unable to initialize messaging context. protocol negotiation failed: NT_STATUS_CONNECTION_DISCONNECTED
smbclient -N -L \\\\<TARGET>\\ --option='client min protocol=NT1'
```

#### Login with password

#### smbmap

```bash
smbmap -H <TARGET> -u <USER> -p <PASSWORD>
```

```bash
# List known share
smbmap -H <TARGET> -u <USER> -p <PASSWORD> -R <SHARE>
```

```bash
# Download file
smbmap -H <TARGET> -r <SHARE> --download <PATH/TO/FILE>
```

```bash
# List files with regex pattern
smbmap -H <TARGET> -u <USER> -p <PASSWORD> -r <SHARE> -A <FILE_PATTERN>
```

#### smbclient

```bash
smbclient -L \\\\<TARGET>\\ -U <DOMAIN>/<USER>%<PASSWORD>
```

```bash
# After found an accessible share
smbclient  \\\\<TARGET>\\<SHARE>\\ -U <DOMAIN>/<USER>%<PASSWORD>
```

#### smbclient Basic Commands

```bash
# List all files in a share
recurse ON
```

```bash
ls
```

```bash
# Download all files
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

#### impacket-smbclient (Kerberos)

```bash
impacket-smbclient <DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN> -k -no-pass
```

<br>

---

#### SID Brute

```bash
# Null auth allowed
impacket-lookupsid test@<DOMAIN> -no-pass
```

<br>

---

### Mount SMB Share

```bash
sudo mount -t cifs //<TARGET>/<SHARE> /mnt
```

```bash
# With creds
sudo mount -t cifs -o ro,user=<USER>,password=<PASSWORD> //<TARGET>/<SHARE> /mnt
```

#### Check write permission

```bash
sudo find . -type d | while read directory; do touch ${directory}/test 2>/dev/null && echo "${directory} - write file" && rm ${directory}/test; mkdir ${directory}/test 2>/dev/null && echo "${directory} - write directory" && rmdir ${directory}/test; done
```

```bash
#Check file type you can write
sudo touch {/mnt/,./}test.{dll,exe,ini,lnk}
```

<br>

---

### List Alternate Data Streams (ADS)

```bash
# Inside smbclient session
allinfo <FILE>
```

```bash
# Example Response
>>>stream: [:Password:$DATA], 15 bytes
```

```bash
# Download specific data stream
get "<FILE>:Password"
```

<br>

---

### Change SMB password (With old creds)

```bash
smbpasswd -r <TARGET> -U <USER>
```

<br>