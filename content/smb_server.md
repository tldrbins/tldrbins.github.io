---
title: "SMB Server"
date: 2024-6-26
tags: ["Smbclient", "File Transfer", "Windows", "Ntlm"]
---

### Start a SMB Server for File Transfer

{{< tab set1 tab1 active >}}Anonymous{{< /tab >}}
{{< tab set1 tab2 >}}Authenticate{{< /tab >}}
{{< tab set1 tab3 >}}Older Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
impacket-smbserver share . -smb2support
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
impacket-smbserver share . -smb2support -username <USER> -password '<PASSWORD>'
```

<small>*Note: Sometimes smb server with creds may not work*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
impacket-smbserver share .
```

{{< /tabcontent >}}
