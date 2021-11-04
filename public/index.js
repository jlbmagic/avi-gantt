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
const dependField =
  "T01L PRJ~TSK~Task Dpendency|Dependencies~SortOrder|sj::PK_TASK_ID";
var day = 60 * 60 * 24 * 1000;
window.loadData = (obj, trackHeight) => {
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
          fontSize: 16,
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
    var chart = new google.visualization.Gantt(
      document.getElementById("chart_div")
    );

    chart.draw(data, options);
  }

  const addLabelText = (chartId, allTasks) => {
    const toContainer = $("#" + chartId + " > div > div");
    $("#" + chartId + " g:eq(5) text").forEach(function ($index) {
      console.log($(this).innerHTML);
    });
  };
};
