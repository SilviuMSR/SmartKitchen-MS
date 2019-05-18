import RPi.GPIO as GPIO
import time
import requests
from pprint import pprint
import datetime
import Adafruit_DHT

BASE_URL = "http://172.16.254.153:9002/boards/"
URL_BOARD_BY_NAME = "http://172.16.254.153:9002/boards/byName"

# Setup for humidity and temperature sensor
humidityAndTemperatureSensor = Adafruit_DHT.DHT22
humidityAndTemperatureSensorGPIO = 7

GPIO.setmode(GPIO.BOARD)
GPIO.setup(12,GPIO.OUT)
GPIO.setwarnings(False)
# Light LED
GPIO.setup(11,GPIO.OUT)
pwm = GPIO.PWM(11, 50)
# Button for Light LED
GPIO.setup(15, GPIO.IN, pull_up_down=GPIO.PUD_UP)
# Button for Step motor
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_UP)

boardName = "FinalBoardName"
#Used to check PWM button state (HIGH or LOW)
buttonPWMState = 0
#Used to check Step Motor button state
buttonStepState = 0
#Used to check Step Motor state
fanState = 0
#Used to stop Step Motor
whileBreaker = 0
#Used to check if PWM Button is initialzed
pwmIsInitialized = 0
#Used to check when new hour appear
hourCheck = 0

StepPins = [13,16,18,22]

# Step Motor Initialization
# Set pins at output
for pin in StepPins:
  	GPIO.setup(pin,GPIO.OUT)
  	GPIO.output(pin, False)

Seq = [[1,0,0,1],
       [1,0,0,0],
       [1,1,0,0],
       [0,1,0,0],
       [0,1,1,0],
       [0,0,1,0],
       [0,0,1,1],
       [0,0,0,1]]

StepCount = len(Seq)
StepDir = 1

StepCounter = 0

# Function which check the state of the step motor and base on it start the step motor
def startFan(board):
	global fanState
	if fanState == 0:
		print "Starting fan..."
		turnMotorOn()
		fanState = 1
	else:
		print "Fan is already ON..."

# Reset the fan state 
def stopFan(board):
	global fanState
	global whileBreaker
	fanState = 0
	whileBreaker = 0
	print "Stoping fan..."

# Code to make step motor working
def turnMotorOn():
	global StepCounter
	global StepCount
	global StepDir
	global Seq
	global whileBreaker

	while True:
  		for pin in range(0, 4):
  			xpin = StepPins[pin]
  			if Seq[StepCounter][pin]!=0:
  				#print "Enable GPIO %i" %(xpin)
  				GPIO.output(xpin, True)
  			else:
  				GPIO.output(xpin, False)

  		StepCounter += StepDir

  		if (StepCounter >= StepCount):
  			StepCounter = 0
  		if (StepCounter < 0):
  			StepCounter = StepCount + StepDir

  		if whileBreaker == 1:
  			stopFan()
  			break

  		time.sleep(0.001)

# This function is used to control step motor from button
def controllStepMotorFromButton(pin):
	global buttonStepState
	global whileBreaker

	if buttonStepState == 0:
		print "TURN STEP MOTOR ON"
		buttonStepState = 1
		startFan()
	else:
		print "TURN STEP MOTOR OFF"
		buttonStepState = 0
		whileBreaker = 1

# This function is used to controll pwm led from button
def controllPWMLEDFromButton(pin):
	# Check only for RISING, if event occured
	# Check for previous state and based on that change led state
	global buttonPWMState
	if buttonPWMState == 0:
		print "PWM LED ON..."
		buttonPWMState = 1
		GPIO.output(11, GPIO.HIGH)
	else:
		print "PWM LED OFF..."
		buttonPWMState = 0
		GPIO.output(11, GPIO.LOW)

# This function is used to initialize PWM for LED
def initializePWM():
	print "Initializing PWM..."
	global pwmIsInitialized
	pwmIsInitialized = 1
	pwm.start(10)

# This function is used to reset PWM to its initial value
def resetPWM():
	print "PWM reseting..."
	pwm.ChangeDutyCycle(10)

# Function used to increase the PWM value
def increasePWM(increaseNumber):
	print "Changing Duty Cycle..."
	pwm.ChangeDutyCycle(increaseNumber)

# Function used to get the temperature from DHT22 Sensor
def getTemperature(board):
	print "Fetching temperature..."
	temperature = Adafruit_DHT.read_retry(humidityAndTemperatureSensor, humidityAndTemperatureSensorGPIO)
	return temperature

