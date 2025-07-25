---
title: "IMAP"
date: 2024-7-9
tags: ["Imap", "Imaps", "Mail", "Email", "Openssl", "Enumeration"]
---

### IMAP/IMAPS

```console
# Connect to IMAP over ssl
rlwrap openssl s_client -connect <TARGET>:993
```

```console {class="sample-code"}
$ rlwrap openssl s_client -connect 10.10.10.197:993
Connecting to 10.10.10.197
CONNECTED(00000003)
Can't use SSL_get_servername
depth=0 CN=localhost, OU=Automatically-generated IMAP SSL key, O=Courier Mail Server, L=New York, ST=NY, C=US
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN=localhost, OU=Automatically-generated IMAP SSL key, O=Courier Mail Server, L=New York, ST=NY, C=US
verify error:num=10:certificate has expired
notAfter=May 14 17:14:21 2021 GMT
verify return:1
depth=0 CN=localhost, OU=Automatically-generated IMAP SSL key, O=Courier Mail Server, L=New York, ST=NY, C=US
notAfter=May 14 17:14:21 2021 GMT
verify return:1
---
Certificate chain
 0 s:CN=localhost, OU=Automatically-generated IMAP SSL key, O=Courier Mail Server, L=New York, ST=NY, C=US
   i:CN=localhost, OU=Automatically-generated IMAP SSL key, O=Courier Mail Server, L=New York, ST=NY, C=US
   a:PKEY: rsaEncryption, 3072 (bit); sigalg: RSA-SHA256
   v:NotBefore: May 14 17:14:21 2020 GMT; NotAfter: May 14 17:14:21 2021 GMT
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIE6zCCA1OgAwIBAgIBATANBgkqhkiG9w0BAQsFADCBjjESMBAGA1UEAxMJbG9j
YWxob3N0MS0wKwYDVQQLEyRBdXRvbWF0aWNhbGx5LWdlbmVyYXRlZCBJTUFQIFNT
TCBrZXkxHDAaBgNVBAoTE0NvdXJpZXIgTWFpbCBTZXJ2ZXIxETAPBgNVBAcTCE5l
dyBZb3JrMQswCQYDVQQIEwJOWTELMAkGA1UEBhMCVVMwHhcNMjAwNTE0MTcxNDIx
WhcNMjEwNTE0MTcxNDIxWjCBjjESMBAGA1UEAxMJbG9jYWxob3N0MS0wKwYDVQQL
EyRBdXRvbWF0aWNhbGx5LWdlbmVyYXRlZCBJTUFQIFNTTCBrZXkxHDAaBgNVBAoT
E0NvdXJpZXIgTWFpbCBTZXJ2ZXIxETAPBgNVBAcTCE5ldyBZb3JrMQswCQYDVQQI
EwJOWTELMAkGA1UEBhMCVVMwggGiMA0GCSqGSIb3DQEBAQUAA4IBjwAwggGKAoIB
gQDCzBP4iuxxLmXPkmi5jABQrywLJK0meyW49umfYhqayBH7qtuIjyAmznnyDIR0
543qHgWAfSvGHLFDB9B1wnkvAU3aprjURn1956X/4jEi9xmhRwvum5T+vp3TT96d
JgW9SSLiPFQty5eVrKuQvg1bZg/Vjp7CUUQ0+7PmdylMOipohls5RDEppCDGFmiS
HN0ZayXpjd/kwqZ/O9uTJGHOzagY+ruTYAx3tanO4oDwdrz9FPr3S2KNPTjjtzqf
CPdcsi+6JTQJI03eMEftBKo3HZTp7Hx6FObZcvcNskTLqtsYZYuzHS7KQwiuTAJ5
d/ZKowCeJDaVlS35tQleisu+pJCkwcStpM1BJ51UQRZ5IpvItTfnrChEa1uyTlAy
ZIOQK2/+34K2ZrldYWyfKlYHxieGZgzQXLo/vyW/1gqzXy7KHx+Uuf4CAzzOP1p3
8QNmvsqkJrQMuH3XPXLswr9A1gPe7KTLEGNRJSxcGF1Q25m4e04HhZzK76KlBfVt
IJ0CAwEAAaNSMFAwDAYDVR0TAQH/BAIwADAhBgNVHREEGjAYgRZwb3N0bWFzdGVy
QGV4YW1wbGUuY29tMB0GA1UdDgQWBBTylxdM/AHlToKxNvmnPdXJCjjbnDANBgkq
hkiG9w0BAQsFAAOCAYEAAo7NqfYlXSEC8q3JXvI5EeVpkgBDOwnjxuC/P5ziEU0c
PRx6L3w+MxuYJdndC0hT9FexXzSgtps9Xm+TE81LgNvuipZ9bulF5pMmmO579U2Y
suJJpORD4P+65ezkfWDbPbdKyHMeRvVCkZCH74z2rCu+OeQTGb6GLfaaB7v9dThR
rfvHwM50hxNb4Zb4of7Eyw2OJGeeohoG4mFT4v7cu1WwimsDF/A7OCVOmvvFWeRA
EjdEReekDJsBFpHa8uRjxZ+4Ch9YvbFlYtYi6VyXV1AFR1Mb91w+iIitc6ROzjJ2
pVO69ePygQcjBRUTDX5reuBzaF5p9/6Ta9HP8NDI9+gdw6VGVTmYRJUbj7OeKSUq
FWUmtZYC288ErDAZ7z+6VqJtZsPXIItZ8J6UZE3zBclGMcQ7peL9wEvJQ8oSaHHM
AmgHIoMwKXSNEkHbBD24cf9KwVhcyJ4QCrSJBMAys98X6TzCwQI4Hy7XyifU3x/L
XUFD0JSVQp4Rmcg5Uzuk
-----END CERTIFICATE-----
subject=CN=localhost, OU=Automatically-generated IMAP SSL key, O=Courier Mail Server, L=New York, ST=NY, C=US
issuer=CN=localhost, OU=Automatically-generated IMAP SSL key, O=Courier Mail Server, L=New York, ST=NY, C=US
---
No client certificate CA names sent
Peer signing digest: SHA256
Peer signature type: RSA-PSS
Server Temp Key: X25519, 253 bits
---
SSL handshake has read 1947 bytes and written 518 bytes
Verification error: certificate has expired
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server public key is 3072 bit
This TLS version forbids renegotiation.
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 10 (certificate has expired)
---
* OK [CAPABILITY IMAP4rev1 UIDPLUS CHILDREN NAMESPACE THREAD=ORDEREDSUBJECT THREAD=REFERENCES SORT QUOTA IDLE AUTH=PLAIN ACL ACL2=UNION ENABLE UTF8=ACCEPT] Courier-IMAP ready. Copyright 1998-2018 Double Precision, Inc.  See COPYING for distribution information.
```

