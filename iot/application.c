#include <application.h>
#include <twr_adc.h>
#include <twr_timer.h>
#include <twr_log.h>
#include <twr_uart.h>
#include <twr_led.h> // Include the LED driver

#define UART TWR_UART_UART2 // UART2 is used for communication

// Declaration of LED variable
twr_led_t led;

// Define a function to handle the timer events
void send_timer_event_handler(void *param)
{
    // Declare a variable to store ADC value
    uint16_t adc_value;
    // Read ADC value from channel TWR_ADC_CHANNEL_A0
    if (twr_adc_get_value(TWR_ADC_CHANNEL_A0, &adc_value))
    {
        // Prepare a message with ADC value
        char msg[32];
        snprintf(msg, sizeof(msg), "ADC Value: %u\r\n", adc_value);
        // Write the message to the UART channel
        twr_uart_write(UART, msg, strlen(msg));
        // Log debug message indicating successful transmission
        // twr_log_debug("Sent ADC value over UART.");
    }
    else
    {
        // Log error message if ADC reading failed
        twr_log_error("Failed to read ADC.");
    }
}

void application_init(void)
{
    // Initialize LOGGING
    twr_log_init(TWR_LOG_LEVEL_DEBUG, TWR_LOG_TIMESTAMP_ABS);

    // Initialize ADC
    twr_adc_init();

    // Initialize UART
    twr_uart_init(UART, TWR_UART_BAUDRATE_115200, TWR_UART_SETTING_8N1);

    // Initialize TIMER
    twr_timer_init();

    // Set the timer to call `send_timer_event_handler` every 2 seconds (2000000 microseconds)
    twr_timer_set_irq_handler(TIM3, send_timer_event_handler, NULL);
    // Start the timer
    twr_timer_start();

    // Initialize LED
    twr_led_init(&led, TWR_GPIO_LED, false, 0);
    // Make the LED blink infinitely
    twr_led_blink(&led, -1);

    twr_log_debug("Initialization complete.");
}

void application_task(void)
{
    // Declare a variable to store ADC value
    uint16_t adc_value;
    // Read ADC value from channel TWR_ADC_CHANNEL_A0
    if (twr_adc_get_value(TWR_ADC_CHANNEL_A0, &adc_value))
    {
        // Prepare a message with ADC value
        char msg[32];
        snprintf(msg, sizeof(msg), "ADC Value: %u\r\n", adc_value);
        // Write the message to the UART channel
        twr_uart_write(UART, msg, strlen(msg));
        // Log debug message indicating successful transmission
        // twr_log_debug("Sent ADC value over UART.");
    }
    else
    {
        // Log error message if ADC reading failed
        twr_log_error("Failed to read ADC.");
    }

    // Schedule the next call
    twr_scheduler_plan_current_relative(1000);
}