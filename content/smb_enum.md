---
title: "SMB Enum"
date: 2024-6-26
tags: ["smb", "enum", "reconnaissance", "domain", "Windows", "ads", "sid", "ad"]
---

---
### SMB Share Enum

{{< tab set1 tab1 active >}}nmap{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
sudo nmap --script=smb-enum-shares -p 445 <TARGET>
```

</div>

{{< /tabcontent >}}

#### Anonymous Login

{{< tab set2 tab1 active >}}smbmap{{< /tab >}}
{{< tab set2 tab2 >}}smbclient{{< /tab >}}
{{< tab set2 tab3 >}}impacket{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

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

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

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

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab3 >}}

<div>

```bash
# SID brute, if null auth allowed
impacket-lookupsid test@<DOMAIN> -no-pass
```

</div>

{{< /tabcontent >}}

#### Authenticated

{{< tab set3 tab1 active >}}smbmap{{< /tab >}}
{{< tab set3 tab2 >}}smbclient{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

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

</div>

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}


```bash
smbclient -L \\\\<TARGET>\\ -U <DOMAIN>/<USER>%<PASSWORD>
```

```bash
# After found an accessible share
smbclient  \\\\<TARGET>\\<SHARE>\\ -U <DOMAIN>/<USER>%<PASSWORD>
```

{{< /tabcontent >}}

#### Authenticated with Kerberos

{{< tab set4 tab1 active >}}impacket{{< /tab >}}
{{< tabcontent set4 tab1 >}}

<div>

```bash
impacket-smbclient <DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN> -k -no-pass
```

</div>

{{< /tabcontent >}}

#### Basic commands

<div>

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

</div>

#### List Alternate Data Streams (ADS)

<div>

```bash
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

</div>


<br>

---

### Mount SMB Share

{{< tab set5 tab1 active >}}Anonymous{{< /tab >}}
{{< tab set5 tab2 >}}Authenticated{{< /tab >}}
{{< tabcontent set5 tab1 >}}

<div>

```bash
sudo mount -t cifs //<TARGET>/<SHARE> /mnt
```

</div>

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

<div>

```bash
sudo mount -t cifs -o ro,user=<USER>,password=<PASSWORD> //<TARGET>/<SHARE> /mnt
```

</div>

{{< /tabcontent >}}


#### Check write permission

<div>

```bash
sudo find . -type d | while read directory; do touch ${directory}/test 2>/dev/null && echo "${directory} - write file" && rm ${directory}/test; mkdir ${directory}/test 2>/dev/null && echo "${directory} - write directory" && rmdir ${directory}/test; done
```

```bash
#Check file type you can write
sudo touch {/mnt/,./}test.{dll,exe,ini,lnk}
```

</div>

<br>

---

### Change SMB password (With old password)

<div>

```bash
smbpasswd -r <TARGET> -U <USER>
```

</div>

<br>