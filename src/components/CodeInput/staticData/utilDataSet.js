
export const alphaBet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const numberBet = "0123456789";
export const symbolBet = "[<>?\"!@#$%^&*~]_{}()\\;',.//*-+. :=`";
export const inputCharSet = new Set();

for (let char of alphaBet + numberBet + symbolBet) {
    inputCharSet.add(char);
}

export const ColorDic = {
    "kw": "#cc7832",
    "func": "#ffc66d",
    "object": "#8888c6",
    "str": "#6a8759",
    "normal": "#a9b7c6",
    "number": "#6897bb",
}

