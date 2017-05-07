# Toastman

Toastman is Postman collection processor that helps extend standard postman capabilites. It allows to chain and reuse requests from Postman collection, call them in different orders to cover all API use case scenarios. It just takes original Postman collection, searching all the requests inside and building new fake collection that is might be passed to Newman.

## Installation

    npm install toastman

## Usage

>Current Postman supported collection version is v2

### Inside module

```javascript
    const newman = require("newman");
    const toastman = require("toastman");

    const pathToCollection = "./myCollection.json";
    const pathToChains = "./myChains.json";
    //this will return new collection accroding chains file
    //you can pass paths {string} or objects {object} as an arugments
    let outCollection = toastman(pathToCollection, pathToChains);

    //you can use this generated collection with newman as usuall

    newman.run({
        collection: outCollection,
        reporters: "cli"
    });
```

### From bash

```bash
    toastman 
        --postman-collection-path path-to-postman-collection
        --toastman-chains-path path-to-toastman-chains
        --out-collection-path path-to-output-file
```
This will generate a new postman collection file according to chaining rules written inside toastman chain file. The structure of this file is simple.

```json
    {
        "chains": [
            {
                "name": "chain1",
                "requests": ["req1", "req1", "req2"]
            },
            {
                "name": "chain2",
                "requests": ["folder1/req1InsideFolder1", "folder2/request1InsideFolder2"]
            }
        ]
    }
```
Name of the chain might be used to name your sequence test scenario.
Param|Type|Description
--|--|--
name | string | Name of the chain
requests| string[] | Array of the requests name. Those names should be equal to the ones that in the loaded collection. If the request are inside folder, then you can combine it through "/". <p> <b>Example: </b> <i>Folder name:</i> "foo" <i>Request name:</i> "bar" <p> You can write as "foo/bar" into array. Take a look into example.

## Writing tests inside Postman

There are no restrictions on code inside original Postman collection. You still can use prerequest and test scripts for each request. Toastman adds additional global variable called `toastman-chain` that indicating which chain is currently running. You could use this variable to perform more precies testing depend from the context in which current request has been runned.

    let chain = postman.getGlobalVariable("toastman-chain");

This will return currently running chain name. Name of the chain is taken from the chain's file. So it will be the same as you called it. 