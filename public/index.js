import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "regenerator-runtime/runtime.js";
import testData from "data";

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
  "T01L PRJ~TSK~Task Dpendency|Dependencies~SortOrder|sj::PK_TASK_ID";
var day = 60 * 60 * 24 * 1000;
window.loadData = (obj) => {
  // const data = JSON.parse(obj);
  const data = testData;
  console.log("DATA", testData);
  const taskIds = data.map((i) => {
    return i.fieldData["PK_TASK_ID"];
  });
  // return;
  const createArray = (i) => {
    const dateStart = new Date(i.fieldData["Start Date"]);
    const dateEnd = new Date(i.fieldData["End Date"]);
    const endDate =
      dateStart.getTime() === dateEnd.getTime()
        ? new Date(dateEnd.getTime() + day)
        : dateEnd;

    const inclDep = taskIds.includes(i.fieldData[dependField])
      ? i.fieldData[dependField]
      : null;
    console.log(inclDep);
    console.log(i.fieldData["Task Name"], dateStart, dateEnd, endDate);
    const a = [
      i.fieldData["PK_TASK_ID"],
      i.fieldData["Task Name"],
      groups[i.fieldData["Group"]],
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
      // height: 1000,
      gantt: {
        sortTasks: false,
        labelMaxWidth: 600,
        trackHeight: 20,
        barHeight: 16,
        arrow: { width: 1, color: "gray" },
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
