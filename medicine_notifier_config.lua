-- Configuration file for Medicine Notifier
-- Copy these values to medicine_notifier.lua or modify medicine_notifier.lua directly

-- WiFi Configuration
WIFI_SSID = "YOUR_WIFI_SSID"
WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"

-- API Configuration
API_BASE_URL = "http://your-api-url.com"  -- e.g., "http://192.168.1.100:5000" or "https://api.remedin.com"
API_TOKEN = "YOUR_AUTH_TOKEN"  -- Get this from your app after login

-- Polling Configuration (in milliseconds)
POLL_INTERVAL = 30000  -- How often to fetch schedules from API (30 seconds)
CHECK_INTERVAL = 10000  -- How often to check if notifications are needed (10 seconds)

-- Hardware Pin Configuration (GPIO pins)
-- For NodeMCU ESP8266: D0=16, D1=5, D2=4, D3=0, D4=2, D5=14, D6=12, D7=13, D8=15
-- For ESP32: Use GPIO numbers directly
BUZZER_PIN = 4      -- GPIO pin for buzzer
LED_PIN_1 = 5       -- GPIO pin for LED 1
LED_PIN_2 = 16      -- GPIO pin for LED 2
LED_PIN_3 = 14      -- GPIO pin for LED 3
LED_PIN_4 = 12      -- GPIO pin for LED 4

-- Notification Settings
BUZZER_FREQUENCY = 1000  -- Buzzer frequency in Hz
NOTIFICATION_DURATION = 5000  -- How long to notify in milliseconds (5 seconds)
PRE_ALARM_VOLUME = 256  -- PWM duty cycle for pre-alarm (0-1023, lower = quieter)
ALARM_VOLUME = 512      -- PWM duty cycle for main alarm (0-1023)

-- NTP Configuration (for time synchronization)
NTP_SERVER = "pool.ntp.org"
TIMEZONE_OFFSET = -3  -- UTC offset in hours (e.g., -3 for Brazil)


