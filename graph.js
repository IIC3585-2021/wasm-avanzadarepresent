// Using vis.js from CDN
import { flattenMatrix, NOT_DEFINED_VALUE} from "./utils.js";

const generateGraphNodes = (matrixToBuild) => {
    const uniqueLetters = Object.keys(matrixToBuild);
    uniqueLetters.sort();
    let nodes = []; 
  
    for (const [index, node] of uniqueLetters.entries()) {
      nodes.push({id: index, label: node});
    }
  
    return nodes;
    }
  
const generateGraphEdges = (matrixToBuild) => {
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

const DrawGraph = (matrixToBuild, selectedRoute=null) => {
    // create an array with nodes
    var nodes = new vis.DataSet(generateGraphNodes(matrixToBuild));
  
    // create an array with edges
    var edges = new vis.DataSet(generateGraphEdges(matrixToBuild));
    
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

export default DrawGraph;