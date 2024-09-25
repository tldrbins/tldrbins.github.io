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

```console {class="sample-code"}
$ impacket-smbserver share . -smb2support
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
impacket-smbserver share . -smb2support -username '<USER>' -password '<PASSWORD>'
```

```console {class="sample-code"}
$ impacket-smbserver share . -smb2support -username 'test' -password 'test'
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```

<small>*Note: Sometimes smb server with creds may not work*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
impacket-smbserver share .
```

```console {class="sample-code"}
$ impacket-smbserver share .                                               
Impacket v0.12.0.dev1+20240730.164349.ae8b81d7 - Copyright 2023 Fortra

[*] Config file parsed
[*] Callback added for UUID 4B324FC8-1670-01D3-1278-5A47BF6EE188 V:3.0
[*] Callback added for UUID 6BFFD098-A112-3610-9833-46C3F87E345A V:1.0
[*] Config file parsed
[*] Config file parsed
[*] Config file parsed
```

{{< /tabcontent >}}
