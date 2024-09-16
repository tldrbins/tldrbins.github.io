---
title: "Grep"
date: 2024-7-10
tags: ["grep", "regex", "strings"]
---

#### Basic

```console
grep '<STRING>' <FILE>
```

#### Grep from files recursively (e.g from current directory)

```console
grep -rni '<STRING>' .
```

#### Grep from binary

```console
grep -a '<STRING>' <FILE>
```

#### Grep hash from binary with perl regex

```console
grep -aPo '[a-fA-F0-9]{32}' <FILE>
```

#### Grep from binaries recusively (e.g. from /var/log)

```console
sudo grep -rHa "<STRING>" /var/log
```

#### Find unique char of a file

```console
cat <FILE> | od -cvA none -w1 | sort -bu | tr -d '\n' | tr -d ' '
```
