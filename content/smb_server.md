---
title: "Host a SMB Server"
date: 2024-6-26
tags: ["smb", "file transfer", "ntlm", "Windows"]
---

---
### Start a SMB Server for File Transfer

### Common Use

```bash
impacket-smbserver share . -smb2support
```

### With Creds

```bash
impacket-smbserver share . -smb2support -username <USER> -password <PASSWORD>
```

<small>*Note: Sometimes smb server with creds may not work*</small>

### For older Windows Machines

```bash
impacket-smbserver share .
```

<br>
