import DrawGraph from "./graph.js";
import { matrixToBuild } from "./utils.js";
import { introduceIntoList, clearTextInput, resetAll } from "./draw.js";

// Input processing

function processInput (input) {
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
  DrawGraph(matrixToBuild); 
  clearTextInput();      
}

function getMatrixInput() {
  let formInput = String(document.getElementById('vertex-input').value);
  if (formInput.includes(",")) {
    for (let index = 0; index < formInput.split(",").length; index++) {
      const element = formInput.split(",")[index];
      processInput(element);
    }  
  }
  else {
    processInput(formInput);
  }
}

// Button actions

$("#input-vertex").click(getMatrixInput);
$("#restore-status").click(resetAll);
