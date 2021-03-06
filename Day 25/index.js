const fs = require('fs');
const _ = require("lodash");

let relbase = 0;

const display = (arr) => {
    let printString = "";
    for (let thing of arr) {
        for (let char of thing) {
            if (char == 0) {
                printString += " ";
            } else if (char == 1) {
                printString += "X";
            } else if (char == 2) {
                printString += "#";
            } else if (char == 3) {
                printString += "U";
            } else if (char == 4) {
                printString += "O";
            } else {
                printString += "A";
            }
        }
        printString += "\n";
    }
    return printString;
}
const changeVals = (arr, opidx, input) => {
    // console.log("Result: " + (arr[arr[opidx[0] + 1]] + arr[arr[opidx[0] + 2]]));
    const op = arr[opidx[0].toString()];
    // console.log("OP " + op + "|" + opidx[0] + "|" + relbase);
    const instr = op % 100;
    if (instr === 99) {
        return "done";
    }
    const p1mode = Math.floor(op / 100 % 10);
    let p2mode, p3mode;
    if (instr != 3 || instr != 4) {
        p2mode = Math.floor(op / 1000 % 10);
        p3mode = Math.floor(op / 10000 % 10);
    }
    // console.log(p1mode + "|" + p2mode + "|" + p3mode);
    let p1value, p2value;
    if (p1mode === 0) {
        p1value = arr[arr[(opidx[0] + 1).toString()].toString()];
    } else if (p1mode === 1) {
        p1value = arr[(opidx[0] + 1).toString()];
    } else if (p1mode === 2) { 
        p1value = arr[(relbase + arr[(opidx[0] + 1).toString()]).toString()];
        // console.log("P2: " + p2value);
    }
    if (p2mode === 0) {
        p2value = arr[arr[(opidx[0] + 2).toString()].toString()];
    } else if (p2mode === 1) {
        // console.log("aso")
        p2value = arr[(opidx[0] + 2).toString()];
    } else if (p2mode === 2) {
        p2value = arr[(relbase + arr[(opidx[0] + 2).toString()]).toString()];
        // console.log("P2: " + p2value);
    }
    let p3value;
    if (arr[(opidx[0] + 3).toString()]) {
        p3value = arr[arr[(opidx[0] + 3).toString()].toString()];
    } else {
        p3value = 0;   
    }
    if (p3mode === 2) {
        p3value = relbase + arr[(opidx[0] + 3).toString()]
    }
    if (instr === 1) {
        // console.log("Sum: " + p1value + "|" + p2value);
        if (p3mode === 0) {
            arr[arr[(opidx[0] + 3).toString()].toString()] = p1value + p2value;
        } else if (p3mode === 2) {
            arr[(relbase + arr[(opidx[0] + 3).toString()]).toString()] = p1value + p2value;
        }
    } else if (instr === 2) {
        if (p3mode === 0) {
            arr[arr[(opidx[0] + 3).toString()].toString()] = p1value * p2value;
        } else if (p3mode === 2) {
            arr[(relbase + arr[(opidx[0] + 3).toString()]).toString()] = p1value * p2value;
        }
    } else if (instr === 3) {
        // console.log("Input!");
        if (p1mode == 0) {
            // console.log("not relbase");
            arr[arr[(opidx[0] + 1).toString()].toString()] = input.shift();
        } else if (p1mode == 2) {
            // console.log("Relbase: " + (relbase + "|" + (relbase + (opidx[0] + 1)).toString()));
            arr[(relbase + arr[(opidx[0] + 1).toString()]).toString()] = input.shift();
        }
    } else if (instr === 4) {
        // console.log(relbase + arr[(opidx[0] + 1).toString()])
        // console.log("Output! It is " + arr[(relbase + arr[(opidx[0] + 1).toString()]).toString()]);
        if (p1mode == 0) {
            return arr[arr[(opidx[0] + 1).toString()].toString()];
        } else if (p1mode === 1) {
            return arr[(opidx[0] + 1).toString()];
        } else if (p1mode == 2) {
            return arr[(relbase + arr[(opidx[0] + 1).toString()]).toString()];
        }
    } else if (instr === 5) {
        if (p1value != 0) {
            opidx[0] = Number(p2value);
        } else {
            opidx[0] += 3;
        }
    } else if (instr === 6) {
        if (p1value == 0) {
            opidx[0] = Number(p2value);
        } else {
            opidx[0] = Number(opidx[0]) + 3;
        }
    } else if (instr === 7) {
        if (p3mode === 0) {
            if (p1value < p2value) {
                arr[arr[(opidx[0] + 3).toString()].toString()] = 1;
            } else {
                arr[arr[(opidx[0] + 3).toString()].toString()] = 0;
            }
        } else if (p3mode === 2) {
            if (p1value < p2value) {
                arr[(relbase + arr[(opidx[0] + 3).toString()]).toString()] = 1;
            } else {
                arr[(relbase + arr[(opidx[0] + 3).toString()]).toString()] = 0;
            }
        }
    } else if (instr === 8) {
        // console.log("8P3: " + p3mode);
        if (p3mode === 0) {
            if (p1value == p2value) {
                arr[arr[(opidx[0] + 3).toString()].toString()] = 1;
            } else {
                arr[arr[(opidx[0] + 3).toString()].toString()] = 0;
            }
        } else {
            if (p1value == p2value) {
                arr[(relbase + arr[(opidx[0] + 3).toString()]).toString()] = 1;
            } else {
                arr[(relbase + arr[(opidx[0] + 3).toString()]).toString()] = 0;
            }
        }
    } else if (instr === 9) {
        if (p1mode == 0) {
            relbase += arr[arr[(opidx[0] + 1).toString()].toString()];
        } else if (p1mode == 1) {
            relbase += arr[(opidx[0] + 1).toString()];
        } else if (p1mode === 2) {
            relbase += arr[(relbase + arr[(opidx[0] + 1).toString()]).toString()];
        }
    } else if (instr === 99) {
        return "done";
    }
}

