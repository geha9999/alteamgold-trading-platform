# AlteaGold MT5 Expert Advisor

## Overview

This Expert Advisor (EA) is designed to synchronize MetaTrader 5 trading accounts with the AlteaGold trading platform. It provides real-time account monitoring, trade synchronization, and seamless integration with the AlteaGold backend services.

### Key Features

- Real-time account status monitoring
- Automatic trade synchronization
- Secure API communication
- Visual status indicators on chart
- Detailed error logging
- Configurable sync intervals

## Installation

### Prerequisites

- MetaTrader 5 platform
- AlteaGold platform account
- Backend API access credentials

### Steps

1. **Compile the EA:**
   - Open MetaEditor in MT5 (Press F4)
   - File -> Open -> Navigate to `MT5_EA.mq5`
   - Press F7 to compile
   - Ensure no compilation errors

2. **Install the EA:**
   - Copy the compiled `MT5_EA.ex5` file to:
     ```
     C:\Users\<YourUsername>\AppData\Roaming\MetaQuotes\Terminal\<YourTerminalID>\MQL5\Experts\
     ```
   - Restart MetaTrader 5

3. **Attach to Chart:**
   - Open any chart in MT5
   - Drag the EA from the Navigator window onto the chart
   - Configure the input parameters in the dialog

## Configuration

### Input Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| BackendURL | AlteaGold API endpoint URL | https://d391-144-202-3-107.ngrok-free.app/api/mt5 |
| AuthToken | Your authentication token | "" |
| SyncInterval | Data sync interval (seconds) | 5 |
| EnableLogging | Enable detailed logging | true |
| MinLotSize | Minimum trading lot size | 0.01 |
| MaxLotSize | Maximum trading lot size | 100.0 |
| MaxSlippage | Maximum allowed slippage | 3 |

### Backend API Configuration

1. Get your API credentials from AlteaGold dashboard
2. Set the correct BackendURL
3. Input your AuthToken

## Usage

### Status Indicators

The EA displays a status label in the top-right corner of the chart:

- 🟢 Green: Connected and syncing
- 🟡 Yellow: Initializing/Processing
- 🔴 Red: Error/Disconnected

### Data Synchronization

The EA automatically syncs:
- Account balance and equity
- Open positions
- Pending orders
- Trading history

### Error Handling

1. Check the "Experts" tab in MT5 terminal for detailed logs
2. Verify your internet connection
3. Confirm API credentials are correct
4. Check the status indicator on the chart

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Verify BackendURL is correct
   - Check internet connection
   - Confirm firewall settings

2. **Authentication Error**
   - Verify AuthToken
   - Check token expiration
   - Regenerate token if needed

3. **Sync Issues**
   - Check SyncInterval setting
   - Verify API endpoint status
   - Review error logs

### Debug Mode

Enable detailed logging:
1. Set EnableLogging = true
2. Check the "Experts" tab
3. Review connection and sync messages

## Security

- API communication uses secure HTTPS
- Credentials are never stored in the EA
- Regular authentication token rotation recommended
- Limited to specified lot sizes and slippage

## Support

For technical support:
1. Check the [AlteaGold Documentation](https://docs.alteagold.com)
2. Contact support@alteagold.com
3. Visit our [Support Portal](https://support.alteagold.com)

## Updates

Check for EA updates regularly:
1. Visit the AlteaGold dashboard
2. Compare version numbers
3. Download and install latest version

## Best Practices

1. Always test on a demo account first
2. Start with small sync intervals
3. Monitor the logs regularly
4. Keep your AuthToken secure
5. Update the EA when new versions are available

## License

Proprietary software. All rights reserved.
Copyright © 2024 AlteaGold Platform




**DO NOT ERASE THIS NOTE BELOW**
/*
Next steps to proceed with testing and development:

Download and Compile the MT5 EA:

Download MT5_EA.mq5 from your GitHub repository.
Open MetaEditor in MetaTrader 5.
Compile the EA and fix any compilation issues if they arise.
Configure the EA:

Set the BackendURL input parameter to the ngrok URL:
https://d391-144-202-3-107.ngrok-free.app/api/mt5
Provide your authentication token if required.
Attach the EA to a Chart:

Open any chart in MetaTrader 5.
Attach the compiled EA.
Observe the status label for connection and synchronization status.
Test the Synchronization:

Verify that the EA is sending data to your backend.
Check backend logs and frontend UI for updates.
Iterate and Modify:

Adjust trading strategy logic as needed.
Monitor logs for errors and fix issues.
Deployment:

When ready, deploy your backend to a permanent domain.
Update the EA BackendURL accordingly.
*/