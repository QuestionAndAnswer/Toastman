# Toastman

Toastman allows reues separate requests in Postman collection and run them one by one in any order. Toastman using Newman to run all requests and working as a wrapper. So this package should not limit your usual Newman workflow, but extend it instead.

## Installation

    npm install toastman

## Usage

```javascript
    let pathToCollection = "./myCollection";
    let toastman = new Toastman(pathToCollection);

    toastman
        .addChain({
            name: "chain1",
            requests: ["folder1/myRequest1", "myRequest2", "folder1/myRequest1"]
        })
        .addChain({
            name: "chain2",
            requests: ["folder1/myRequest1"]
        })
        .run({
            reporters: "cli"
        })
        .on("end", (err, summary) => {
            console.log("Collection run finished");
        });
```

Toastman is a wrapper to create requests chains in Newman.
It just takes original Postman collection V2, searching all the requests inside and building new fake collection that is passing to Newman then.

## Docs

><b>Note:</b> Currently Postman collection support version is v2 only

## `Toastman(path)`

Param|Type|Description
--|--|--
path|string|Path to collection file


Root class to work with Toastman

## `Toastman#addChain(chain)`

Add chain into run.

## `Toastman~chain`

Param|Type|Description
--|--|--
name | string | Name of the chain
requests| string[] | Array of the requests name. Those names should be equal to the ones that in the loaded collection. If the request are inside folder, than, you can combine it through "/". <p> <b>Example: </b> <i>Folder name:</i> "foo" <i>Request name:</i> "bar" <p> You can write as "foo/bar" into array. Take a look into example.

## `Toastman#run()`

Aim and parameters are the same as for ```Newman#run``` 

## `Toastman~getFakeCollectionToRun()`

Returns fake collection object with all added chains. This collection can be then passed into ```Newman#run```