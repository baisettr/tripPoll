import React from "react";
import Chart from "react-google-charts";

const ChartComponent = (props) => {
    const data = props.data;
    const data1 = props.data1;
    const data2 = props.data2;
    const options = {
        title: "Overall trip summary",
        pieHole: 0.4,
        is3D: false,
    };
    const options1 = {
        title: "Overall trip summary by places",
        pieHole: 0.4
    };
    const options2 = {
        title: "Overall trip summary by month",
        pieHole: 0.4
    };

    if (data[1][1] === 0 || data[2][1] === 0) { options.pieSliceTextStyle = { color: 'black' } }
    if (data1.length === 2) { options1.pieSliceTextStyle = { color: 'black' } }
    if (data2.length === 2) { options2.pieSliceTextStyle = { color: 'black' } }

    return (
        <React.Fragment>
            <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
            />
            <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={data1}
                options={options1}
            />
            <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={data2}
                options={options2}
            />
        </React.Fragment>
    )
}

export default ChartComponent;

