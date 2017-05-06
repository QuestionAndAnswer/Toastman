const _ = require("underscore");
const extend = require("extend");

/**
 * Flatten collection items with renaming of the requests.
 * Requests renamed relatively subfolders where they layed.
 * @param {object} rawCollection Postman raw collection object
 * @return {object} Map of the requests by their's names
 */
function normalizeColletionItems (rawCollection) {
    let foldersMap = _.indexBy(rawCollection.item, "name");
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

/**
 * Returns new fake collection according to added chains.
 * @param {object} requestsMap Requests map from @see normalizeCollectionItems
 * @param {object} rawCollection Raw postman collection object
 * @param {object[]} chains Array of chains declarations
 * @return {object} New collection with all added chains on the call time 
 */
function _buildChainsCollection (requestsMap, rawCollection, chains) {
    let collectionToRun = extend(true, {}, rawCollection);
    collectionToRun.item = [];
    
    chains.forEach((chain, index) => {
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
 * Constructs new collection using chains
 * @param {object|string} collection Postman collection object or path to collection file
 * @param {object|string} chains Toastman chains object or path to chains file
 * @return {object} Transformed postman collection
 */
function buildChainsCollection (collection, chains) {
    let collectionObj = typeof collection === "string" ? require(collection) : collection;
    let chainsObj = typeof chains === "string" ? require(chains) : chains;

    if(!collectionObj) {
        throw new Error("Postman collection object is empty. Check file path or file content");
    }

    if(!chainsObj) {
        throw new Error("Toastman chains object is empty. Check file path or file content");
    }

    let requestsMap = normalizeColletionItems(collectionObj);
    return _buildChainsCollection(requestsMap, collectionObj, chainsObj.chains);
}


if(require.main === module) {
    const ArgumentParser = require("argparse").ArgumentParser;
    const fs = require("fs");
    const path = require("path");

    const parser = new ArgumentParser({
        version: "0.1.0",
        addHelp: true,
        description: "Transform collection into chains"
    });

    parser.addArgument("--postman-collection-path", { help: "Path to collection file", required: true });
    parser.addArgument("--toastman-chains-path", { help: "Path to toastman file", required: true });
    parser.addArgument("--out-collection-path", { help: "Path to output collection file", defaultValue: ".\\toastman_collection.json"});

    var args = parser.parseArgs();

    let outCollection = buildChainsCollection(path.resolve(args.postman_collection_path), path.resolve(args.toastman_chains_path));

    let outPath = path.resolve(args.out_collection_path);
    
    fs.writeFileSync(outPath, JSON.stringify(outCollection, null, 4), "utf-8");

    process.stdout.write(outPath);
} else {
    module.exports = buildChainsCollection;
}