# Map of Thrones
The "Map of Thrones" project is a sandbox project to help our team to build cross-platform and cross-device applications. I will also be using it to test Azure's more advanced traffic management and disaster recovery features.

## Installation
I suggest using Nodist on windows to manage your NodeJS versions. It is not a requirement but mot-server requires the NodeJS v5.6.0+. You may download the Nodist here [https://github.com/marcelklehr/nodist#readme]

Once node is installed just clone the repo and install all dependencies

```
# clone repo
git clone https://github.com/akanieski/mot.git

# install dependencies
npm install
```

## Connection Strings
You will need to setup a configuration file in `./config/local-settings.js`. See below for a sample:

```
module.exports = {
    secret: "d31fb3fa-618d-4615-92f1-1d3a17fa9f1a",
    database: {
        "userName": "<<USERNAME>>",
        "password": "<<PASSWORD>>",
        "server": "<<SERVER IP OR HOST>>",
        "options": {
            "database": "<<Database/Catalog Name>>",
            "encrypt": true, // Required for Azure SQL support
            "requestTimeout": 180000 // 3 minute set for testing purposes
        }
    }
};
```

## Getting Started
Once your configuration is setup you can run the server by running the following command.
```
npm start
```

## Running Tests
Before doing development you should run the end to end tests by running the commands below.

**!!! Warning, the unit tests will destroy and recreate the target database. The codebase comes with a sample of 'Thrones', however you will lose any new data added.**

```
npm test
```
As a result of the tests you should see something like you see below:
```

> bastion@0.1.0 pretest C:\code\mot-server
> node ./tasks/initDb

Database wiped and recreated.

> bastion@0.1.0 test C:\code\mot-server
> mocha tests --timeout 10000

                    _____
                   /      \
                  (____/\  )

                   |___  U?(____
                   _\L.   |      \     ___
                 / /'''\ /.-'     |   |\  |
                ( /  _/u     |    \___|_)_|
                 \|  \\      /   / \_(___ __)
                  |   \\    /   /  |  |    |
                  |    )  _/   /   )  |    |
                  _\__/.-'    /___(   |    |
               _/  __________/     \  |    |
              //  /  (              ) |    |
             ( \__|___\    \______ /__|____|
              \    (___\   |______)_/
               \   |\   \  \     /
                \  | \__ )  )___/
                 \  \  )/  /__(
             ___ |  /_//___|   \_________
               _/  ( / OUuuu    \
              `----'(____________)
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                             __   _____ _
  /\/\   __ _ _ __     ___  / _| /__   \ |__  _ __ ___  _ __   ___  ___
 /    \ / _` | |_ \   / _ \| |_    / /\/ |_ \| |__/ _ \| |_ \ / _ \/ __|
/ /\/\ \ (_| | |_) | | (_) |  _|  / /  | | | | | | (_) | | | |  __/\__ \
\/    \/\__,_| .__/   \___/|_|    \/   |_| |_|_|  \___/|_| |_|\___||___/
           |_|
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

Bastion server is starting up ..

Server listening http://127.0.0.1:3000

Starting test stuite execution..

  Thones api

    √ must list thrones near a given point (5819ms)

  User management api
    √ must sign up a new user (1717ms)
    √ must not sign up a new user if username already is in use (720ms)
    √ must not sign up a new user if email already is in use (662ms)

Test suite completed!

Results:

  4 passing (9s)
```
