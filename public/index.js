import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "regenerator-runtime/runtime.js";
// import data from "data";

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
window.loadData = (obj) => {
  const data = JSON.parse(obj);
  // alert("Load");
  const json = data.filter((i) => {
    return i.fieldData.Indent > 1;
  });
  // return;
  const createArray = (i) => {
    const a = [
      i.fieldData["PK_TASK_ID"],
      i.fieldData["Task Name"],
      i.fieldData["Group"].toString(),
      new Date(i.fieldData["Start Date"]),
      new Date(i.fieldData["End Date"]),
      null,
      i.fieldData["Percent Complete"] * 100,
      null,
    ];
    return a;
  };
  const arr = json.map(createArray);
  console.log(arr);
  const len = arr.length;
  google.charts.load("current", { packages: ["gantt"] });
  google.charts.setOnLoadCallback(drawChart);

  const array = [
    [
      "1234",
      "Find sources",
      //   null,
      new Date(2015, 0, 1),
      new Date(2015, 0, 5),
      null,
      100,
      null,
    ],
    [
      "Write",
      "Write paper",
      //   "write",
      null,
      new Date(2015, 0, 9),
      daysToMilliseconds(3),
      25,
      "1234,Outline",
    ],
    [
      "Cite",
      "Create bibliography",
      //   "write",
      null,
      new Date(2015, 0, 7),
      daysToMilliseconds(1),
      20,
      "1234",
    ],
    [
      "Complete",
      "Hand in paper",
      //   "complete",
      null,
      new Date(2015, 0, 10),
      daysToMilliseconds(1),
      0,
      "Cite,Write",
    ],
    [
      "Outline",
      "Outline paper",
      //   "write",
      null,
      new Date(2015, 0, 6),
      daysToMilliseconds(1),
      100,
      "1234",
    ],
  ];
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
      height: len * 22 + 40,

      gantt: {
        labelMaxWidth: 600,
        trackHeight: 20,
        barHeight: 16,
        arrow: { width: 1, color: "purple" },
        criticalPathEnabled: true,
        criticalPathStyle: {
          stroke: "#e64a19",
          strokeWidth: 2,
        },
      },
    };
    var chart = new google.visualization.Gantt(
      document.getElementById("chart_div")
    );

    chart.draw(data, options);
  }
};
