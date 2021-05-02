import DrawGraph from "./graph.js";
import { resetMatrix } from "./utils.js";

function resetAll () {
    resetMatrix();
    DrawGraph({});
    clearTextInput();
    clearInputList();
    clearCosts();
}

function clearTextInput() {
    document.getElementById('vertex-input').value = '';
}

function clearCosts() {
    document.getElementById('total-cost').innerHTML = '';
    document.getElementById('time-cost').innerHTML = '';
}

function clearInputList() {
    let father = document.getElementById('introduced-vertex-list');
    removeAllChildNodes(father);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function introduceIntoList (inputValue) {
    let father = document.getElementById('introduced-vertex-list');
    let newChild = document.createElement('li');
    newChild.className = "list-group-item";
    newChild.textContent  = inputValue;
    father.appendChild(newChild);
}

function updateHTMLCost(value) {
    document.getElementById('total-cost').innerHTML = `Costo total: ${value}`;
}

function updateHTMLTimeCost(value) {
    document.getElementById('time-cost').innerHTML = `Tiempo utilizado: ${value.toFixed(5)} ms`;
}

export { resetAll, introduceIntoList, clearTextInput, updateHTMLCost, updateHTMLTimeCost }