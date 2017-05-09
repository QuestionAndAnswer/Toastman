# Toastman

Toastman is Postman collection processor that repacks single requests into new collection. It allows to chain and reuse requests from Postman collection, call them in different orders to cover all API use case scenarios. It just takes original Postman collection, searching all the requests inside and building new fake collection.

## Installation

    npm install toastman

## Usage

>Current Postman supported collection version is v2. You can always use v1 to v2 converter [postman-collection-transformer](https://www.npmjs.com/package/postman-collection-transformer) in pipe with Toastman.

### Inside module

```javascript
    const newman = require("newman");
    const toastman = require("toastman");

    const pathToCollection = "./myCollection.json";
    const pathToChains = "./myChains.json";

    //this will return new collection accroding chains file
    //you can pass paths {string} or objects {object} as an arugments
    let outCollection = toastman(pathToCollection, pathToChains);

    //or you can do it like that
    const collection = require(path.resolve(pathToCollection));
    const chains = require(path.resolve(pathToChains));

    //if you need, of course
    outCollection = toastman(collection, chains);
```

Also you can enable verbose mode from code using `setVerbose` method

```javascript
    toastman.setVerbose(true||false);
```

### From bash

>Type toastman --help to get more information

```bash
    toastman 
        -p path-to-postman-collection
        -t path-to-toastman-chains
        -o path-to-output-file
```

This will generate a new Postman collection file according to chaining rules written inside toastman chain file. The structure of this file is simple.

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
---|:---:|---
name | string | Name of the chain
requests| string[] | Array of the requests name. Those names should be equal to the ones that in the loaded collection. If the request are inside folder, then you can combine it through "/". <p> <b>Example: </b> <i>Folder name:</i> "foo" <i>Request name:</i> "bar" <p> You can write as "foo/bar" into array. Take a look into example.

## Writing tests inside Postman

There are no restrictions on code inside original Postman collection. You still can use prerequest and test scripts for each request. Toastman adds additional global variable called `toastman-chain` that indicating which chain is currently running. You could use this variable to perform more precies testing depend from the context in which current request has been executed.

    let chain = postman.getGlobalVariable("toastman-chain");

This will return currently running chain name. Name of the chain is taken from the chain's file. So it will be the same as you called it.

This is done by simple code inserting into each request object instance at the first line of the Pre-request section. You always can take a look at generated collection file.

## Disclaimer

WORK RESULT OF THIS TOOL IS NOT GUARANTEE THAT IT WILL GENERATE VALID POSTMAN OR NEWMAN COLLECTION BECAUSE OF THE POSSIBLE INPUT VARIATIONS NUMBER. ALL THE GENERATED COLLECTIONS MIGHT NOT BE CORRECTLY CONSUMED BY POSTMAN OR NEWMAN APPLICATIONS. YOU ARE USING THIS TOOL ON YOUR OWN RISK. AUTHOR DOES NOT CALL TO USE GENERATED COLLECTIONS WITH POSTMAN OR NEWMAN APPLICATIONS. AUTHOR UNDERTAKES NO RESPONSIBILITY FOR ANY LOSS THAT YOU OR ANY THIRD PARTY MAY SUFFER DUE TO USAGE WITH POSTMAN OR NEWMAN APPLICATIONS.
