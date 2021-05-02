let matrixToBuild = {};
const NOT_DEFINED_VALUE = 2**16 - 1
const matrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0))

function resetMatrix() {
  matrixToBuild = {};
}

function flattenMatrix(matrixHash) {

    const uniqueLetters = Object.keys(matrixHash);
    uniqueLetters.sort()
  
    const matrixList = matrix(uniqueLetters.length, uniqueLetters.length);
    const notDefinedValue = NOT_DEFINED_VALUE;
    
    for (let fromLetterIndex = 0; fromLetterIndex < uniqueLetters.length; fromLetterIndex++) {
      for (let toLetterIndex = 0; toLetterIndex < uniqueLetters.length; toLetterIndex++) {
  
        let initialLetter = uniqueLetters[fromLetterIndex];
        let finalLetter = uniqueLetters[toLetterIndex];
        let weight = matrixHash[initialLetter][finalLetter];
  
        matrixList[fromLetterIndex][toLetterIndex] = weight ? weight : notDefinedValue;
      }
    }
    return matrixList;
  }
  
  export { matrixToBuild, NOT_DEFINED_VALUE, flattenMatrix, resetMatrix };