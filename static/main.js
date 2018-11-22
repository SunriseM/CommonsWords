const urlInput = document.getElementById("url-input");
const urlInputSubmit = document.getElementById("url-input-sbt");
const result = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultCloud = document.getElementById("result-cloud");
const randomWiki = document.getElementById("rndwiki");

const fill = d3.scale.category20b();
class CommonWords {
   constructor({
      width,
      height
   }) {
      this.width = width;
      this.height = height;
      this.fontSize = 0;
      this.words = [];
   }

   start() {
      urlInputSubmit.onclick = () =>
         this.createWordsCloud(`api/1/get_words?url=${encodeURI(urlInput.value)}`);
      randomWiki.onclick = () => this.createWordsCloud("api/1/rndwiki");

      if (window.attachEvent) {
         window.attachEvent("onresize", this.update);
      } else if (window.addEventListener) {
         window.addEventListener("resize", this.update);
      }
   }

   clear() {
      resultCloud.innerHTML = "";
      resultTitle.innerHTML = "";
      result.style.padding = "0";
      resultTitle.style.paddingBottom = "0";
      resultTitle.style.borderBottom = "unset";
   }

   styleResult() {
      result.style.padding = "2em";
      resultTitle.style.paddingBottom = "1em";
      resultTitle.style.borderBottom = "1px solid #2a2a2a";
   }

   addLink(url, title) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.innerText = title;

      resultTitle.appendChild(a);
   }

   getLayout() {
      return d3.layout
         .cloud()
         .timeInterval(Infinity)
         .size([this.width, this.height])
         .words(this.words)
         .rotate(0)
         .fontSize(function (d) {
            return fontSize(+d.size);
         })
         .on("end", this.draw);
   }


   getSVG() {
      return d3
         .select("#result-cloud")
         .append("svg")
         .attr("width", this.width)
         .attr("height", this.height);
   }

   cloudResult() {
      return this.svg
         .append("g")
         .attr("transform", "translate(" + [this.width >> 1, this.height >> 1] + ")");
   }


   draw(data, bounds) {
      this.width = getWidth();
      this.height = window.innerHeight;
      this.svg.attr("width", w).attr("height", h);

      scale = bounds ?
         Math.min(
            this.width / Math.abs(bounds[0].x - this.width / 2),
            this.width / Math.abs(bounds[1].x - this.width / 2),
            this.height / Math.abs(bounds[1].y - this.height / 2),
            this.height / Math.abs(bounds[0].y - this.height / 2)
         ) / 2 :
         1;

      const text = this.cloud.selectAll("text").data(data, function (d) {
         return d.text.toLowerCase();
      });

      text
         .transition()
         .duration(1000)
         .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
         })
         .style("font-size", function (d) {
            return d.size + "px";
         });

      text
         .enter()
         .append("text")
         .attr("text-anchor", "middle")
         .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
         })
         .style("font-size", function (d) {
            return d.size + "px";
         })
         .style("opacity", 1e-6)
         .transition()
         .duration(1000)
         .style("opacity", 1);

      text
         .style("font-family", function (d) {
            return d.font;
         })
         .style("fill", function (d) {
            return fill(d.text.toLowerCase());
         })
         .text(function (d) {
            return d.text;
         });

      this.cloud
         .transition()
         .attr("transform", `translate(${[this.width >> 1, this.height >> 1]}) scale(${scale})`);
   }

   update() {
      this.layout.font("impact").spiral("archimedean");
      this.fontSize = d3.scale["sqrt"]().range([10, 100]);

      if (this.words.length)
         this.fontSize.domain([+this.words[this.words.length - 1].size || 1, +this.words[0].size]);

      this.layout
         .stop()
         .words(this.words)
         .start();
   }

   async createWorldsCloud(url) {
      const res = await fetch(url);
      const json = await res.json();

      this.clearResult();

      this.words = json.words.sort((a, b) => b.size - a.size);

      this.layout = this.getLayout();
      this.svg = this.getSVG();
      this.cloud = this.cloudResult();

      this.styleResult();

      if (json.title)
         this.addLink(`https://en.wikipedia.org/wiki/${json.title}`, json.title);

      this.update();
   }
}


const app = CommonWords({
   width: resultCloud.offsetWidth,
   height: window.innerHeight
})
app.start();