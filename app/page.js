"use client";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { InfluxDB } from "@influxdata/influxdb-client";
import { InfluxDBConfig } from './influxConfig';
import ReactDOM from 'react-dom';

const influx = new InfluxDB({
  url: InfluxDBConfig.url,
  token: InfluxDBConfig.token,
});
const queryApi = influx.getQueryApi(InfluxDBConfig.org);

const Home = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  const sortDataByDate = (data) => {
    return data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fluxQuery =
          'from(bucket:"sensordata") |> range(start: -30d) |> filter(fn: (r) => r._measurement == "temperature_data")';

        // Execute InfluxDB query
        const result = await queryApi.collectRows(fluxQuery);

        // Alınan veriyi bir diziye dönüştür
        const data = result.map((row) => ({
          date: new Date(row._time),
          value: row._value,
        }));

        // Sort data by date
        const sortedData = sortDataByDate(data);

        // Take the first 10 elements
        const slicedData = sortedData.slice(0, 10);

        // State'i güncelle
        setTemperatureData(slicedData);
      } catch (error) {
        console.error("Error fetching data from InfluxDB:", error);
      }
    };

    // İlk veriyi almak için
    fetchData();

    // Ardından belirli aralıklarla veriyi güncelle
    const intervalId = setInterval(fetchData, 2000);

    // Component unmount olduğunda interval'i temizle
    return () => clearInterval(intervalId);
  }, []);

  const chartData = [
    ["Time", "Temperature"],
    ...temperatureData.map((data) => [
      data.date.toLocaleTimeString(),
      data.value,
    ]),
  ];

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
    };

    const chartContainer = document.getElementById('chart-container');
    chartContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      chartContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div id="chart-container" className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        InfluxDB Live Temperature Data
      </h1>
      {temperatureData.length > 0 ? (
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={{
            hAxis: {
              title: "Time",
            },
            vAxis: {
              title: "Temperature",
            },
          }}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Home;
