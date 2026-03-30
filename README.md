# Weight Tracker

## requirements

python 3.12 or higher


## githooks setup

`git config core.hooksPath .githooks`


## CLI App Usage

```
Usage: wtrack [OPTIONS] COMMAND [ARGS]...

Options:
  --help   Show this message and exit.

Commands:
  login    aliases: signin
  logout   aliases: signout
  status   aliases: streak
  add      aliases: new, insert
  report   aliases: show, get, list, ls, display
  update   aliases: edit
  remove   aliases: rm, delete
```

## OpenAPI Python Client

The CLI uses a generated Python client (based on OpenAPI doc).

Generate and install locally:

```
./app-cli/generate_client.sh
```
