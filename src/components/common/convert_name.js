
function getNameDevice() {

}

function getNameType(type) {
    let nameType = "";
    switch (type) {
        case 1:
            nameType = "Card";
            break;
        case 2:
            nameType = "FingerPrint";
            break;
        default:
            break;
    }
    return nameType;
}

function getNameActionType(actionType) {
    let nameActionType = "";
    switch (actionType) {
        case 1:
            nameActionType = "Check in";
            break;
        case 2:
            nameActionType = "Check out";
            break;
        case 3:
            nameActionType = "Register";
            break;
        default:
            break;
    }
    return nameActionType;
}

export {
    getNameType,
    getNameActionType
}