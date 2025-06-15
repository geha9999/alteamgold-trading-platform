# Product Requirements Document (PRD)
## AlteaGold Trading Platform

### 1. Overview
AlteaGold is a web-based trading platform that enables users to connect their MT5 (MetaTrader 5) accounts and manage their trading activities with enhanced security and subscription-based features.

### 2. User Registration & Authentication
#### 2.1 Email Verification
- Users register using their email address
- OTP (One-Time Password) sent via email for verification
- OTP expires after 10 minutes
- Users must verify email before proceeding with registration

#### 2.2 MT5 Account Integration
- Users can connect their MT5 trading accounts
- Required MT5 details:
  - Broker Name
  - Server Name
  - Account ID
  - Account Passcode
  - Asset Type (GOLD/BITCOIN)
  - Minimum Deposit Amount
  - Demo/Live Account Option

#### 2.3 Identity Verification
- Users must upload valid ID card
- Supported formats: images and PDF
- Mobile number verification required

### 3. Subscription Management
#### 3.1 Subscription Tiers
- Trial (7 days)
  - Basic features
  - No VPS access
  - Limited trading capabilities

- Regular (30 days)
  - Full trading features
  - VPS access included
  - Standard support

- Premium (90 days)
  - All features included
  - Priority VPS access
  - Premium support
  - Advanced trading tools

#### 3.2 Subscription Features
- Automated renewal options
- Upgrade/downgrade capabilities
- Payment processing integration
- Subscription status monitoring

### 4. MT5 Integration
#### 4.1 Account Validation
- Real-time MT5 account verification
- Secure credential storage
- Connection status monitoring
- Auto-reconnect capabilities

#### 4.2 Trading Features
- Account balance monitoring
- Trade execution status
- Position tracking
- Trading history
- Performance analytics

### 5. Security Features
#### 5.1 Authentication
- Email OTP verification
- Secure password requirements
- Session management
- Activity logging

#### 5.2 Data Protection
- Encrypted data storage
- Secure API communications
- Regular security audits
- Compliance with data protection regulations

### 6. Technical Architecture
#### 6.1 Frontend
- React with Vite
- Tailwind CSS for styling
- Responsive design
- Modern UI components
- Real-time updates

#### 6.2 Backend
- Node.js/Express server
- RESTful API architecture
- Email service integration
- MT5 API integration
- Database integration

#### 6.3 Infrastructure
- Scalable cloud hosting
- Load balancing
- Automated backups
- Monitoring and alerts

### 7. Future Enhancements
#### Phase 2
- Mobile app development
- Additional payment methods
- Enhanced analytics
- Social trading features
- Multiple MT5 account management

#### Phase 3
- AI-powered trading insights
- Advanced risk management
- Custom trading strategies
- Community features
- Educational resources

### 8. Compliance & Legal
- Terms of service
- Privacy policy
- Risk disclosure
- Regulatory compliance
- User data protection

### 9. Support & Maintenance
- 24/7 technical support
- Regular updates
- Performance monitoring
- User feedback system
- Documentation

### 10. Success Metrics
- User registration rate
- Subscription conversion rate
- User retention
- Trading volume
- System uptime
- Customer satisfaction

### 11. Timeline
#### Phase 1 (Current)
- Basic registration and authentication
- MT5 account integration
- Subscription management
- Essential trading features

#### Phase 2 (Future)
- Enhanced features
- Mobile applications
- Advanced trading tools
- Community features

#### Phase 3 (Future)
- AI integration
- Advanced analytics
- Social trading
- Educational platform

This PRD will be regularly updated as the project evolves and new requirements are identified.
