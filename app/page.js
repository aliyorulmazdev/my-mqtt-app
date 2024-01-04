"use client"
// pages/index.js
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import { db } from './firebaseConfig'; // db bağlantısını ekleyin
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Firestore'dan temperatureData koleksiyonundaki verileri al
        const querySnapshot = await getDocs(collection(db, 'temperatureData'));
        
        // Alınan veriyi bir diziye dönüştür
        const data = querySnapshot.docs.map((doc) => doc.data());

        // State'i güncelle
        setTemperatureData(data);
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
