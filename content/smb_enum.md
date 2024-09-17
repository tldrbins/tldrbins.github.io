---
title: "SMB Enum"
date: 2024-6-26
tags: ["Kerberos", "Nmap", "SID", "Smbclient", "Mount", "Enumeration", "Smb", "Impacket", "Reconnaissance", "Windows", "ADS"]
---

### SMB Share Enum

{{< tab set1 tab1 active >}}nmap{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
sudo nmap --script=smb-enum-shares -p 445 <TARGET>
```

{{< /tabcontent >}}

#### Anonymous Login

{{< tab set2 tab1 active >}}smbmap{{< /tab >}}
{{< tab set2 tab2 >}}smbclient{{< /tab >}}
{{< tab set2 tab3 >}}impacket{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
smbmap -H <TARGET> --no-banner
```

```console
smbmap -H <TARGET> -u null --no-banner
```

```console
# List known share
smbmap -H <TARGET> -r <SHARE>
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
smbclient -N -L \\\\<TARGET>\\
```

```console
# After found an accessible share
smbclient -N \\\\<TARGET>\\<SHARE>\\
```

```console
# Fix: Unable to initialize messaging context. protocol negotiation failed: NT_STATUS_CONNECTION_DISCONNECTED
smbclient -N -L \\\\<TARGET>\\ --option='client min protocol=NT1'
```

{{< /tabcontent >}}
{{< tabcontent set2 tab3 >}}

```console
# SID brute, if null auth allowed
impacket-lookupsid test@<DOMAIN> -no-pass
```

{{< /tabcontent >}}

#### Authenticated

{{< tab set3 tab1 active >}}smbmap{{< /tab >}}
{{< tab set3 tab2 >}}smbclient{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
smbmap -H <TARGET> -u <USER> -p '<PASSWORD>'
```

```console
# List known share
smbmap -H <TARGET> -u <USER> -p '<PASSWORD>' -R <SHARE>
```

```console
# Download file
smbmap -H <TARGET> -r <SHARE> --download <PATH_TO_FILE>
```

```console
# List files with regex pattern
smbmap -H <TARGET> -u <USER> -p '<PASSWORD>' -r <SHARE> -A <FILE_PATTERN>
```

{{< /tabcontent >}}
{{< tabcontent set3 tab2 >}}


```console
smbclient -L \\\\<TARGET>\\ -U '<DOMAIN>/<USER>%<PASSWORD>'
```

```console
# After found an accessible share
smbclient  \\\\<TARGET>\\<SHARE>\\ -U '<DOMAIN>/<USER>%<PASSWORD>'
```

{{< /tabcontent >}}

#### Authenticated with Kerberos

{{< tab set4 tab1 active >}}impacket{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
impacket-smbclient '<DOMAIN>/<USER>:<PASSWORD>@<TARGET_DOMAIN>' -k -no-pass
```

{{< /tabcontent >}}

#### Basic commands

```console
# List all files in a share
recurse ON
```

```console
ls
```

```console
# Download all files
mask ""
```

```console
recurse ON
```

```console
prompt OFF
```

```console
mget *
```

#### List Alternate Data Streams (ADS)

```console
allinfo <FILE>
```

```console
# Example Response
>>>stream: [:Password:$DATA], 15 bytes
```

```console
# Download specific data stream
get "<FILE>:Password"
```


---

### Mount SMB Share

{{< tab set5 tab1 active >}}Anonymous{{< /tab >}}
{{< tab set5 tab2 >}}Authenticated{{< /tab >}}
{{< tabcontent set5 tab1 >}}

```console
sudo mount -t cifs //<TARGET>/<SHARE> /mnt
```

{{< /tabcontent >}}
{{< tabcontent set5 tab2 >}}

```console
sudo mount -t cifs -o ro,user=<USER>,password='<PASSWORD>' //<TARGET>/<SHARE> /mnt
```

{{< /tabcontent >}}


#### Check write permission

```console
sudo find . -type d | while read directory; do touch ${directory}/test 2>/dev/null && echo "${directory} - write file" && rm ${directory}/test; mkdir ${directory}/test 2>/dev/null && echo "${directory} - write directory" && rmdir ${directory}/test; done
```

```console
#Check file type you can write
sudo touch {/mnt/,./}test.{dll,exe,ini,lnk}
```

---

### Change SMB password (With old password)

```console
smbpasswd -r <TARGET> -U <USER>
```
