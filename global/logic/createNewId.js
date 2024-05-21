function compareNumbers (a, b) {
    return a - b;
}

function createNewID (entityName) {

    let arrayOfEntity = State.get(entityName);
    let arrayOfIds = [];
    
    if (arrayOfEntity.length === 0) {
        newID = 1;
        return newID;
    
    } else {
        arrayOfEntity.forEach((element) => arrayOfIds.push(element.id));
        let sortedArray = arrayOfIds.sort(compareNumbers);
        let newID;
        
        let counter = 1;

        for (let id of sortedArray) {
            if (id !== counter) {
                newID = counter;
            } else {
                counter++;
            }
        }

        if (!newID) {
            newID = sortedArray.length + 1;
        }
        
        return newID;
    }
}