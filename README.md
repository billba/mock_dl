# mock_dl

## Test your DirectLine v3 clients using this mock

### Clone this repo

### Optionally, create a .env file containing defaults 

`PORT = your_mock_dl_port`

### Configure

`npm install`

### Build & run

`npm run build (or watch)`
`npm run start (or nodewatch)`

### Aim your DirectLine v3 client at this. For WebChat, try

`http://localhost:{your_webchat_port}?s={test}/{area}&domain=http//localhost:{your_mock_dl_port}/mock`

To choose the test case, pass "{test}/{area}" as your Direct Line secret, as follows:

* "works/all": (default) everything works perfectly. Enjoy.
* "expire/{post|get|upload}": specified operation fails due to expired token
* "timeout/{start|post|get|upload}": specified operation takes 60 seconds to respond 
* "{status code}/{start|post|get|upload}"; specified operation fails due to specific status code
