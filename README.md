# mock_dl

## Test your DirectLine v3 clients using this mock

0. clone this repo

### Optionally, create a .env file containing defaults 

`PORT = your_favorite_port`

### Configure

`npm install`

### Build & run

`npm run build (or watch)`
`npm run start (or nodewatch)`

### Aim your DirectLine v3 client at this, e.g.

`http://localhost:{your_favorite_port}?segment=mock`

To choose the test case, pass "{test}/{area}" as your authorization token, as follows:

* "works/all": (default) everything works perfectly. Enjoy.
* "expire/[post|get|upload]": specified operation fails due to expired token
* "timeout/[start|post|get|upload]": specified operation takes 60 seconds to respond 