const getLength = (arr, opidx) => {
    const op = arr[opidx]
    const instr = op % 100;
    if (instr === 1) {
        return 4;
    } else if (instr === 2) {
        return 4;
    } else if (instr === 3) {
        return 2;
    } else if (instr === 4) {
        return 2;
    } else if (instr === 5 || instr == 6) {
        return 0;
    } else if (instr === 7 || instr == 8) {
        return 4;
    } else if (instr === 9) {
        return 2; 
    } else if (instr === 99) {
        return 1;
    }
}

const intcode = (nvarr, opcode, input) => {
    // console.log(nvarr);
    let outputArr = [];
    let complete = false;
    relbase = 0;
    let outString = "";
    while (complete == false) {
    // for (let i = 0; i < 100; i++) {
        // console.log(relbase);
        // console.log(opcode[0]);
        // console.log(nvarr);
        let lelength = getLength(nvarr, opcode[0]);
        // console.log("Length: " + opcode[0] + "|" + lelength);
        let output = changeVals(nvarr, opcode, input);
        if (output == "done") {
            // console.log("First slot: " + nvarr[0]);
            complete = true;
            return outputArr;
        } else if (output == Number(output)) {
            outString += String.fromCharCode(output);
            if (output == 10) {
                console.log(outString);
                outString = ""
            }
            // console.log("Output: " + String.fromCharCode(output));
            outputArr.push(output);
        }
        opcode[0] += Number(lelength);
    }
}

const convertString = (string) => {
    let arr = string.split(",").map(Number);
    let result = {};
    for (let i in arr) {
        result[i] = arr[i];
    }
    return result;
}

const asciify = (string) => {
    let les = string.split("");
    let o = [];
    for (let a of les) {
        if (a == "\r") {
            continue;
        }
        o.push(a.charCodeAt(0));
    }
    o.push(10);
    return o;
}

fs.readFile('solution.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    let splitData = data.split(",").map(Number);
    let opcode = [0];
    let nvarr = {};
    for (let i = 0; i < splitData.length; i++) {
        nvarr[i] = splitData[i];
    }
    fs.readFile('moves.txt', 'utf-8', (error, dt) => {
        if (error) throw error;
        let input = asciify(dt);
        let output = intcode({...nvarr}, opcode, input);
        console.log(output);
    })
})