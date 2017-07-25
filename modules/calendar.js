import { select } from "d3-selection"
import { scaleBand, scaleOrdinal } from "d3-scale"
import { axisTop, axisLeft } from "d3-axis"
import { json } from "d3-request"
import { queue } from "d3-queue"
import { entries } from "d3-collection"

export default function(){

  var margin = { top: 50, right: 10, bottom: 10, left: 95 },
  widthColumn,width,height,moreAxis = false, _data, svg, sq_calendar, fruit_group, fruitNames, monthNames, data;
  height = 500;

  //load data
  queue()
  .defer(json, "data/data.json")
  .await(ready);

  function ready(error,json){
    if (error) throw error

    _data = json;
    resize(_data);
  }

  function resize() {

    monthNames = Object.keys(_data.fruits["Aguacate"]);
    heatmap("#fruits",_data.fruits)
    heatmap("#vegetables",_data.vegetables)

  }
  function heatmap(el,data){


    select(el).html("");

    var widthColumn = select("#chart").node().getBoundingClientRect().width,
    width = Math.min(600, widthColumn) - margin.left - margin.right,

    xScale = scaleBand().range([0, width]),
    yScale = scaleBand().rangeRound([0, height]),

    yNames = Object.keys(data),
    color = scaleOrdinal()
    .domain([0, 1, 2, 3])
    .range(["white", "#FED976", "#A1D99B", "#9E9AC8"]);

    widthColumn > 468 ? moreAxis = true : null;

    // Add the horizontal labels
    xScale.domain(monthNames);

    // Add the vertical labels
    yScale.domain(yNames);

    var xAxis = axisTop(yScale)
    .tickSize(5)
    .tickSizeOuter(0),

    yAxis = axisLeft(xScale)
    .tickSize(5)
    .tickSizeOuter(0);

    // Update the range of the scale with new width/height
    xAxis.scale(xScale);
    yAxis.scale(yScale);

    svg = select(el)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // table
    var sq_calendar = svg.append("g").attr('class', 'sq_calendar');

    // tr
    fruit_group = sq_calendar.selectAll(".fruit_group")
    .data(entries(data))
    .enter()
    .append("g")
    .attr('class', 'fruit_group')
    .attr("transform", function(d){
      return "translate(0," + yScale(d.key) + ")"
    })
    // td
    var square = fruit_group.selectAll(".square").data(function(d){
      return entries(d.value);
    })
    .enter()
    .append("rect")
    .attr('class', 'square')
    .attr('x', function(d,i){
      return xScale(d.key)
    })
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('fill', function(d){
      return color(d.value)
    })

    svg.append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .selectAll("text")
    .attr("dy", "-0.5em")
    .attr("x", 0)
    .style("text-anchor", "middle")

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll("text")
    .style("text-anchor", "end");

  }

  ///
  select(window).on('resize', resize);

  //resize();

}
