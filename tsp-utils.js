import Module from "./tsp.js"
import DrawGraph from "./graph.js"
import { flattenMatrix, matrixToBuild } from "./utils.js";
import { updateHTMLCost, updateHTMLTimeCost } from "./draw.js"

function calculateCost(selectedRoute) {
    selectedRoute.push(selectedRoute[0])
    let totalCost = 0
    for (let index = 0; index < selectedRoute.length - 1; index++) {
      let from = selectedRoute[index]
      let to = selectedRoute[index + 1]
      totalCost += matrixToBuild[from][to]
    }
    console.log(`total cost: ${totalCost}`)
    updateHTMLCost(totalCost);
}
  
function makePtrOfArray(myModule) {
    let adjacencyMatrix = flattenMatrix(matrixToBuild);
    const N = adjacencyMatrix.length;
    const arrayPtr = myModule._calloc(N, 4);
    for (let i = 0; i < N; i++) {
      let rowsPtr = myModule._calloc(N, 4);
      myModule.setValue(arrayPtr + i * 4, rowsPtr, "i32");
      for (let j = 0; j < N; j++) {
        myModule.setValue(rowsPtr + j * 4, adjacencyMatrix[i][j], "i32");
      }
    }
    return arrayPtr;
}
  
function getArrayLength() {
    let adjacencyMatrix = flattenMatrix(matrixToBuild);
    return adjacencyMatrix.length;
}
  
function getBestRoute(myModule, ptr) {
    const routeLength = getArrayLength()
    const bestRouteList = new Array(routeLength)
    for (let i = 0; i < routeLength; i++) {
      bestRouteList[i] = myModule.getValue(ptr + i * 4, "i32");
    }
    return bestRouteList;
}
  
function mapRouteToLetters(routeResult) {
    const uniqueLetters = Object.keys(matrixToBuild).sort();
    return Array.from(routeResult, (letterIdx) => uniqueLetters[letterIdx])
}
  
Module().then(function (mymod) {
    let calculateBtn = document.getElementById("calculate-matrix");
    calculateBtn.onclick = () => {
      let arrPtr = makePtrOfArray(mymod);
      let arrLen = getArrayLength();
      let startDate = window.performance.now();
      let routeResultPtr = mymod._solve_tsp(arrPtr, arrLen);
      let endDate = window.performance.now();
      let routeResult = getBestRoute(mymod, routeResultPtr);
      mymod._free(routeResultPtr);
      let result = mapRouteToLetters(routeResult);
      let timeDifference = endDate - startDate;
      calculateCost(result);
      updateHTMLTimeCost(timeDifference);
      DrawGraph(matrixToBuild, result);
    }
})