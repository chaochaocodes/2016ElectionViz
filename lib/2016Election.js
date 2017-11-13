//slider code based on Jane Pong's demo:
//https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763

let formatTime = d3.timeFormat("%-I:%M %p");
let formatDay = d3.timeFormat("%b %-d");
let parseTime = d3.timeParse("%m/%-d/%Y %H:%M");

let startTime = parseTime('11/8/2016 18:59');
let endTime = parseTime('11/9/2016 02:29');

let m = { top: 50, right: 50, bottom: 0, left: 50 },
    w = 960 - m.left - m.right,
    h = 500 - m.top - m.bottom;

let svg = d3.select('#viz')
            .append('svg')
            .attr('width', w + m.left + m.right)
            .attr('height', h + m.top + m.bottom);

let moving = false,
    currentValue = 0,
    targetValue = w;

let playButton = d3.select('#play-button');

let x = d3.scaleTime()
          .domain([startTime, endTime])
          .range([0, targetValue])
          .clamp(true);

let slider = svg.append("g")
                .attr("class", "slider")
                .attr("transform", "translate(" + m.left + "," + h/5 + ")");

function cloneLine() {
  return this.parentNode.appendChild(this.cloneNode(true));
}

let dragFunc = d3.drag()
                 .on("start.interrupt", () => slider.interrupt())
                 .on("start drag", () => {
                   console.log(d3.event.x);
                   console.log(x.invert(d3.event.x));
                    currentValue = d3.event.x;
                    update(x.invert(currentValue));
                  });

slider.append("line")
      .attr("class", "track")
      .attr("x1", x.range()[0])
      .attr("x2", x.range()[1])
      .select(cloneLine)
        .attr("class", "track-inset")
      .select(cloneLine)
        .attr("class", "track-overlay")
        .call(dragFunc);

slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter()
      .append("text")
      .attr("x", x) //each time object in data arr is passed into scaleTime
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(d => formatTime(d));

slider.insert("g", ".track-overlay")
      .attr("class", "ticks")
      .attr("transform", "translate(0," + 36 + ")")
      .selectAll("text")
      .data([new Date('11/8/2016'), new Date('11/9/2016')])
      .enter()
      .append("text")
      .attr("x", x) //each time object in data arr is passed into scaleTime
      .attr("y", 10)
      .attr("text-anchor", "middle")
      .text(d => formatDay(d));

let handle = slider.insert("circle", ".track-overlay")
                   .attr("class", "handle")
                   .attr("r", 9);

// let label = slider.append("text")
//                   .attr("class", "label")
//                   .attr("text-anchor", "middle")
//                   .text(formatTime(startDate))
//                   .attr("transform", "translate(0," + (-25) + ")");

function update(h) {
  // update position and text of label according to slider scale
  handle.attr("cx", x(h));
  // label
  //   .attr("x", x(h))
  //   .text(formatDate(h));

  // filter data set and redraw plot
  // var newData = dataset.filter(function(d) {
  //   return d.date < h;
  // })
  // drawPlot(newData);
}
