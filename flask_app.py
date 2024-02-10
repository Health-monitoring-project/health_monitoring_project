from flask import Flask, render_template, jsonify, request

app = Flask(__name__, template_folder='templates')

# Create a global variable to store the sensor data
sensor_data = {"temperature": 0, "pulse": 0}

@app.route('/')
@app.route('/temp')
@app.route('/ecg')
def index():
    return render_template('heart_chart.html', sensor_data=sensor_data)

# Add a new route to handle the incoming sensor data
@app.route('/update_data', methods=['GET', 'POST'])
def update_data():
    global sensor_data
    data = request.json
    temperature = data.get('temperature', 0)
    temperature_f = data.get('temperature', 1)
    pulse = data.get('pulse', 0)
    sensor_data = {"temperature": temperature, "pulse": pulse}
    return 'Data received successfully', 200

if __name__ == '__main__':
    app.run(debug=True)
