import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "regenerator-runtime/runtime.js";
import html2canvas from "html2canvas";

const groups = [
  "Project Name",
  "Initiation",
  "Requirements",
  "Planning/Design",
  "Implementation",
  "Closing",
];
function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}
const dependField =
  "T01L PRJ~TSK~Task Dependency|Dependencies~SortOrder|sj::PK_TASK_ID";

var day = 60 * 60 * 24 * 1000;
window.loadData = (obj, trackHeight) => {
  let chart;
  const data = JSON.parse(obj);
  // alert("Load");
  const json = data;
  const taskIds = data.map((i) => {
    return i.fieldData["PK_TASK_ID"];
  });
  // return;
  const createArray = (i) => {
    const milestone = i.fieldData["Milestone Display"];
    const taskName =
      milestone === "Yes"
        ? "🌟 " + i.fieldData["Task Name"] + " 🌟"
        : i.fieldData["Task Name"];
    const dateStart = new Date(i.fieldData["Start Date"]);
    const dateEnd = new Date(i.fieldData["End Date"]);
    const endDate =
      dateStart.getTime() === dateEnd.getTime()
        ? new Date(dateEnd.getTime() + day)
        : dateEnd;

    const inclDep = taskIds.includes(i.fieldData[dependField])
      ? i.fieldData[dependField]
      : null;
    const a = [
      i.fieldData["PK_TASK_ID"],
      taskName,
      i.fieldData["T01L2 PRJ~TSK_Tasks |FK_PROJ_ID~Group|::Task Name"],
      new Date(i.fieldData["Start Date"]),
      endDate,
      null,
      i.fieldData["Percent Complete"] * 100,
      inclDep,
    ];
    return a;
  };
  const arr = json.map(createArray);
  const len = arr.length;
  google.charts.load("current", { packages: ["gantt"] });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn("string", "Task ID");
    data.addColumn("string", "Task Name");
    data.addColumn("string", "Resource");
    data.addColumn("date", "Start Date");
    data.addColumn("date", "End Date");
    data.addColumn("number", "Duration");
    data.addColumn("number", "Percent Complete");
    data.addColumn("string", "Dependencies");

    data.addRows(arr);
    var options = {
      height: len * trackHeight + 2 + 40,
      // height: 1000,
      gantt: {
        labelStyle: {
          fontSize: trackHeight * 0.75,
        },
        sortTasks: false,
        labelMaxWidth: 600,
        trackHeight: trackHeight,
        barHeight: trackHeight - 6,
        arrow: { width: 1, color: "gray" },
        criticalPathEnabled: true,
        criticalPathStyle: {
          stroke: "#e64a19",
          strokeWidth: 2,
        },
      },
    };
    chart = new google.visualization.Gantt(
      document.getElementById("chart_div")
    );
    // console.log(chart);
    google.visualization.events.addListener(chart, "ready", afterDraw);
    // Wait for the chart to finish drawing before calling the getImageURI() method.

    chart.draw(data, options);
  }
  function afterDraw() {
    var g = document
      .getElementsByTagName("svg")[0]
      .getElementsByTagName("g")[1];
    document.getElementsByTagName("svg")[0].parentNode.style.top = "40px";
    document.getElementsByTagName("svg")[0].style.overflow = "visible";
    var height =
      Number(g.getElementsByTagName("text")[0].getAttribute("y")) + 15;
    g.setAttribute("transform", "translate(0,-" + height + ")");
    g = null;
  }

  const addLabelText = (chartId, allTasks) => {
    const toContainer = $("#" + chartId + " > div > div");
    $("#" + chartId + " g:eq(5) text").forEach(function ($index) {
      console.log($(this).innerHTML);
    });
  };

  window.GetImagesFromWebViewer = function () {
    alert("Image");
    var scriptName = "Receive Image";
    var sendImages = function ({ imgURI, blob }) {
      var chartName = "Chart1";
      if (imgURI) {
        var obj = { name: chartName, img: imgURI };
        window.FileMaker.PerformScriptWithOption(
          scriptName,
          JSON.stringify(obj),
          5
        );
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        console.log(base64data);
        var obj = { name: chartName, img: base64data };
        window.FileMaker.PerformScriptWithOption(
          scriptName,
          JSON.stringify(obj),
          5
        );
      };
    };
    // var sendImagesTwo = function ({ imgURI, blob }) {
    //   var chartName = "Chart2";
    //   if (imgURI) {
    //     var obj = { name: chartName, img: imgURI };
    //     window.FileMaker.PerformScriptWithOption(
    //       scriptName,
    //       JSON.stringify(obj),
    //       5
    //     );
    //     return;
    //   }
    //   var reader = new FileReader();
    //   reader.readAsDataURL(blob);
    //   reader.onloadend = function () {
    //     var base64data = reader.result;
    //     console.log(base64data);
    //     var obj = { name: chartName, img: base64data };
    //     window.FileMaker.PerformScriptWithOption(
    //       scriptName,
    //       JSON.stringify(obj),
    //       5
    //     );
    //   };
    // };
    google.visualization.events.addListener(chart, "ready", function () {
      var svg = document.getElementsByTagName("svg")[0];
      console.log(svg);
      var output = document.createElement("canvas");
      canvg(output, new XMLSerializer().serializeToString(svg));
      console.log("OUTPUT", output);
    });
  };
};
window.saveImage = () => {
  html2canvas(document.querySelector("#chart_div")).then((canvas) => {
    const img = canvas.toDataURL("image/png");
    // console.log(img);

    FileMaker.PerformScriptWithOption("Get Image", JSON.stringify(img), 5);
  });
};
