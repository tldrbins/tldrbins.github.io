---
title: "evil-winrm"
date: 2024-7-27
tags: ["evil-winrm", "remote", "Windows"]
---

---
### Connection Methods

{{< tab set1 tab1 active >}}Password{{< /tab >}}
{{< tab set1 tab2 >}}Hash{{< /tab >}}
{{< tab set1 tab3 >}}Kerberos{{< /tab >}}
{{< tab set1 tab4 >}}crt & key{{< /tab >}}
{{< tabcontent set1 tab1 >}}

<div>

```bash
evil-winrm -i <TARGET> -u <USER> -p <PASSWORD>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

<div>

```bash
evil-winrm -i <TARGET> -u <USER> -H <HASH> 
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab3 >}}

<div>

```bash
# Step 1: Edit '/etc/krb5.conf'

[libdefaults]
    default_realm = <DOMAIN>

[realms]
    <DOMAIN> = {
        kdc = <DC>:88
        admin_server = <DC>
        default_domain = <DOMAIN>
    }
    
[domain_realm]
    .domain.internal = <DOMAIN>
    domain.internal = <DOMAIN>
```

```bash
# Step 2: export .ccache
export KRB5CCNAME=<CCACHE>
```

```bash
# Step 3: Connect
sudo ntpdate -s <DC> && evil-winrm -i <TARGET> -r <DC>
```

</div>

{{< /tabcontent >}}
{{< tabcontent set1 tab4 >}}

<div>

```bash
evil-winrm -i <TARGET> -S -k auth.key -c auth.crt
```

</div>

{{< /tabcontent >}}

<br>