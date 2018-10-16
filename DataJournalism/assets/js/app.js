// Set up chart svg area for chart
var svgWidth = 840;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 95
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create wrapper for SVG

var svg = d3.select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

//Import Data from data.csv file

d3.csv('data.csv').then(function(data) {
  data.forEach(function(d) {
    d.healthcare = +d.healthcare;
    d.poverty = +d.poverty;
  });

  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(data, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])  
    .range([height, 0]);

  var yAxisMax = d3.max(data, d => d.healthcare);
  yLinearScale.domain([0, yAxisMax]);


  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
  
  chartGroup.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append('g').call(leftAxis);

  //Create circles for scatter plot

  var scatterGroup = chartGroup.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xLinearScale(d.poverty))
    .attr('cy', d => yLinearScale(d.healthcare))
    .attr('r', '15')
    .attr('class', 'stateCircle')
    .attr('opacity', '.8');

  var scatterText = chartGroup.selectAll('stateText')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'stateText')
    .attr('x', d => xLinearScale(d.poverty))
    .attr('y', d => yLinearScale(d.healthcare - .35))
    .text(d => d.abbr);

  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([40, -80])
    .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

  chartGroup.call(toolTip);

  scatterGroup.on('mouseover', toolTip.show);
  scatterGroup.on('mouseout', toolTip.hide);

  chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Lacks Healthcare(%)');

  chartGroup.append('text')
    .attr('transform', `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr('class', 'axisText')
    .text('In Poverty(%)');

});