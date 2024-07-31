// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 50, left: 50},
  width = window.innerWidth - margin.left - margin.right,
  height = window.innerHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Read data
d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_hierarchy_1level.csv', function(data) {

  // stratify the data: reformatting for d3.js
  var root = d3.stratify()
    .id(function(d) { return d.name; })   // Name of the entity (column name is name in csv)
    .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
    (data);
  root.sum(function(d) { return +d.value })   // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root)

console.log(root.leaves())
  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .style("stroke", "black")
      .style("fill", "#69b3a2");

  svg
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("image")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("xlink:href", function(d) {
            let i = root.leaves().indexOf(d);
            if (i == 0) return "/album-covers/1_KillEmAll.jpg"
            if (i == 1) return "/album-covers/2_RideTheLightning.jpg"
            if (i == 2) return "/album-covers/3_MasterOfPuppets.jpg"
            if (i == 3) return "/album-covers/4_AndJusticeForAll.jpg"
            if (i == 4) return "/album-covers/5_Metallica.jpg"
            if (i == 5) return "/album-covers/6_Load.jpg"
            if (i == 6) return "/album-covers/7_Reload.jpg"
        })
        .attr("preserveAspectRatio", "xMidYMid slice")

  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+40})    // +20 to adjust position (lower)
      .text(function(d) {
            let i = root.leaves().indexOf(d);
            if (i == 0) return "Kill 'Em All (1983)"
            if (i == 1) return "Ride The Lightning (1984)"
            if (i == 2) return "Master of Puppets (1986)"
            if (i == 3) return "...And Justice For All (1988)"
            if (i == 4) return "Metallica (1991)"
            if (i == 5) return "Load (1996)"
            if (i == 6) return "Reload (1997)"
      })
      .attr("font-size", "30px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", "8px")
      .attr("paint-order", "stroke fill markers")

})