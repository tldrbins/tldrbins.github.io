---
title: "Custom Word List Generator"
date: 2025-7-14
tags: ["Password Cracking", "Wordlist", "Cewl", "Username"]
---

{{< tab set1 tab1 >}}CeWL{{< /tab >}}
{{< tab set1 tab2 >}}username-anarchy{{< /tab >}}
{{< tabcontent set1 tab1 >}}

```console
# Create Custom Wordlist by Spidering Target
cewl <TARGET> -w wordlist.txt --with-numbers
```

<small>*Ref: [CeWL](https://github.com/digininja/CeWL)*</small>

{{< /tabcontent >}}
{{< tabcontent set1 tab2 >}}

```console
# Create Username Wordlist
./username-anarchy -i <USERS> | tee <USERS_FILE>
```

```console {class="sample-code"}
$ username-anarchy -i users.txt | tee usernames.txt
james
jamesroberts
james.roberts
jamesrob
jamerobe
---[SNIP]---
```

<small>*Ref: [username-anarchy](https://github.com/urbanadventurer/username-anarchy)*</small>

{{< /tabcontent >}}