```console
# Login
a LOGIN <USER> <PASSWORD>
```

```console {class="sample-code"}
a LOGIN paulbyrd ^(#J@SkFv2[%KhIxKk(Ju`hqcHl<:Ht
* OK [ALERT] Filesystem notification initialization error -- contact your mail administrator (check for configuration errors with the FAM/Gamin library)
a OK LOGIN Ok.
```

```console
# List all mailboxes
a LIST "" "*"
```

```console {class="sample-code"}
a LIST "" "*"
* LIST (\Unmarked \HasChildren) "." "INBOX"
* LIST (\HasNoChildren) "." "INBOX.Trash"
* LIST (\HasNoChildren) "." "INBOX.Sent"
* LIST (\HasNoChildren) "." "INBOX.Deleted Items"
* LIST (\HasNoChildren) "." "INBOX.Sent Items"
a OK LIST completed
```

```console
# Select a mailbox (e.g. Inbox)
a SELECT <MAIL_BOX>
```

```console {class="sample-code"}
a SELECT "INBOX.Sent Items"
* FLAGS (\Draft \Answered \Flagged \Deleted \Seen \Recent)
* OK [PERMANENTFLAGS (\* \Draft \Answered \Flagged \Deleted \Seen)] Limited
* 2 EXISTS
* 0 RECENT
* OK [UIDVALIDITY 589480766] Ok
* OK [MYRIGHTS "acdilrsw"] ACL
a OK [READ-WRITE] Ok
```

```console
# Get mail from mailbox (e.g. #1)
a FETCH <NUM> BODY.PEEK[]
```

```console {class="sample-code"}
a FETCH 1 BODY.PEEK[]
* 1 FETCH (BODY[] {2167}
MIME-Version: 1.0
To: root <root@debian>
From: Paul Byrd <paulbyrd@sneakymailer.htb>
Subject: Password reset
Date: Fri, 15 May 2020 13:03:37 -0500
Importance: normal
X-Priority: 3
Content-Type: multipart/alternative;
        boundary="_21F4C0AC-AA5F-47F8-9F7F-7CB64B1169AD_"

--_21F4C0AC-AA5F-47F8-9F7F-7CB64B1169AD_
Content-Transfer-Encoding: quoted-printable
Content-Type: text/plain; charset="utf-8"

Hello administrator, I want to change this password for the developer accou=
nt

Username: developer
Original-Password: m^AsY7vTKVT+dV1{WOU%@NaHkUAId3]C

Please notify me when you do it=20

--_21F4C0AC-AA5F-47F8-9F7F-7CB64B1169AD_
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="utf-8"

<html xmlns:o=3D"urn:schemas-microsoft-com:office:office" xmlns:w=3D"urn:sc=
hemas-microsoft-com:office:word" xmlns:m=3D"http://schemas.microsoft.com/of=
fice/2004/12/omml" xmlns=3D"http://www.w3.org/TR/REC-html40"><head><meta ht=
tp-equiv=3DContent-Type content=3D"text/html; charset=3Dutf-8"><meta name=
=3DGenerator content=3D"Microsoft Word 15 (filtered medium)"><style><!--
/* Font Definitions */
@font-face
        {font-family:"Cambria Math";
        panose-1:2 4 5 3 5 4 6 3 2 4;}
@font-face
        {font-family:Calibri;
        panose-1:2 15 5 2 2 2 4 3 2 4;}
/* Style Definitions */
p.MsoNormal, li.MsoNormal, div.MsoNormal
        {margin:0in;
        margin-bottom:.0001pt;
        font-size:11.0pt;
        font-family:"Calibri",sans-serif;}
.MsoChpDefault
        {mso-style-type:export-only;}
@page WordSection1
        {size:8.5in 11.0in;
        margin:1.0in 1.0in 1.0in 1.0in;}
div.WordSection1
        {page:WordSection1;}
--></style></head><body lang=3DEN-US link=3Dblue vlink=3D"#954F72"><div cla=
ss=3DWordSection1><p class=3DMsoNormal>Hello administrator, I want to chang=
e this password for the developer account</p><p class=3DMsoNormal><o:p>&nbs=
p;</o:p></p><p class=3DMsoNormal>Username: developer</p><p class=3DMsoNorma=
l>Original-Password: m^AsY7vTKVT+dV1{WOU%@NaHkUAId3]C</p><p class=3DMsoNorm=
al><o:p>&nbsp;</o:p></p><p class=3DMsoNormal>Please notify me when you do i=
t </p></div></body></html>=

--_21F4C0AC-AA5F-47F8-9F7F-7CB64B1169AD_--
)
a OK FETCH completed.
```