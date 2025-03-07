var d3 = require('./node_modules/d3/dist/d3.js');
var linkedom = require('linkedom');

globalThis.document = linkedom.parseHTML('<html><body></body></html>').document;

const width = 800;
const height = 500;
const marginTop = 50;
const marginRight = 50;
const marginBottom = 60;
const marginLeft = 70;

const data = [
    { year: 2019, productCount: 3 },
    { year: 2020, productCount: 6 },
    { year: 2021, productCount: 10 },
    { year: 2022, productCount: 15 },
    { year: 2023, productCount: 20 }
];

const x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([marginLeft, width - marginRight]);
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.productCount) + 5]).range([height - marginBottom, marginTop]);

const line = d3.line().x(d => x(d.year)).y(d => y(d.productCount));

const svg = d3.create("svg").attr("width", width).attr("height", height).style("background-color", "#f0f8ff");

// Gradient for the line
svg.append("defs").append("linearGradient").attr("id", "line-gradient").attr("gradientUnits", "userSpaceOnUse").attr("x1", 0).attr("y1", y(3)).attr("x2", 0).attr("y2", y(20)).selectAll("stop").data([
    { offset: "0%", color: "steelblue" },
    { offset: "100%", color: "blue" }
]).enter().append("stop").attr("offset", d => d.offset).attr("stop-color", d => d.color);

svg.append("g").attr("transform", `translate(0,${height - marginBottom})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
svg.append("g").attr("transform", `translate(${marginLeft},0)`).call(d3.axisLeft(y));

svg.append("path").datum(data).attr("fill", "none").attr("stroke", "url(#line-gradient)").attr("stroke-width", 3).attr("d", line);

svg.append("text").attr("transform", `translate(${width / 2}, ${height - marginBottom + 40})`).style("text-anchor", "middle").text("Year").style("fill", "#333");
svg.append("text").attr("transform", `translate(${marginLeft / 2}, ${height / 2}) rotate(-90)`).style("text-anchor", "middle").text("Product Count").style("fill", "#333");
svg.append("text").attr("x", (width / 2)).attr("y", (marginTop / 2)).attr("text-anchor", "middle").style("font-size", "16px").style("font-weight", "bold").text("GraalVM Adoption in Oracle Products");

module.exports = svg.node().outerHTML;