const urlInput = document.getElementById("url-input");
const urlInputSubmit = document.getElementById("url-input-sbt");
const result = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultCloud = document.getElementById("result-cloud");
const randomWiki = document.getElementById("rndwiki");

const fill = d3.scale.category20b();

let w = getWidth();
let h = window.innerHeight;
let max, fontSize, layout, svg, cloud;

function getWidth() {
  return resultCloud.offsetWidth;
}

urlInputSubmit.onclick = () =>
  createWordsCloud(`api/1/get_words?url=${encodeURI(urlInput.value)}`);
randomWiki.onclick = () => createWordsCloud("api/1/rndwiki");

function createWordsCloud(url) {
  fetch(url)
    .then(res => res.json())
    .then(json => {
      clearResult();

      json.words = json.words.sort((a, b) => b.size - a.size);

      layout = getLayout(json.words);
      svg = getSVG();
      cloud = cloudResult(svg);

      result.style.padding = "2em";
      resultTitle.style.paddingBottom = "1em";
      resultTitle.style.borderBottom = "1px solid #2a2a2a";

      if (json.title)
        addLink(`https://en.wikipedia.org/wiki/${json.title}`, json.title);

      update(json.words);
    });
}

function clearResult() {
  resultCloud.innerHTML = "";
  resultTitle.innerHTML = "";
  result.style.padding = "0";
  resultTitle.style.paddingBottom = "0";
  resultTitle.style.borderBottom = "unset";
}

function addLink(url, text) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.innerText = text;

  resultTitle.appendChild(a);
}

function getLayout(words) {
  return d3.layout
    .cloud()
    .timeInterval(Infinity)
    .size([w, h])
    .words(words)
    .rotate(0)
    .fontSize(function(d) {
      return fontSize(+d.size);
    })
    .on("end", draw);
}

function getSVG() {
  return d3
    .select("#result-cloud")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
}

function cloudResult(svg) {
  return svg
    .append("g")
    .attr("transform", "translate(" + [w >> 1, h >> 1] + ")");
}

if (window.attachEvent) {
  window.attachEvent("onresize", update);
} else if (window.addEventListener) {
  window.addEventListener("resize", update);
}

function draw(data, bounds) {
  w = getWidth();
  h = window.innerHeight;
  svg.attr("width", w).attr("height", h);

  scale = bounds
    ? Math.min(
        w / Math.abs(bounds[1].x - w / 2),
        w / Math.abs(bounds[0].x - w / 2),
        h / Math.abs(bounds[1].y - h / 2),
        h / Math.abs(bounds[0].y - h / 2)
      ) / 2
    : 1;

  const text = cloud.selectAll("text").data(data, function(d) {
    return d.text.toLowerCase();
  });

  text
    .transition()
    .duration(1000)
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .style("font-size", function(d) {
      return d.size + "px";
    });

  text
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .style("font-size", function(d) {
      return d.size + "px";
    })
    .style("opacity", 1e-6)
    .transition()
    .duration(1000)
    .style("opacity", 1);

  text
    .style("font-family", function(d) {
      return d.font;
    })
    .style("fill", function(d) {
      return fill(d.text.toLowerCase());
    })
    .text(function(d) {
      return d.text;
    });

  cloud
    .transition()
    .attr(
      "transform",
      "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")"
    );
}

function update(words) {
  layout.font("impact").spiral("archimedean");
  fontSize = d3.scale["sqrt"]().range([10, 100]);

  if (words.length)
    fontSize.domain([+words[words.length - 1].size || 1, +words[0].size]);

  layout
    .stop()
    .words(words)
    .start();
}
