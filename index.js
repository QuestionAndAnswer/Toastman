const newman = require("newman");
const _ = require("underscore");
const extend = require("extend");
/**
 * Toastman class that provides basic functionality
 * @class
 */
class Toastman {
    constructor (path) {
        this._collection = require(path);
        this._chains = [];
    }

    /**
     * @type Toastman~chain
     * @property {string} name Chain's name
     * @property {string[]} requests Requests name array to execute in this chain
     */

    /**
     * Add ne wchain into run
     * @param {Toastman~chain} chain New chain object
     */
    addChain(chain) {
        this._chains.push(chain);
        return this;
    }

    /**
     * Newman's run method overriding
     * Same parameters as in original.
     * @return {EventEmiter} Newman's EventEmiter instance
     */
    run(options) {
        let collectionToRun = this.getFakeCollectionToRun();
        options.collection = collectionToRun;

        return newman.run.apply(newman, arguments);
    }

    /**
     * Returns new fake collection according to added chains.
     * @return {Collection} New collection with all added chains on the call time 
     */
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