# Source Academy
This is the one and only repository for running Source Academy.

## Components
### Frontend
1. The Runtime system   `frontend/src/toolchain`.
1. StoryXML player      `frontend/src/story-xml`.
1. Playground           `frontend/src/playground`.
1. Mission Libraries    `priv/assets/lib`.
1. Front Office UI      `frontend/src/common`.

### Backend
1. Business Logic       `lib/source_academy`
1. Front Office         `lib/source_academy_web`
1. Back Office          `lib/source_academy_admin`
1. Path Evaluator       `path_evaluator`

## Developing

### Requirements
You will need:
1. NodeJS (~ stable)
2. Elixir 1.4 and Erlang/OTP 20. **VERSION MUST BE EXACT!**
3. Postgres (~ 9.6)

### Create Development Database
Create a database named `source_academy_dev`.
, with `postgres` as password.
Grant all access to role `postgres`.

### Install Frontend and Backend dependencies
```
mix deps.get
cd frontend && npm install
```

### Initialize Database
```
mix ecto.reset
```

### Run Server
```
mix phx.server
```

## Deployment
TBD

## License
Copyright (c) 2017 Source Academy Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

