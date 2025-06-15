//+------------------------------------------------------------------+
//|                                                       MT5_EA.mq5    |
//|                                                 AlteaGold Platform  |
//|                                          https://www.alteagold.com  |
//+------------------------------------------------------------------+
#property copyright "AlteaGold Platform"
#property link      "https://www.alteagold.com"
#property version   "1.00"
#property strict

// Input Parameters
input string   BackendURL = "http://localhost:4000/api/mt5";  // Backend API URL
input string   AuthToken = "";                                // Authentication Token
input int      SyncInterval = 5;                             // Sync interval in seconds
input bool     EnableLogging = true;                         // Enable detailed logging
input double   MinLotSize = 0.01;                           // Minimum lot size
input double   MaxLotSize = 100.0;                          // Maximum lot size
input int      MaxSlippage = 3;                             // Maximum allowed slippage in points

// Global Variables
datetime lastSyncTime = 0;
bool isConnected = false;
string lastError = "";
int chartLabel = 0;

//+------------------------------------------------------------------+
//| Expert initialization function                                      |
//+------------------------------------------------------------------+
int OnInit()
{
    // Initialize chart objects for status display
    CreateStatusLabel();
    
    // Perform initial connectivity check
    if(!CheckConnectivity())
    {
        Print("Failed to connect to backend server");
        UpdateStatusLabel("Connection Failed", clrRed);
        return INIT_FAILED;
    }
    
    // Set up timer for periodic synchronization
    EventSetTimer(SyncInterval);
    
    Print("EA initialized successfully");
    UpdateStatusLabel("Connected", clrGreen);
    return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                   |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // Clean up chart objects
    ObjectDelete(0, "StatusLabel");
    EventKillTimer();
    Print("EA deinitialized");
}

//+------------------------------------------------------------------+
//| Expert tick function                                               |
//+------------------------------------------------------------------+
void OnTick()
{
    // Check if it's time to sync (based on SyncInterval)
    if(TimeCurrent() - lastSyncTime >= SyncInterval)
    {
        SyncWithBackend();
        lastSyncTime = TimeCurrent();
    }
}

//+------------------------------------------------------------------+
//| Timer function                                                     |
//+------------------------------------------------------------------+
void OnTimer()
{
    SyncWithBackend();
}

//+------------------------------------------------------------------+
//| Check connectivity with backend server                             |
//+------------------------------------------------------------------+
bool CheckConnectivity()
{
    string headers = "Content-Type: application/json\r\n";
    if(StringLen(AuthToken) > 0)
        headers += "Authorization: Bearer " + AuthToken + "\r\n";
        
    char post[];
    char result[];
    string request = "{\"action\":\"ping\"}";
    StringToCharArray(request, post);
    
    int res = WebRequest(
        "POST",
        BackendURL + "/ping",
        headers,
        5000,
        post,
        result,
        headers
    );
    
    if(res == -1)
    {
        int error = GetLastError();
        lastError = "Connection error: " + IntegerToString(error);
        LogError(lastError);
        return false;
    }
    
    return true;
}

//+------------------------------------------------------------------+
//| Sync account data with backend                                     |
//+------------------------------------------------------------------+
void SyncWithBackend()
{
    // Prepare account data
    string accountData = PrepareAccountData();
    
    // Send data to backend
    string headers = "Content-Type: application/json\r\n";
    if(StringLen(AuthToken) > 0)
        headers += "Authorization: Bearer " + AuthToken + "\r\n";
        
    char post[];
    char result[];
    StringToCharArray(accountData, post);
    
    int res = WebRequest(
        "POST",
        BackendURL + "/sync",
        headers,
        5000,
        post,
        result,
        headers
    );
    
    if(res == -1)
    {
        int error = GetLastError();
        lastError = "Sync error: " + IntegerToString(error);
        LogError(lastError);
        UpdateStatusLabel("Sync Failed", clrRed);
        return;
    }
    
    // Process response and update status
    string response = CharArrayToString(result);
    if(EnableLogging) Print("Sync response: ", response);
    UpdateStatusLabel("Synced", clrGreen);
}

