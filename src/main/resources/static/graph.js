var d3 = require('./node_modules/d3/dist/d3.js');
var linkedom = require('linkedom');

// Simuler l'objet document avec linkedom
globalThis.document = linkedom.parseHTML('<html><body></body></html>').document;

// Définir les dimensions du graphique
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Définir l'échelle de l'axe X
const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

// Définir l'échelle de l'axe Y
const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

// Créer le conteneur SVG
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

// Ajouter l'axe X
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

// Ajouter l'axe Y
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

// Retourner le code SVG sous forme de chaîne
module.exports = svg.node().outerHTML;