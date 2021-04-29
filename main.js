import Module from "./tsp.js"
const NOT_DEFINED_VALUE = 2**16 - 1

const matrix = (rows, cols) => new Array(cols).fill(0).map((o, i) => new Array(rows).fill(0))
const matrixToBuild = {};

const introduceIntoList = (inputValue) => {
  let father = document.getElementById('introduced-vertex-list');
  let newChild = document.createElement('li');
  newChild.className = "list-group-item";
  newChild.textContent  = inputValue;
  father.appendChild(newChild);
}

const clearTextInput = () => {
  document.getElementById('vertex-input').value = '';
}

const generateGraphNodes = () => {
  const uniqueLetters = Object.keys(matrixToBuild);
  uniqueLetters.sort();
  let nodes = []; 

  for (const [index, node] of uniqueLetters.entries()) {
    nodes.push({id: index, label: node});
  }

  return nodes;
}

const generateGraphEdges = () => {
  const uniqueLetters = flattenMatrix(matrixToBuild);
  let edges = [];
  const notDefinedValue = NOT_DEFINED_VALUE;
  for (let i = 0; i < uniqueLetters.length; i++) {
    for (let j = i + 1; j < uniqueLetters[i].length; j++) {
      const weight = uniqueLetters[i][j];
      if ( weight !== 0 && weight !== notDefinedValue) {
        edges.push({from: i, to: j, label: weight})
      }
    }
  }
  return edges;
}

const DrawGraph = (selectedRoute=null) => {
  // create an array with nodes
  var nodes = new vis.DataSet(generateGraphNodes());

  // create an array with edges
  var edges = new vis.DataSet(generateGraphEdges());
  
  if (selectedRoute) {
    const uniqueLetters = Object.keys(matrixToBuild);
    uniqueLetters.sort();

    const indexes = selectedRoute.map(letter => uniqueLetters.indexOf(letter))
    indexes.push(indexes[0]);

    for (let i = 0; i < selectedRoute.length - 1; i++) {
      edges.forEach(element => {
        if ((element.from === indexes[i] && element.to === indexes[i + 1]) || (element.from === indexes[i + 1] && element.to === indexes[i]) ) {
          element.color = { color: "red" }
          edges.update(element)
        }
      });
    }
  }

  // create a network
  var container = document.getElementById("network");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      shape: "circle",
    },
  };
  var network = new vis.Network(container, data, options);
}
// A B 10, A D 8, A E 7, B D 7, B C 12, C D 6, C F 7, C G 5, D E 9, D F 4, E G 11, F G 3


const processInput = (input) => {
  let regexp = /(\w+)\s*(\w+)\s*(\d+)/g;
  let matches = regexp.exec(input);
  let fromInput = matches[1];
  let toInput = matches[2];
  let weightInput = parseInt(matches[3]);

  if (fromInput in matrixToBuild) {
    matrixToBuild[fromInput][toInput] = weightInput;
  }
  else {
    matrixToBuild[fromInput] = {};
    matrixToBuild[fromInput][toInput] = weightInput;
  }
  if (toInput in matrixToBuild) {
    matrixToBuild[toInput][fromInput] = weightInput;
  }
  else {
    matrixToBuild[toInput] = {};
    matrixToBuild[toInput][fromInput] = weightInput;
  }
  introduceIntoList(matches[0]);
  DrawGraph(); 
  clearTextInput();      
}


const getMatrixInput = () => {
  let formInput = String(document.getElementById('vertex-input').value);
  if (formInput.includes(",")) {
    for (let index = 0; index < formInput.split(",").length; index++) {
      const element = formInput.split(",")[index];
      processInput(element)
    }  
  }
  else {
    processInput(formInput)    
  }
}

$("#input-vertex").click(function() {
  getMatrixInput()
})

$("#calculate-matrix").click(function() {
  const adjacencyMatrix = flattenMatrix(matrixToBuild);
})

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

const resetSudokuGrid = () => {
  $('.form-control').each(function(i, obj) {
    $(obj).val("");
  })
}

const makePtrOfArray = (myModule) => {
  let adjacencyMatrix = flattenMatrix(matrixToBuild);
  console.log(adjacencyMatrix)
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

const getArrayLength = () => {
  let adjacencyMatrix = flattenMatrix(matrixToBuild);
  return adjacencyMatrix.length;
}

const getBestRoute = (myModule, ptr) => {
  const routeLength = getArrayLength()
  const bestRouteList = new Array(routeLength)
  for (let i = 0; i < routeLength; i++) {
    bestRouteList[i] = myModule.getValue(ptr + i * 4, "i32");
  }
  return bestRouteList;
}

const mapRouteToLetters = (routeResult) => {
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
    let result = mapRouteToLetters(routeResult)
    DrawGraph(result);
    console.log(result);
  }
})