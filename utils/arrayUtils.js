/*
removes all elements of toRemove from toReturn 
and returns toReturn
*/
exports.removeElementsOf = (toRemove, toReturn) => {
    const toReturnArray = [];
    for (const toAdd of toReturn) {
        if(!toRemove.includes(toAdd)) {
            toReturnArray.push(toAdd);
        }
    }
    return toReturnArray;
}