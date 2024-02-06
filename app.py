from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Pass some data to the template
    title = "Simple Flask App"
    message = "Welcome to my simple Flask app!"
    return render_template('index.html', title=title, message=message)

if __name__ == '__main__':
    app.run(debug=True)
