# Weight Tracker

## requirements

python 3.12 or higher

Create CLI and tools environments:

```powershell
python -m venv app-cli/.venv
python -m venv app-cli/.venv-tools
```

Install dependencies:

``` powershell
# windows
cd app-cli
./.venv/Scripts/python.exe -m pip install -r requirements.txt
./.venv-tools/Scripts/python.exe -m pip install -r requirements-tools.txt
```

```bash
# linux/mac
cd app-cli
./.venv/bin/python -m pip install -r requirements.txt
./.venv-tools/bin/python -m pip install -r requirements-tools.txt
```

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
