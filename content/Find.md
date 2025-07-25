---
title: "Find"
date: 2025-7-24
tags: ["File Metadata", "Enumeration", "File Attributes", "Hidden Files", "Find", "Linux", "File System", "SUID", "SGID", "Interesting Files", "Locate"]
---

{{< tab set1 tab1 >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Locate a File

```console
locate <FILE>
```

#### Files of Type 'File'

```console
find . -type f
```

#### Find and Open

```console
find / -name <FILE> -exec cat {} \;
```

#### SetUID and SetGID Files

```console
find / -type f -user root \( -perm -4000 -o -perm -2000 \) 2>/dev/null -ls
```

#### Files Owned by User

```console
find / -user <USER> -ls 2>/dev/null | grep -v -e " \/proc" -e " \/sys"
```

#### Files Owned by Group

```console
find / -group <GROUP> 2>/dev/null | grep -v -e ^/proc
```

#### World Writable Files and Directories (Exclude Sticky Bit)

```console
find / -type f,d \( -perm -0002 -a ! -perm /1000 \) 2>/dev/null -ls | grep -v -e " \/proc" -e " \/sys"
```

#### Group Writable Files and Directories (Exclude Sticky Bit)

```console
find / -type f,d \( -perm -0020 -a ! -perm /1000 \) 2>/dev/null -ls | grep -v -e " \/proc" -e " \/sys"
```

#### Files Created between Time Interval

```console
find / -type f -newermt <YYYY_MM_DD_START> ! -newermt <YYYY_MM_DD_END> -ls 2>/dev/null
```

```console {class="sample-code"}
find / -type f -newermt 2024-01-01 ! -newermt 2024-12-31 -ls 2>/dev/null
```

#### Files with Capabilities

```console
find / -exec getcap {} \; 2>/dev/null
```

#### Writable Folders

```console
find . -type d | while read dir; do mkdir ${dir}/test 2>/dev/null && echo "${dir} - directory create OK" && rmdir ${dir}/test; touch ${dir}/test 2>/dev/null && echo "${dir} - file write OK" && rm ${dir}/test; done
```

#### Files Not Modified by dpkg (i.e. Modified by Something Else)

```console
find /lib -type f -printf "%M %n %-6u %-6g %6s %TY-%Tm-%Td %TT %TZ %h/%f\n" | sort -k 6,7 | grep -v ".0000000000"
```

#### Un-owned Files and Directories

```console
find / -type f,d \( -nouser -o -nogroup \) 2>/dev/null -ls
```

{{< /tabcontent >}}
