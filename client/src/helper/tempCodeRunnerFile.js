const nthIndex = (str, pat, n) => {
    var L= str.length, i= -1;
    while(n-- && i++<L){
        i= str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

var tester = "ab ab ab ab"
console.log(nthIndex(tester, "a", "3"))