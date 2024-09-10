---
title: "SMB Server"
date: 2024-6-26
tags: ["smb", "file transfer", "ntlm", "Windows"]
---

---
### Start a SMB Server for File Transfer

{{< tab set1 tab1 active >}}Anonymous{{< /tab >}}
{{< tab set1 tab2 >}}Authenticate{{< /tab >}}
{{< tab set1 tab3 >}}Older Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
impacket-smbserver share . -smb2support
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
impacket-smbserver share . -smb2support -username <USER> -password <PASSWORD>
```

</div>

<small>*Note: Sometimes smb server with creds may not work*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
impacket-smbserver share .
```

</div>

{{< /tabcontent >}}

<br>
