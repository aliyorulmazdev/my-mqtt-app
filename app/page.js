"use client"
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { db } from './firebaseConfig'; // db bağlantısını ekleyin
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  const sortDataByDate = (data) => {
    // Sort data based on date in descending order
    return data.sort((a, b) => b.date.seconds - a.date.seconds);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore'dan temperatureData koleksiyonundaki verileri al
        const querySnapshot = await getDocs(collection(db, 'temperatureData'));
        
        // Alınan veriyi bir diziye dönüştür
        const data = querySnapshot.docs.map((doc) => doc.data());

        // Sort data by date
        const sortedData = sortDataByDate(data);

        // Take the first 5 elements
        const slicedData = sortedData.slice(0, 10);

        // State'i güncelle
        setTemperatureData(slicedData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    ['Time', 'Temperature'],
    ...temperatureData.map((data) => [
      new Date(data.date.seconds * 1000).toLocaleTimeString(),
      data.value,
    ]),
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">1Tik.Net Live Temperature Data</h1>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={chartData}
        options={{
          hAxis: {
            title: 'Time',
          },
          vAxis: {
            title: 'Temperature',
          },
        }}
      />
    </div>
  );
};

export default Home;