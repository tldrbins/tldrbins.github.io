---
title: "Grep"
date: 2025-7-25
tags: ["Grep", "Regex", "Strings", "Enumeration", "Files"]
---

#### General

```console
grep '<STRING>' <FILE>
```

#### Grep from Files Recursively

```console
grep -rni '<STRING>' <PATH>
```

#### Grep from Binary

```console
grep -a '<STRING>' <FILE>
```

#### Grep Hash from Binary with Perl Regex

```console
grep -aPo '[a-fA-F0-9]{32}' <FILE>
```

#### Grep from Binaries Recusively

```console
grep -rHa "<STRING>" <PATH>
```

#### Find Unique Char from a File

```console
cat <FILE> | od -cvA none -w1 | sort -bu | tr -d '\n' | tr -d ' '
```