//+------------------------------------------------------------------+
//| Prepare account data for sync                                      |
//+------------------------------------------------------------------+
string PrepareAccountData()
{
    string data = "{";
    data += "\"account_number\":\"" + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) + "\",";
    data += "\"balance\":" + DoubleToString(AccountInfoDouble(ACCOUNT_BALANCE), 2) + ",";
    data += "\"equity\":" + DoubleToString(AccountInfoDouble(ACCOUNT_EQUITY), 2) + ",";
    data += "\"margin\":" + DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN), 2) + ",";
    data += "\"free_margin\":" + DoubleToString(AccountInfoDouble(ACCOUNT_MARGIN_FREE), 2) + ",";
    data += "\"positions\":" + GetOpenPositions() + ",";
    data += "\"orders\":" + GetPendingOrders();
    data += "}";
    
    return data;
}

//+------------------------------------------------------------------+
//| Get open positions data                                            |
//+------------------------------------------------------------------+
string GetOpenPositions()
{
    string positions = "[";
    int total = PositionsTotal();
    
    for(int i = 0; i < total; i++)
    {
        if(i > 0) positions += ",";
        
        ulong ticket = PositionGetTicket(i);
        if(PositionSelectByTicket(ticket))
        {
            positions += "{";
            positions += "\"ticket\":" + IntegerToString(ticket) + ",";
            positions += "\"symbol\":\"" + PositionGetString(POSITION_SYMBOL) + "\",";
            positions += "\"type\":\"" + PositionGetInteger(POSITION_TYPE) + "\",";
            positions += "\"volume\":" + DoubleToString(PositionGetDouble(POSITION_VOLUME), 2) + ",";
            positions += "\"price\":" + DoubleToString(PositionGetDouble(POSITION_PRICE_OPEN), 5) + ",";
            positions += "\"sl\":" + DoubleToString(PositionGetDouble(POSITION_SL), 5) + ",";
            positions += "\"tp\":" + DoubleToString(PositionGetDouble(POSITION_TP), 5) + ",";
            positions += "\"profit\":" + DoubleToString(PositionGetDouble(POSITION_PROFIT), 2);
            positions += "}";
        }
    }
    
    positions += "]";
    return positions;
}

//+------------------------------------------------------------------+
//| Get pending orders data                                            |
//+------------------------------------------------------------------+
string GetPendingOrders()
{
    string orders = "[";
    int total = OrdersTotal();
    
    for(int i = 0; i < total; i++)
    {
        if(i > 0) orders += ",";
        
        ulong ticket = OrderGetTicket(i);
        if(OrderSelect(ticket))
        {
            orders += "{";
            orders += "\"ticket\":" + IntegerToString(ticket) + ",";
            orders += "\"symbol\":\"" + OrderGetString(ORDER_SYMBOL) + "\",";
            orders += "\"type\":\"" + OrderGetInteger(ORDER_TYPE) + "\",";
            orders += "\"volume\":" + DoubleToString(OrderGetDouble(ORDER_VOLUME_CURRENT), 2) + ",";
            orders += "\"price\":" + DoubleToString(OrderGetDouble(ORDER_PRICE_OPEN), 5);
            orders += "}";
        }
    }
    
    orders += "]";
    return orders;
}

//+------------------------------------------------------------------+
//| Create status label on chart                                       |
//+------------------------------------------------------------------+
void CreateStatusLabel()
{
    ObjectCreate(0, "StatusLabel", OBJ_LABEL, 0, 0, 0);
    ObjectSetInteger(0, "StatusLabel", OBJPROP_CORNER, CORNER_RIGHT_UPPER);
    ObjectSetInteger(0, "StatusLabel", OBJPROP_XDISTANCE, 10);
    ObjectSetInteger(0, "StatusLabel", OBJPROP_YDISTANCE, 10);
    ObjectSetString(0, "StatusLabel", OBJPROP_TEXT, "Initializing...");
    ObjectSetString(0, "StatusLabel", OBJPROP_FONT, "Arial");
    ObjectSetInteger(0, "StatusLabel", OBJPROP_FONTSIZE, 10);
    ObjectSetInteger(0, "StatusLabel", OBJPROP_COLOR, clrYellow);
}

//+------------------------------------------------------------------+
//| Update status label on chart                                       |
//+------------------------------------------------------------------+
void UpdateStatusLabel(string text, color clr)
{
    ObjectSetString(0, "StatusLabel", OBJPROP_TEXT, "AlteaGold: " + text);
    ObjectSetInteger(0, "StatusLabel", OBJPROP_COLOR, clr);
}

//+------------------------------------------------------------------+
//| Log error message                                                  |
//+------------------------------------------------------------------+
void LogError(string message)
{
    if(EnableLogging)
    {
        Print("ERROR: ", message);
        UpdateStatusLabel("Error", clrRed);
    }
}
