## Parallel Shell

This is a super simple npm module to run shell commands in parallel. All
processes will share the same stdout/stderr, and if any command exits, the rest are stopped and the exit code carries through.

### Usage

To use the command, simply call it with a set of strings - which correspond to
shell arguments, for example:

```bash
parallelshell "echo 1" "echo 2" "echo 3"
```

This will execute the commands `echo 1` `echo 2` and `echo 3` simultaneously.

Note that on Windows, you need to use double-quotes to avoid confusing the
argument parser.
