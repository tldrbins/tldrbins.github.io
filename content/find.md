---
title: "Find"
date: 2024-6-29
tags: ["find", "linux", "file system", "enum", "suid", "locate"]
---

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Locate a file

<div>

```console
locate <FILE>
```

</div>

#### Find files of type file

<div>

```console
find . -type f
```

</div>

#### Find and Open

<div>

```console
find / -name <FILE> -exec cat {} \;
```

</div>

#### Find SUID bit set files

<div>

```console
find / -type f -user root \( -perm -4000 -o -perm -2000 \) 2>/dev/null -ls
```

</div>

#### Find files owned by user

<div>

```console
find / -user <USER> -ls 2>/dev/null | grep -v -e " \/proc" -e " \/sys"
```

</div>

#### Find files owned by group

<div>

```console
find / -group <GROUP> 2>/dev/null | grep -v -e ^/proc
```

</div>

#### Find files created between 1/1/2024 and 31/12/2024

<div>

```console
find / -type f -newermt 2024-01-01 ! -newermt 2024-12-31 -ls 2>/dev/null
```

</div>

#### Find files with capabilities

<div>

```console
find / -exec getcap {} \; 2>/dev/null
```

</div>

#### Find writable folders

<div>

```console
find . -type d | while read dir; do mkdir ${dir}/test 2>/dev/null && echo "${dir} - directory create OK" && rmdir ${dir}/test; touch ${dir}/test 2>/dev/null && echo "${dir} - file write OK" && rm ${dir}/test; done
```

</div>

#### Find files not modified by dpkg (i.e. modified by something else)

<div>

```console
find /lib -type f -printf "%M %n %-6u %-6g %6s %TY-%Tm-%Td %TT %TZ %h/%f\n" | sort -k 6,7 | grep -v ".0000000000"
```

</div>

{{< /tabcontent >}}

<br>