var d3 = require('./node_modules/d3/dist/d3.js');
var linkedom = require('linkedom');

// Simulate the document object with linkedom
globalThis.document = linkedom.parseHTML('<html><body></body></html>').document;

// Define the dimensions of the graph
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Define the scale for the X-axis
const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

// Define the scale for the Y-axis
const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

// Create the SVG container
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

// Add the X-axis
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

// Add the Y-axis
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

// Return the SVG code as a string
module.exports = svg.node().outerHTML;