# Function used to get the humidity from DHT22 Sensor
def getHumidity(board):
	print "Fetching humidity..."
	humidity = Adafruit_DHT.read_retry(humidityAndTemperatureSensor, humidityAndTemperatureSensorGPIO)
	return humidity

# The loop in which our application is working, getting requests from UI and executing commands
def applicationStart(board):
	print "Aplication started..."
	maxPWM = 100
	increaseNumber = 10
	if turnedOn(board) == True:
		while True:
			print 'Waiting for your actions...'
			#Requests part
			response = requests.get(BASE_URL + board['_id'])
			json_response = response.json()
			if json_response['status'] == 200:
				currentBoard = json_response['board'][0]

				if currentBoard['temperature'] == True:
					print "Fetching temperature from sensor..."
					currentTemperature = getTemperature(board)
					if currentTemperature > 26:
						startFan()
					# send request to set temperature to false
					temperatureResponse = requests.put(BASE_URL + board['_id'] + '/turnTemperatureOFF')
					print "Stopping temperature sensor..."

				elif currentBoard['humidity'] == True:
					print "Fetching humidity from humidity sensor..."
					currentHumidity = getHumidity(board)
					if currentHumidity > 26:
						startFan()
					# send request to set humidity to false
					temperatureResponse = requests.put(BASE_URL + board['_id'] + '/turnHumidityOFF')
					print "Stopping humidity sensor..."

				elif currentBoard['fan'] == True:
					startFan(board)

				elif currentBoard['fan'] == False:
					stopFan(board)

				elif currentBoard['isON'] == False:
					turnedOff(board)

				else:
					turnedOn(board)

				#Light controll
				if currentTime.hour == 13:
					if pwmIsInitialized == 0:
						initializePWM()

				elif currentTime.hour == 18:
					if hourCheck == 0: 
						increaseNumber += 20
						hourCheck = 1
						increasePWM(increaseNumber)
				  elif currentTime.minute == 59 and currentTime.second == 59:
						hourCheck = 0

				elif currentTime.hour == 19:
					if hourCheck == 0:
						increaseNumber += 20
						hourCheck = 1
						increasePWM(increaseNumber)
				  elif currentTime.minute == 59 and currentTime.second == 59:
						hourCheck = 0

				elif currentTime.hour <= 24: 
				  if hourCheck == 0:
						hourCheck = 1
						increasePWM(maxPWM)
				  elif currentTime.hour == 24 and currentTime.minute = 59 and currentTime.second == 59:
						hourCheck = 0

				elif currentTime.hour >= 1 and currentTime.hour <= 6:
					if hourCheck == 0:
						hourCheck = 1
						increasePWM(maxPWM)

				else:
					hourCheck = 0
					resetPWM()

				time.sleep(1)

# Function which check if the board is OFF
def turnedOff(board):
	# Make get requests to api and check if 'isOn' is False
	response = requests.get(BASE_URL + board['_id'])
	json_response = response.json()
	
	if json_response['status'] == 200:
		currentBoard = json_response['board'][0]
		if currentBoard['isON'] == False:
			print 'Board is OFF right now...'
			GPIO.output(12, GPIO.LOW)
			return True
		else:
			return False
	else:
		print 'Bad request'
		return False

# Function which check if board is ON
def turnedOn(board):
	# Make get requests to api and check if 'isOn' is True
	response = requests.get(BASE_URL + board['_id'])
	json_response = response.json()
	 
	if json_response['status'] == 200:
		currentBoard = json_response['board'][0]
		if currentBoard['isON'] == True:
			print 'Board is ON right now...'
			GPIO.output(12, GPIO.HIGH)
			return True
		else:
			return False
	else:
		print 'Bad request'
		return False

# Function used for initialization and which check if the board is initialized or not
def initialization():
    query_params = {'name': 'FinalBoardName'}
    GPIO.output(12,GPIO.LOW)
    GPIO.output(11, GPIO.LOW)
    response = requests.get(URL_BOARD_BY_NAME, params=query_params)
    json_response = response.json()
    if json_response['board'] == []:
    	print "Your board is not initialized yet..."
    else:
    	print "Your board is succesfully initialized..."
    	board = json_response['board'][0]
    	applicationStart(board)

# Event detector for PWM LED button
GPIO.add_event_detect(15, GPIO.RISING, callback=controllPWMLEDFromButton, bouncetime=1000)
# Event detector for Step Motor button
GPIO.add_event_detect(7, GPIO.RISING, callback=controllStepMotorFromButton, bouncetime=1000)

# Main loop
while True:
	print "Starting..."
	initialization()
	time.sleep(2)