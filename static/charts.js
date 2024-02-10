
        // Initialize heart rate chart
        const heartRateCtx = document.getElementById('heartRateChart').getContext('2d');
        const heartRateChart = new Chart(heartRateCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Heart Rate',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    data: [],
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Initialize ECG chart
        const ecgChart = Plotly.newPlot('ecgChart', [{
            type: 'scatter',
            mode: 'lines',
            x: [],
            y: [],
            line: { color: 'blue' },
        }], {
            title: 'ECG Monitoring',
            xaxis: {
                title: 'Time',
            },
            yaxis: {
                title: 'ECG Signal',
            },
        });

        // Initialize temperature chart
        const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
        const temperatureChart = new Chart(temperatureCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature (°C)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: [],
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'xy',
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true,
                            },
                            mode: 'xy',
                        },
                    }
                }
            }
        });

        // Function to update charts with new data
        function updateCharts(data) {
            console.log('Updating charts with data:', data);

            // Update heart rate chart
            updateHeartRateChart(data.pulse);

            // Update ECG chart
            updateECGChart();

            // Update temperature chart
            updateTemperatureChart(data.temperature);

            // Update textual readings
            updateTextualReadings(data.temperature, data.pulse);
        }

        // Function to update the textual readings
        function updateTextualReadings(temperature, pulse) {
            document.getElementById('heartRateReading').innerText = `Heart Rate: ${pulse}`;
            document.getElementById('temperatureReading').innerText = `Temperature: ${temperature} °C`;
        }

        // Function to update the heart rate chart
        function updateHeartRateChart(pulse) {
            heartRateChart.data.labels.push(`Reading ${heartRateChart.data.labels.length + 1}`);
            heartRateChart.data.datasets[0].data.push(pulse);
            heartRateChart.update();
        }

        // Function to update the ECG chart
        function updateECGChart() {
            if (ecgChart.data && ecgChart.data[0] && ecgChart.data[0].x) {
                const newDataPoint = {
                    x: ecgChart.data[0].x.length,
                    y: Math.sin(ecgChart.data[0].x.length / 10) * 10, // Replace with actual ECG data
                };
                Plotly.extendTraces('ecgChart', { x: [newDataPoint.x], y: [newDataPoint.y] }, [0]);

                // Scroll the chart to always show the latest data
                Plotly.relayout('ecgChart', {
                    'xaxis.range[0]': ecgChart.data[0].x.length > 50 ? ecgChart.data[0].x.length - 50 : 0,
                    'xaxis.range[1]': ecgChart.data[0].x.length,
                });
            }
        }

        // Function to update the temperature chart
        function updateTemperatureChart(temperature) {
            const maxReadings = 7; // Maximum number of readings to keep
            if (temperatureChart.data.datasets[0].data.length >= maxReadings) {
                temperatureChart.data.labels.shift();
                temperatureChart.data.datasets[0].data.shift();
            }
            temperatureChart.data.labels.push(`${temperature* 9.0 / 5.0 + 32.0} °F`);
            temperatureChart.data.datasets[0].data.push(temperature);
            temperatureChart.update();
        }

        // Function to fetch data from the server and update charts
        function fetchData() {
            fetch('/update_data')  // Replace with the actual endpoint
                .then(response => response.json())
                .then(data => {
                    updateCharts(data);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

        // Simulate real-time updates every second (replace with actual data updates)
        setInterval(fetchData, 1000);

