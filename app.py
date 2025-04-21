from flask import Flask, render_template, request, jsonify
import pyttsx3
import speech_recognition as sr
import datetime
import pywhatkit
import webbrowser

app = Flask(__name__)

engine = pyttsx3.init()
recognizer = sr.Recognizer()

def speak(text):
    engine.say(text)
    engine.runAndWait()

def check_time():
    now = datetime.datetime.now()
    return now.strftime("%H:%M:%S")

def send_whatsapp_message(contact, message):
    now = datetime.datetime.now()
    hour = now.hour
    minute = now.minute + 2
    pywhatkit.sendwhatmsg(contact, message, hour, minute)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/command', methods=['POST'])
def handle_command():
    data = request.json
    command = data.get("command", "").lower()

    if "time" in command:
        response = f"The time is {check_time()}"
    elif "send message" in command:
        response = "This feature requires a phone number and message, and cannot run from browser."
    elif "open youtube" in command:
        webbrowser.open("https://youtube.com")
        response = "Opening YouTube"
    elif "open google" in command:
        webbrowser.open("https://google.com")
        response = "Opening Google"
    elif "stop" in command:
        response = "Goodbye!"
    else:
        response = "Sorry, I didn’t understand the command."

    speak(response)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)
