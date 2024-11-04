---
title: "Alternate Data Stream"
date: 2024-7-10
tags: ["File Metadata", "Alternate Data Stream", "ADS", "Windows", "Hidden Files"]
---

### Show ADS

{{< tab set1 tab1 >}}cmd{{< /tab >}}
{{< tab set1 tab2 >}}powershell{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# cmd
cmd /C dir /R <PATH>
```

```console {class="sample-code"}
C:\Users\Administrator\Desktop> cmd /C dir /R C:\users\administrator\desktop
 Volume in drive C has no label.
 Volume Serial Number is 71A1-6FA1

 Directory of C:\users\administrator\desktop

11/08/2017  10:05 AM    <DIR>          .
11/08/2017  10:05 AM    <DIR>          ..
12/24/2017  03:51 AM                36 hm.txt
                                    34 hm.txt:root.txt:$DATA
11/08/2017  10:05 AM               797 Windows 10 Update Assistant.lnk
               2 File(s)            833 bytes
               2 Dir(s)   2,652,184,576 bytes free
```

```console
# Read
more < <FILE>:<STREAM>
```

```console {class="sample-code"}
C:\Users\Administrator\Desktop> more < hm.txt:root.txt
7ddf32e17a6ac5ce04a8ecbf782ca509
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# powershell
Get-Item -Path <PATH>\* -force -stream *
```

```console {class="sample-code"}
PS C:\users\administrator\Desktop> Get-Item -Path C:\users\administrator\Desktop\* -force -stream *

   FileName: C:\users\administrator\Desktop\desktop.ini

Stream                   Length
------                   ------
:$DATA                      282

   FileName: C:\users\administrator\Desktop\hm.txt

Stream                   Length
------                   ------
:$DATA                       36
root.txt                     34

   FileName: C:\users\administrator\Desktop\Windows 10 Update Assistant.lnk

Stream                   Length
------                   ------
:$DATA                      797
```

```console
# Read
Get-Item <FILE> | Get-Content -Stream <STREAM>
```

```console {class="sample-code"}
PS C:\users\administrator\Desktop> Get-Item hm.txt | Get-Content -Stream root.txt
7ddf32e17a6ac5ce04a8ecbf782ca509
```

{{< /tabcontent >}}
