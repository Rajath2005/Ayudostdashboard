# AyuDost Dashboard - Authentication & Chat Setup

## Overview
The AyuDost Dashboard now includes Supabase authentication and real-time team chat features.

## Authorized Team Members

Only the following 4 team members can sign up:

1. **Sanath K** (Team Leader) - sanathk@ayudost.com
2. **Rajath Kiran A** (Backend/Database) - rajathkirana@ayudost.com
3. **Rithesh** (AI/ML) - rithesh@ayudost.com
4. **Sheethal D Rai** (Frontend/UI) - sheethal@ayudost.com

## Features Implemented

### Authentication
- ✅ Secure signup with email validation (only @ayudost.com emails allowed)
- ✅ Email/password authentication via Supabase
- ✅ Automatic role assignment based on email
- ✅ Session management (persistent login)
- ✅ Secure logout functionality

### Team Chat
- ✅ Real-time messaging across 3 channels:
  - **#general** - General team discussions
  - **#development** - Development-related conversations
  - **#team** - Team updates and announcements
- ✅ Message history with timestamps
- ✅ User avatars and role badges
- ✅ Auto-refresh every 5 seconds for new messages
- ✅ Send messages with Enter key

## How to Use

### First Time Setup

1. **Sign Up**
   - Click the "Sign Up" tab on the login page
   - Enter your full name
   - Use your @ayudost.com email address
   - Create a password (minimum 6 characters)
   - Click "Create Account"

2. **Sign In**
   - Enter your email and password
   - Click "Sign In"
   - Your session will be remembered for future visits

### Using Team Chat

1. Navigate to **Team Chat** from the sidebar menu
2. Select a channel (#general, #development, or #team)
3. Type your message in the input field
4. Press Enter or click the Send button
5. Messages will update automatically every 5 seconds

## Technical Details

### Backend Endpoints

- `POST /signup` - Create new user account (restricted to allowed emails)
- `GET /profile` - Get current user profile
- `POST /chat/message` - Send a chat message
- `GET /chat/messages/:channel` - Retrieve messages for a channel
- `DELETE /chat/message/:messageId` - Delete a message

### Data Storage

- **User Profiles**: Stored in KV store as `user:{userId}`
- **Chat Messages**: Stored in KV store as `chat:{channel}:{messageId}`
- **Authentication**: Managed by Supabase Auth

### Security

- All endpoints require authentication via access token
- Email domain validation on signup
- Row-level security via Supabase
- Automatic email confirmation (no email server required)

## Troubleshooting

**Can't sign up?**
- Make sure you're using an @ayudost.com email
- Check that your email is in the authorized list
- Password must be at least 6 characters

**Can't see messages?**
- Make sure you're signed in
- Check your network connection
- Messages refresh every 5 seconds automatically

**Session expired?**
- Simply sign in again with your credentials
- Your account and data are preserved

## Future Enhancements

Potential improvements:
- WebSocket support for instant message updates
- File sharing in chat
- Message reactions and threading
- Direct messages between team members
- Notification badges for unread messages
- Message search functionality
