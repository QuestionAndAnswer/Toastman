const mocha = require("mocha");
const assert = require("chai").assert;

const http = require("http");
const toastman = require("./../index.js");
const newman = require("newman");
const path = require("path");
const shell = require("shelljs");

// toastman.setVerbose(true);

const postmanCollectionFileName = "test_collection.json";
const toastmanChainsFileName = "test_chains.json";
const pathToPostmanCollection = path.resolve("test", postmanCollectionFileName);
const pathToToastmanChains = path.resolve("test", toastmanChainsFileName);

const server = http.createServer((req, res) => {
    res.writeHead(200);

    res.end("OK");
}); 

before(() => {
    server.listen(8000);
});

describe("Import run", () => {
    function testRun(outCollection, done) {
        assert.strictEqual(outCollection.item.length, 2, "Two chains");
        assert.strictEqual(outCollection.item[0].item.length, 4, "Three items in chain1");
        assert.strictEqual(outCollection.item[1].item.length, 2, "Two items in chain2");

        newman.run({
            collection: outCollection,
            reporter: "cli"
        })
            .on("done", () => {
                assert.isOk(true, "Not thrown an exception");
                done();
            });
    }

    it("passing files pathes", (done) => {
        let outCollection = toastman(pathToPostmanCollection, pathToToastmanChains);

        testRun(outCollection, done);
    });


    it("passing objects", (done) => {
        let postmanCollection = require(pathToPostmanCollection);
        let toastmanChains = require(pathToToastmanChains);
        
        let outCollection = toastman(postmanCollection, toastmanChains);

        testRun(outCollection, done);
    });
});

describe("Run via CLI", () => {
    it("returns file path", () => {
        let cmd = "node .\\index.js ";
        cmd += "--postman-collection-path .\\test\\" + postmanCollectionFileName + " ";
        cmd += "--toastman-chains-path .\\test\\" + toastmanChainsFileName + " ";
        cmd += "--out-collection-path .\\test\\custom_toastman_collection.json  ";

        let outPath = shell.exec(cmd, { silent: true }).toString();

        assert.isOk(outPath.indexOf("\\test\\custom_toastman_collection.json") !== -1, "Return path is wrong");

        let collection = require(outPath);
        assert.isOk(collection, "Collection not readable");
    });
});

after(() => {
    server.close();
});