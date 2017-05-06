const mocha = require("mocha");
const assert = require("chai").assert;

const http = require("http");
const Toastman = require("./../index.js");

const pathToCollection = "./test/test_collection.json";

const server = http.createServer((req, res) => {
    res.writeHead(200).end();
}); 

before(() => {
    server.listen(8000);
});

describe("Global", () => {
    it("testRun", () => {
        let toastman = new Toastman(pathToCollection);

        toastman
            .addChain({
                name: "chain1",
                requests: ["1/1", "2/2", "2/2"]
            }).addChain({
                name: "chain2",
                requests: ["1/1"]
            });

        let collectionToRun = toastman.getFakeCollectionToRun();

        assert.strictEqual(collectionToRun.item.length, 2, "Two chains");
        assert.strictEqual(collectionToRun.item[0].item.length, 3, "Tree items in chain1");
        assert.strictEqual(collectionToRun.item[1].item.length, 1, "One item in chain2");

        toastman.run({
            reporters: "cli"
        });

        assert.isOk(true, "Not thrown an exception");
    });
});

after(() => {
    server.close();
});