const contains = (arr, v) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === v) return true;
    }
    return false;
};

export const unique = (data, key) => {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
        if (!contains(arr, data[i][key])) {
            arr.push(data[i][key]);
        }
    }
    return arr;
};
