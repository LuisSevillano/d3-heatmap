import { select } from "d3-selection"
import { scaleBand, scaleOrdinal } from "d3-scale"
import { axisTop, axisLeft } from "d3-axis"
import { json } from "d3-request"
import { queue } from "d3-queue"
import { keys, entries } from "d3-collection"

export default function(){

    var margin = { top: 50, right: 10, bottom: 10, left: 95 },
        widthColumn, width, height, monthNames;
        height = 600;

    var data;

    //load data
    queue()
        .defer(json, "data/data.json")
        .await(ready);

    function ready(error, json) {
        if (error) throw error

        if (!data) {
            data = json;
        }
        heatmap(data);
    }

    function heatmap(data){

        select("svg").remove();

        var container = select("#wrapper").append("div");

        // extract month names
        var monthNames = keys(entries(data)[0].value);
        var widthColumn = select("#wrapper").node().getBoundingClientRect().width,
            width = Math.min(600, widthColumn) - margin.left - margin.right,

            xScale = scaleBand().range([0, width]),
            yScale = scaleBand().rangeRound([0, height]),

            // fruits datasets is about when it is good season to consume a fruit, if it is seasonal, etc.
            // if you want to build a usual heatmap you'd modify this color scale
            yNames = Object.keys(data),
            color = scaleOrdinal()
                .domain([0, 1, 2, 3])
                .range(["#FFFFFF", "#FED976", "#A1D99B", "#9E9AC8"]);

        // Add the horizontal labels
        xScale.domain(monthNames);

        // Add the vertical labels
        yScale.domain(yNames);

        var xAxis = axisTop(yScale)
            .tickSize(5)
            .tickPadding(0)
            .tickSizeOuter(0),

        yAxis = axisLeft(xScale)
            .tickSize(5)
            .tickSizeOuter(0);

        // Update the range of the scale with width/height
        xAxis.scale(xScale);
        yAxis.scale(yScale);

        var svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // concept comes from https://bost.ocks.org/mike/nest/
        // ~table
        var sq_calendar = svg.append("g").attr('class', 'sq_calendar');

        // ~tr
        var square_group = sq_calendar.selectAll(".square_group")
            .data(entries(data))
            .enter()
            .append("g")
            .attr('class', 'fruit_group')
            .attr("transform", function(d){
                return "translate(0," + yScale(d.key) + ")"
            })
        // ~td
        var square = square_group.selectAll(".square")
            .data(function(d){
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

    select(window).on('resize', ready);

}
