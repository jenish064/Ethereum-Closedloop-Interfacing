import React from "react";
import Chart from "react-apexcharts";

const LineChart = (props) => {
  console.log("from <LineChart /> props.data:::", props.data);
  return (
    <div className="line charts">
      <Chart
        type="area"
        width={1000}
        height={380}
        series={[
          {
            name: "jira tickets",
            data: props.data,
          },
        ]}
        options={{
          title: {
            text: "Line Chart",
            style: { fontSize: 15, color: "white" },
          },
          theme: { mode: "light" },
          // tooltip: {
          //     theme: 'dark',
          //  },
          colors: ["#4481eb", "#cccc00"],
          xaxis: {
            categories: props.data,
            title: { text: "Duration", style: { color: "white" } },
            stroke: {
              curve: "smooth",
            },
            // style:{backgroundColor:'white'}
          },
        }}
      ></Chart>
    </div>
  );
};

export default LineChart;
