-- Medicine Schedule Notifier for ESP8266/ESP32
-- This script connects to the Remedin API and notifies users about upcoming medicine schedules
-- Hardware: ESP8266/ESP32, Buzzer, LEDs

-- ============================================
-- CONFIGURATION - UPDATE THESE VALUES
-- ============================================
local WIFI_SSID = "YOUR_WIFI_SSID"
local WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"
local API_BASE_URL = "http://your-api-url.com"  -- Update with your API URL
local API_TOKEN = "YOUR_AUTH_TOKEN"  -- Bearer token for API authentication
local POLL_INTERVAL = 30000  -- Check schedules every 30 seconds (in milliseconds)

-- Hardware Pin Configuration
local BUZZER_PIN = 4      -- GPIO pin for buzzer (D2 on NodeMCU)
local LED_PIN_1 = 5       -- GPIO pin for LED 1 (D1 on NodeMCU)
local LED_PIN_2 = 16      -- GPIO pin for LED 2 (D0 on NodeMCU)
local LED_PIN_3 = 14      -- GPIO pin for LED 3 (D5 on NodeMCU)
local LED_PIN_4 = 12      -- GPIO pin for LED 4 (D6 on NodeMCU)

-- Notification Settings
local BUZZER_FREQUENCY = 1000  -- Buzzer frequency in Hz
local NOTIFICATION_DURATION = 5000  -- How long to notify (5 seconds)
local PRE_ALARM_CHECK_INTERVAL = 60000  -- Check pre-alarms every minute

-- ============================================
-- GLOBAL VARIABLES
-- ============================================
local schedules = {}
local isNotifying = false
local lastNotificationTime = 0
local wifiConnected = false

-- ============================================
-- HARDWARE INITIALIZATION
-- ============================================
function initHardware()
    -- Configure buzzer pin
    pwm.setup(BUZZER_PIN, BUZZER_FREQUENCY, 0)
    pwm.start(BUZZER_PIN)
    
    -- Configure LED pins as output
    gpio.mode(LED_PIN_1, gpio.OUTPUT)
    gpio.mode(LED_PIN_2, gpio.OUTPUT)
    gpio.mode(LED_PIN_3, gpio.OUTPUT)
    gpio.mode(LED_PIN_4, gpio.OUTPUT)
    
    -- Turn off all LEDs initially
    gpio.write(LED_PIN_1, gpio.LOW)
    gpio.write(LED_PIN_2, gpio.LOW)
    gpio.write(LED_PIN_3, gpio.LOW)
    gpio.write(LED_PIN_4, gpio.LOW)
    
    print("Hardware initialized")
end

-- ============================================
-- WIFI CONNECTION
-- ============================================
function connectWifi()
    print("Connecting to WiFi...")
    wifi.setmode(wifi.STATION)
    wifi.sta.config({ssid=WIFI_SSID, pwd=WIFI_PASSWORD})
    wifi.sta.connect()
    
    -- Wait for connection
    local timeout = 0
    tmr.alarm(1, 1000, 1, function()
        timeout = timeout + 1
        if wifi.sta.getip() ~= nil then
            wifiConnected = true
            print("WiFi connected! IP: " .. wifi.sta.getip())
            tmr.stop(1)
            -- Start fetching schedules after WiFi connection
            tmr.create():alarm(2000, tmr.ALARM_SINGLE, fetchSchedules)
        elseif timeout > 20 then
            print("WiFi connection timeout!")
            tmr.stop(1)
            -- Retry connection
            tmr.create():alarm(5000, tmr.ALARM_SINGLE, connectWifi)
        end
    end)
end

