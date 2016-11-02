# mock_dl

## Test your DirectLine v3 clients using this mock

0. clone this repo

1. Optionally, create a .env file containing defaults 

`PORT = your_favorite_port`

2. Configure

`npm install`

3. Build & run

`npm run build (or watch)`
`npm run start (or nodewatch)`

4. Aim your DirectLine v3 client at this, e.g.

`http://localhost:{your_favorite_port}?segment={test}/{area}`

where `{test}/{area}` is one of the test cases currently listed in index.ts


