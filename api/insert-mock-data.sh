#!/bin/bash

echo "🕐 Inserting mock data into the API..."
echo "================================"

# Base URL
BASE_URL="http://localhost:3000"

# 1. Create a test user
echo "👤 Creating test user..."
USER_RESPONSE=$(curl -s -X POST $BASE_URL/user/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }')

echo "✅ User created: $USER_RESPONSE"

# Extract user ID (assuming the response contains an id field)
USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "🆔 User ID: $USER_ID"

if [ -z "$USER_ID" ]; then
  echo "❌ Failed to create user or extract user ID"
  exit 1
fi

# 2. Create test projects
echo ""
echo "📁 Creating test projects..."

# Project 1
echo "📁 Creating Project 1..."
PROJECT1_RESPONSE=$(curl -s -X POST $BASE_URL/projects \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"E-commerce Website\",
    \"description\": \"Building a modern e-commerce platform\",
    \"hourlyRate\": 75.00,
    \"currency\": \"USD\",
    \"status\": \"ACTIVE\",
    \"startDate\": \"2024-01-01T00:00:00.000Z\",
    \"userId\": \"$USER_ID\"
  }")

echo "✅ Project 1 created: $PROJECT1_RESPONSE"
PROJECT1_ID=$(echo $PROJECT1_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "🆔 Project 1 ID: $PROJECT1_ID"

# Project 2
echo "📁 Creating Project 2..."
PROJECT2_RESPONSE=$(curl -s -X POST $BASE_URL/projects \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Mobile App Development\",
    \"description\": \"React Native mobile application\",
    \"hourlyRate\": 85.00,
    \"currency\": \"USD\",
    \"status\": \"ACTIVE\",
    \"startDate\": \"2024-02-01T00:00:00.000Z\",
    \"userId\": \"$USER_ID\"
  }")

echo "✅ Project 2 created: $PROJECT2_RESPONSE"
PROJECT2_ID=$(echo $PROJECT2_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "🆔 Project 2 ID: $PROJECT2_ID"

# 3. Create test tasks
echo ""
echo "📋 Creating test tasks..."

if [ ! -z "$PROJECT1_ID" ]; then
  # Task 1 for Project 1
  echo "📋 Creating Task 1..."
  TASK1_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"Setup Database Schema\",
      \"description\": \"Design and implement the database schema for the e-commerce platform\",
      \"status\": \"IN_PROGRESS\",
      \"priority\": \"HIGH\",
      \"estimatedHours\": 8,
      \"actualHours\": 5,
      \"projectId\": \"$PROJECT1_ID\",
      \"userId\": \"$USER_ID\"
    }")
  
  echo "✅ Task 1 created: $TASK1_RESPONSE"
  TASK1_ID=$(echo $TASK1_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  
  # Task 2 for Project 1
  echo "📋 Creating Task 2..."
  TASK2_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"Frontend Development\",
      \"description\": \"Develop the user interface components\",
      \"status\": \"TODO\",
      \"priority\": \"MEDIUM\",
      \"estimatedHours\": 16,
      \"actualHours\": 0,
      \"projectId\": \"$PROJECT1_ID\",
      \"userId\": \"$USER_ID\"
    }")
  
  echo "✅ Task 2 created: $TASK2_RESPONSE"
fi

if [ ! -z "$PROJECT2_ID" ]; then
  # Task 3 for Project 2
  echo "📋 Creating Task 3..."
  TASK3_RESPONSE=$(curl -s -X POST $BASE_URL/tasks \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"Mobile UI Design\",
      \"description\": \"Create responsive mobile interface\",
      \"status\": \"COMPLETED\",
      \"priority\": \"HIGH\",
      \"estimatedHours\": 12,
      \"actualHours\": 10,
      \"projectId\": \"$PROJECT2_ID\",
      \"userId\": \"$USER_ID\"
    }")
  
  echo "✅ Task 3 created: $TASK3_RESPONSE"
fi

# 4. Create work logs
echo ""
echo "📝 Creating work logs..."

if [ ! -z "$TASK1_ID" ] && [ ! -z "$PROJECT1_ID" ]; then
  echo "📝 Creating work log 1..."
  curl -s -X POST $BASE_URL/work-logs \
    -H "Content-Type: application/json" \
    -d "{
      \"date\": \"2024-01-15\",
      \"startTime\": \"09:00\",
      \"endTime\": \"12:00\",
      \"hoursWorked\": 3,
      \"description\": \"Worked on database schema design\",
      \"taskId\": \"$TASK1_ID\",
      \"projectId\": \"$PROJECT1_ID\",
      \"userId\": \"$USER_ID\"
    }"
  
  echo "📝 Creating work log 2..."
  curl -s -X POST $BASE_URL/work-logs \
    -H "Content-Type: application/json" \
    -d "{
      \"date\": \"2024-01-16\",
      \"startTime\": \"14:00\",
      \"endTime\": \"16:00\",
      \"hoursWorked\": 2,
      \"description\": \"Implemented user authentication tables\",
      \"taskId\": \"$TASK1_ID\",
      \"projectId\": \"$PROJECT1_ID\",
      \"userId\": \"$USER_ID\"
    }"
fi

echo ""
echo "🎉 Mock data insertion completed!"
echo "================================"
echo "📊 Test the API endpoints:"
echo "curl \"$BASE_URL/projects?userId=$USER_ID\""
echo "curl \"$BASE_URL/tasks?userId=$USER_ID\""
echo "curl \"$BASE_URL/work-logs?userId=$USER_ID\""
echo "================================"