
let NormSInv = (p) => {
    var a1 = -39.6968302866538,
        a2 = 220.946098424521,
        a3 = -275.928510446969;
    var a4 = 138.357751867269,
        a5 = -30.6647980661472,
        a6 = 2.50662827745924;
    var b1 = -54.4760987982241,
        b2 = 161.585836858041,
        b3 = -155.698979859887;
    var b4 = 66.8013118877197,
        b5 = -13.2806815528857,
        c1 = -7.78489400243029E-03;
    var c2 = -0.322396458041136,
        c3 = -2.40075827716184,
        c4 = -2.54973253934373;
    var c5 = 4.37466414146497,
        c6 = 2.93816398269878,
        d1 = 7.78469570904146E-03;
    var d2 = 0.32246712907004,
        d3 = 2.445134137143,
        d4 = 3.75440866190742;
    var p_low = 0.02425,
        p_high = 1 - p_low;
    var q, r;
    var retVal;

    if ((p < 0) || (p > 1)) {
        alert("NormSInv: Argument out of range.");
        retVal = 0;
    } else if (p < p_low) {
        q = Math.sqrt(-2 * Math.log(p));
        retVal = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    } else if (p <= p_high) {
        q = p - 0.5;
        r = q * q;
        retVal = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
    } else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        retVal = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    return retVal;
};
let normalDist = () => {
    let u = 0,
        v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}
let round = (value, place) => {
    return (Math.round(value * Math.pow(10, place)) / (Math.pow(10, place)))
}
let randInt = (minimum, max) => {
    return (Math.floor(Math.random() * (max - minimum)) + 1 + minimum);
}
let sum = (values) => {
    let total = 0;

    for (let i = 0, n = values.length; i < n; i++) {
        total += values[i];
    }
    return total
}

let copy = (array) => {
    return (array.map(element => element));
}
let countTimesIn = (array, value) => {
    return (array.filter(element => element == value).length)

}
let turnIntoProbabilityMatrix = (array) => {
    let totalSum = sum(array);
    array[0] = Math.round(10000 * array[0] / totalSum) / 10000;
    for (let i = 1; i < array.length; i++) {
        array[i] = Math.round(10000 * (array[i - 1] + (array[i] / totalSum))) / 10000;
    }
    return array;
}

let isNumber = (n) => {
    return Number(n) === n;
}
let setHTML = (elementID, HTML) => {
    document.getElementById(elementID).innerHTML = HTML;
}
let shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
let tableCell = (value) => {
    return ("<td>" + value + "</td>");
}