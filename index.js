const newman = require("newman");
const _ = require("underscore");
const extend = require("extend");

class Toastman {
    constructor (path) {
        this._collection = require(path);
        this._chains = [];
    }

    addChain(chain) {
        this._chains.push(chain);
        return this;
    }

    run(options, callback) {
        let collectionToRun = this.getFakeCollectionToRun();
        options.collection = collectionToRun;

        return newman.run(options, callback);
    }

    getFakeCollectionToRun () {
        let requestsMap = this._getNormalizedCollectionItems();
        
        let collectionToRun = extend(true, {}, this._collection);
        collectionToRun.item = [];
        
        this._chains.forEach((chain, index) => {
            let folder = {
                name: chain.name || index,
                item: []
            };

            collectionToRun.item.push(folder);

            chain.requests.forEach(reqName => {
                let reqInstance = requestsMap[reqName];
                folder.item.push(reqInstance);
            });
        });

        return collectionToRun;
    }

    /**
     * Flatten collection items with renaming of the requests.
     * Requests renamed relatively subfolders where they layed.
     */
    _getNormalizedCollectionItems () {
        let foldersMap = _.indexBy(this._collection.item, "name");
        let toReturnMap = {};

        for(let folderName in foldersMap) {
            let folder = foldersMap[folderName];

            let requestsMap = _.indexBy(folder.item, "name");
            Object.keys(requestsMap)
                .forEach(key => {
                    let newName = folderName + "/" + key;
                    toReturnMap[newName] = requestsMap[key];
                    toReturnMap[newName].name = newName;
                });
        }

        return toReturnMap;
    }
}

module.exports = Toastman;