-- ============================================
-- API FUNCTIONS
-- ============================================
function fetchSchedules()
    if not wifiConnected then
        print("WiFi not connected, skipping schedule fetch")
        return
    end
    
    print("Fetching schedules from API...")
    
    local url = API_BASE_URL .. "/api/Schedule?page=1&pageSize=100"
    
    http.get(url, {
        ["Authorization"] = "Bearer " .. API_TOKEN,
        ["Content-Type"] = "application/json"
    }, function(code, data)
        if code == 200 then
            local success, json = pcall(cjson.decode, data)
            if success and json.success and json.data then
                schedules = json.data.items or json.data.data or {}
                print("Fetched " .. #schedules .. " schedules")
                processSchedules()
            else
                print("Error parsing schedule data")
            end
        else
            print("API request failed with code: " .. code)
            if code == 401 then
                print("Authentication failed! Check your API_TOKEN")
            end
        end
    end)
end

-- ============================================
-- TIME UTILITIES
-- ============================================
function getCurrentTime()
    -- Get current time from NTP or use local time
    -- For ESP8266, you might need to sync with NTP server
    -- This is a simplified version - you may want to add NTP sync
    local timestamp = rtctime.get()
    if timestamp == nil or timestamp == 0 then
        -- If RTC not set, return nil (you should sync with NTP)
        return nil
    end
    
    local time = rtctime.epoch2cal(timestamp)
    return {
        year = time["year"],
        mon = time["mon"],
        day = time["day"],
        hour = time["hour"],
        min = time["min"],
        sec = time["sec"],
        wday = time["wday"]  -- 1=Sunday, 2=Monday, ..., 7=Saturday
    }
end

function parseTime(timeStr)
    -- Parse time string in format "HH:mm:ss"
    local hour, min, sec = string.match(timeStr, "(%d+):(%d+):(%d+)")
    return tonumber(hour), tonumber(min), tonumber(sec)
end

function timeToMinutes(hour, min)
    return hour * 60 + min
end

function getCurrentTimeInMinutes()
    local currentTime = getCurrentTime()
    if currentTime == nil then
        return nil
    end
    return timeToMinutes(currentTime.hour, currentTime.min)
end

function isTodayWeekDay(weekDays, currentWday)
    -- Check if today matches any of the weekDays
    -- weekDays: array of numbers (1=Monday, 2=Tuesday, ..., 7=Sunday)
    -- currentWday: 1=Sunday, 2=Monday, ..., 7=Saturday (ESP8266 format)
    -- Convert ESP8266 wday to our format (1=Monday, 7=Sunday)
    local ourWday = currentWday - 1
    if ourWday == 0 then ourWday = 7 end  -- Sunday becomes 7
    
    if weekDays == nil or #weekDays == 0 then
        return true  -- If no weekDays specified, assume daily
    end
    
    for i = 1, #weekDays do
        if weekDays[i] == ourWday then
            return true
        end
    end
    return false
end

-- ============================================
-- SCHEDULE PROCESSING
-- ============================================
function processSchedules()
    local currentTime = getCurrentTime()
    if currentTime == nil then
        print("Time not synchronized. Please sync with NTP server.")
        return
    end
    
    local currentMinutes = getCurrentTimeInMinutes()
    local currentWday = currentTime.wday
    
    for i = 1, #schedules do
        local schedule = schedules[i]
        
        -- Check if schedule applies today
        local appliesToday = false
        if schedule.frequencyType == 1 then  -- Daily
            appliesToday = true
        elseif schedule.frequencyType == 2 then  -- Weekly
            appliesToday = isTodayWeekDay(schedule.weekDays, currentWday)
        elseif schedule.frequencyType == 3 then  -- Monthly
            -- For monthly, you'd need to check the day of month
            -- This is simplified - you may want to enhance this
            appliesToday = true
        end
        
        if appliesToday then
            local schedHour, schedMin = parseTime(schedule.scheduledTime)
            local scheduledMinutes = timeToMinutes(schedHour, schedMin)
            
            -- Calculate time windows
            local preAlarmStart = scheduledMinutes - schedule.preAlarmMinutes
            local alarmStart = scheduledMinutes
            local alarmEnd = scheduledMinutes + schedule.posAlarmMinutes
            
            -- Check if we're in any notification window
            if currentMinutes >= preAlarmStart and currentMinutes <= alarmEnd then
                local timeUntilScheduled = scheduledMinutes - currentMinutes
                
                if currentMinutes < alarmStart then
                    -- Pre-alarm: approaching scheduled time
                    print("PRE-ALARM: Medicine scheduled in " .. timeUntilScheduled .. " minutes")
                    startNotification("pre-alarm")
                elseif currentMinutes >= alarmStart and currentMinutes <= alarmEnd then
                    -- Main alarm: scheduled time
                    print("ALARM: Medicine time! Schedule ID: " .. schedule.id)
                    startNotification("alarm")
                end
            end
        end
    end
end

-- ============================================
-- NOTIFICATION FUNCTIONS
-- ============================================
function startNotification(type)
    if isNotifying then
        return  -- Already notifying
    end
    
    isNotifying = true
    lastNotificationTime = tmr.now() / 1000  -- Convert to milliseconds
    
    print("Starting " .. type .. " notification...")
    
    -- Turn on all LEDs
    gpio.write(LED_PIN_1, gpio.HIGH)
    gpio.write(LED_PIN_2, gpio.HIGH)
    gpio.write(LED_PIN_3, gpio.HIGH)
    gpio.write(LED_PIN_4, gpio.HIGH)
    
    -- Start buzzer
    if type == "alarm" then
        -- More intense notification for actual alarm
        pwm.setduty(BUZZER_PIN, 512)  -- 50% duty cycle
        -- Blink LEDs faster
        blinkLEDs(200)  -- Blink every 200ms
    else
        -- Softer notification for pre-alarm
        pwm.setduty(BUZZER_PIN, 256)  -- 25% duty cycle
        blinkLEDs(500)  -- Blink every 500ms
    end
    
    -- Stop notification after duration
    tmr.create():alarm(NOTIFICATION_DURATION, tmr.ALARM_SINGLE, function()
        stopNotification()
    end)
end

local blinkTimer = nil

function blinkLEDs(interval)
    -- Stop any existing blink timer
    if blinkTimer ~= nil then
        blinkTimer:unregister()
    end
    
    local ledState = gpio.HIGH
    blinkTimer = tmr.create()
    blinkTimer:alarm(interval, tmr.ALARM_AUTO, function()
        if not isNotifying then
            blinkTimer:unregister()
            return
        end
        ledState = 1 - ledState  -- Toggle
        gpio.write(LED_PIN_1, ledState)
        gpio.write(LED_PIN_2, ledState)
        gpio.write(LED_PIN_3, ledState)
        gpio.write(LED_PIN_4, ledState)
    end)
end

function stopNotification()
    isNotifying = false
    print("Stopping notification...")
    
    -- Stop blink timer
    if blinkTimer ~= nil then
        blinkTimer:unregister()
        blinkTimer = nil
    end
    
    -- Turn off buzzer
    pwm.setduty(BUZZER_PIN, 0)
    
    -- Turn off all LEDs
    gpio.write(LED_PIN_1, gpio.LOW)
    gpio.write(LED_PIN_2, gpio.LOW)
    gpio.write(LED_PIN_3, gpio.LOW)
    gpio.write(LED_PIN_4, gpio.LOW)
end

-- ============================================
-- NTP TIME SYNC (Optional but Recommended)
-- ============================================
function syncTime()
    print("Syncing time with NTP server...")
    sntp.sync("pool.ntp.org",
        function(sec, usec, server, info)
            print("Time synchronized! Epoch: " .. sec)
            rtctime.set(sec, 0)
            -- Start fetching schedules after time sync
            fetchSchedules()
        end,
        function()
            print("Time sync failed, retrying...")
            tmr.create():alarm(5000, tmr.ALARM_SINGLE, syncTime)
        end
    )
end

-- ============================================
-- MAIN LOOP
-- ============================================
function main()
    print("=== Medicine Schedule Notifier Starting ===")
    
    -- Initialize hardware
    initHardware()
    
    -- Connect to WiFi
    connectWifi()
    
    -- Sync time with NTP (required for accurate scheduling)
    -- Wait a bit for WiFi to be ready, then sync
    tmr.create():alarm(3000, tmr.ALARM_SINGLE, function()
        if wifiConnected then
            syncTime()
        else
            -- Retry sync after WiFi connects
            tmr.create():alarm(2000, tmr.ALARM_SINGLE, syncTime)
        end
    end)
    
    -- Set up periodic schedule fetching
    tmr.create():alarm(POLL_INTERVAL, tmr.ALARM_AUTO, function()
        if wifiConnected then
            fetchSchedules()
        end
    end)
    
    -- Set up periodic schedule checking (more frequent)
    tmr.create():alarm(10000, tmr.ALARM_AUTO, function()  -- Check every 10 seconds
        if wifiConnected and #schedules > 0 then
            processSchedules()
        end
    end)
    
    print("System initialized. Monitoring schedules...")
end

-- ============================================
-- START THE SYSTEM
-- ============================================
main()

