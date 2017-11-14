//slider code based on Jane Pong's demo:
//https://bl.ocks.org/officeofjane/47d2b0bfeecfcb41d2212d06d095c763

let formatTime = d3.timeFormat("%-I %p");
let liveTimeFormat = d3.timeFormat("%-I:%M %p");
let formatDay = d3.timeFormat("%b. %-d");
let parseTime = d3.timeParse("%m/%-d/%Y %H:%M");

let startTime = parseTime('11/8/2016 18:55');
let endTime = parseTime('11/9/2016 02:30');
let liveTimeLabel, timer, dataset;

let m = { top: 50, right: 50, bottom: 0, left: 50 },
    w = 960 - m.left - m.right,
    h = 60 - m.top - m.bottom;

let svg = d3.select('#sliderSVG')
            .attr("viewBox",
              `0 0 ${w + m.left + m.right
                + " " + (h + m.top + m.bottom)}`);

let currentValue = 0,
    targetValue = w;

let playButton = d3.select('#play-button');

let x = d3.scaleTime()
          .domain([startTime, endTime])
          .range([0, w])
          .clamp(true);

let slider = svg.append("g")
                .attr("class", "slider")
                .attr("transform", "translate(" + m.left + "," + 10 + ")");

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

//create ticks group for times
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

//create ticks group for days
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
      .attr("font-size", 12)
      .text(d => formatDay(d));

let handle = slider.insert("circle", ".track-overlay")
                   .attr("class", "handle")
                   .attr("r", 9);

function update(time) {
  handle.attr("cx", x(time));

  liveTimeLabel.text(liveTimeFormat(time));

  let newData = dataset.filter(d => d.datetime < time);
  updateVotebar(newData);
}

//build out votes count display bar below

let voteBarSVG = d3.select('#voteBarSVG')
                        .attr("viewBox",
                          `0 0 ${w + m.left + m.right
                            + " " + 100}`);

let voteBarG = voteBarSVG.append("g")
                         .attr("class", "voteBarG")
                         .attr("transform", "translate(" + m.left + ",65)");

let hillaryXScale = d3.scaleLinear()
                     .domain([0, 538])
                     .range([0, w]);

let trumpXScale = d3.scaleLinear()
                   .domain([0, 538])
                   .range([w, 0]);

voteBarG.append("line")
        .attr("class", "voteGrayBar")
        .attr("x1", hillaryXScale.range()[0])
        .attr("x2", hillaryXScale.range()[1]);

let hillaryVoteBar = voteBarG.append("line")
                             .attr("class", "hillaryVoteBar")
                             .attr("x1", hillaryXScale(0))
                             .attr("x2", hillaryXScale(0));

let trumpVoteBar = voteBarG.append("line")
                           .attr("class", "trumpVoteBar")
                           .attr("x1", trumpXScale(0))
                           .attr("x2", trumpXScale(0));

voteBarG.append("image")
        .attr("href", "lib/clinton.jpg")
        .attr("height", "25px")
        .attr("width", "30px")
        .attr("y", "9");

voteBarG.append("text")
        .attr("class", "hillaryLabel")
        .attr("x", 30)
        .attr("y", 30)
        .attr("text-anchor", "start")
        .attr("font-size", 20)
        .attr("fill", "#1875BC")
        .text("Hillary Clinton");

voteBarG.append("text")
        .attr("class", "trumpLabel")
        .attr("x", w - 32)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .attr("font-size", 20)
        .attr("fill", "red")
        .text("Donald Trump");

voteBarG.append("image")
        .attr("href", "lib/trump.jpg")
        .attr("height", "25px")
        .attr("width", "30px")
        .attr("y", "9")
        .attr("x", w - 30);

let hillaryVoteCount =
  voteBarG.append("text")
          .attr("class", "hillaryVoteCount")
          .attr("x", 0)
          .attr("y", -15)
          .attr("text-anchor", "start")
          .attr("font-size", 60)
          .attr("font-weight", "bold")
          .attr("fill", "#1875BC")
          .text("0");

let trumpVoteCount =
  voteBarG.append("text")
          .attr("class", "trumpVoteCount")
          .attr("x", trumpXScale(0))
          .attr("y", -15)
          .attr("text-anchor", "end")
          .attr("font-size", 60)
          .attr("font-weight", "bold")
          .attr("fill", "red")
          .text("0");

liveTimeLabel =
  voteBarG.append("text")
          .attr("class", "liveTimeLabel")
          .attr("x", hillaryXScale(270))
          .attr("y", -15)
          .attr("text-anchor", "middle")
          .attr("font-size", 30)
          .text(liveTimeFormat(startTime));

voteBarG.append("text")
        .attr("class", "votesNeededToWinLabel")
        .attr("x", trumpXScale(270))
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", 15)
        .text("270 to Win");

voteBarG.append("line")
        .attr("class", "toWinNotchBar")
        .attr("x1", hillaryXScale(269))
        .attr("x2", hillaryXScale(271));

function updateVotebar(newData) {
  let { curClintonTotal, curTrumpTotal } = countCurTotal(newData);
  let transitionTime = 200;
  hillaryVoteCount.transition().duration(transitionTime)
    .text(curClintonTotal);
  hillaryVoteBar.transition().duration(transitionTime)
    .attr("x2", hillaryXScale(curClintonTotal));
  trumpVoteCount.transition().duration(transitionTime)
    .text(curTrumpTotal);
  trumpVoteBar.transition().duration(transitionTime)
    .attr("x2", trumpXScale(curTrumpTotal));
}

function countCurTotal(data) {
  let curClintonTotal = 0, curTrumpTotal = 0;
  data.forEach(obj => {
    if (obj.candidate === "Clinton") {
      curClintonTotal += obj.votes;
    } else {
      curTrumpTotal += obj.votes;
    }
  });
  return { curClintonTotal, curTrumpTotal };
}

d3.csv("lib/2016-election-data.csv", rowConverter, data => {
  dataset = data;

  playButton.on("click", function() {
    let button = d3.select(this);
    if (button.text() === "Pause") {
      clearInterval(timer);
      button.text("Play");
    } else {
      timer = setInterval(step, 100);
      button.text("Pause");
    }
  });

});

function rowConverter(d) {
  d.datetime = parseTime(d.date + " " + d.time);
  d.votes = Number(d.votes);
  return d;
}

function step() {
  update(x.invert(currentValue));
  currentValue += (targetValue/151);
  if (currentValue > targetValue) {
    update(x.invert(currentValue));
    currentValue = 0;
    clearInterval(timer);
    playButton.text("Play");
  }
}
