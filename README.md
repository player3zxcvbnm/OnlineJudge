# Online Judge

A full-stack competitive programming platform built with the MERN stack. Users solve coding problems and submit solutions that are automatically evaluated against hidden test cases inside isolated Docker containers.

---

## Overview

Online Judge is a platform for competitive coding. It takes code submissions from users, runs them securely in sandboxed environments, and returns a verdict — Accepted, Wrong Answer, Time Limit Exceeded, and so on.

Built using: **MongoDB, Express.js, React.js, Node.js**

---

## Features

### 1. User Registration & Authentication
- Users sign up with name, email, and password
- Login handled using JWT-based authentication
- Only verified users can submit solutions or access protected routes

### 2. Solution Submission & Evaluation
- Users write and submit code directly through the platform
- Code is queued for processing after submission
- Executed inside an isolated Docker container against hidden test cases
- Output is compared to expected results and a verdict is generated (AC, WA, TLE, etc.)
- Result is displayed back to the user on screen

### 3. Profile Management
- Each user has a personal profile with their account details
- Displays submission history and solved problems
- Allows participants to track progress and review past performances

### 4. Competition Leaderboard
- Displays rankings based on scores and accepted submissions
- Viewable at any point during or after a contest

### 5. Practice Problems
- Bank of problems available outside active competitions
- Problems categorized by difficulty — Easy, Medium, Hard
- Do not affect rankings or scores

---

## Architecture

```
User writes code on Frontend (React)
        ↓
Submits → Express Backend API
        ↓
Code saved + metadata stored in MongoDB
        ↓
Job pushed to Submission Queue (BullMQ)
        ↓
Worker picks up job from Queue
        ↓
Docker Container spins up (isolated sandbox)
        ↓
Code runs against hidden Test Cases
        ↓
Output compared → Verdict generated
        ↓
Verdict saved to MongoDB
        ↓
Frontend displays result to User
```

---

## Challenges & Solutions

**Challenge 1: Thundering Herd**
When thousands of users submit code at the same time, running all of them at once would crash the server.
> Solution: A message queue (BullMQ) lines up all submissions and processes them in the background asynchronously. The user gets a "pending" status while their job waits in the queue.

**Challenge 2: Malicious Code Execution**
A user could submit code that runs infinite loops, eats up memory, or tries to access system files.
> Solution: Every submission runs inside an isolated Docker container with CPU capped, memory capped, network disabled, and a hard timeout. Whatever happens inside the container cannot affect the main server.

**Challenge 3: Unauthorized Verdict Manipulation**
Someone could try to intercept requests and tamper with verdicts on the server.
> Solution: JWT authentication ensures every request comes from a verified user. The evaluation logic runs in an isolated backend worker, separate from the API layer, so verdicts are written directly to the database and never pass through the client.

---

## Database Design

**Collection 1: users**
| Field | Description |
|---|---|
| `userId` | Unique identifier for each user |
| `firstName` | First name |
| `lastName` | Last name |
| `email` | Unique email address |
| `password` | Bcrypt hashed password |

**Collection 2: problems**
| Field | Description |
|---|---|
| `problemId` | Unique identifier |
| `title` | Name of the problem |
| `statement` | Full problem description |
| `difficulty` | Easy / Medium / Hard |
| `timeLimit` | Max allowed execution time (ms) |
| `memoryLimit` | Max allowed memory (MB) |

**Collection 3: submissions**
| Field | Description |
|---|---|
| `submissionId` | Unique identifier |
| `userId` | Links to the user who submitted |
| `problemId` | Links to the problem attempted |
| `code` | The submitted source code |
| `language` | cpp / python / java / javascript |
| `verdict` | AC / WA / TLE / MLE / RE / CE / PENDING |
| `executionTime` | Actual time taken (ms) |
| `memoryUsed` | Actual memory used (MB) |

**Collection 4: testcases**
| Field | Description |
|---|---|
| `testcaseId` | Unique identifier |
| `problemId` | Links to the problem |
| `input` | Input fed to the program |
| `expectedOutput` | Correct output to compare against |
| `isHidden` | true/false — hidden from participants |

---

## Web Server Design

### UI Screens

**Screen 1: Home**
- List of all problems with links to each
- Login / Signup option

**Screen 2: Problem Page**
- Problem name and statement
- Code editor and language selection
- Submit button
- Verdict display

**Screen 3: Leaderboard**
- List of last 10 submissions with verdicts

### API Routes

```
POST /api/auth/register       → register a new user
POST /api/auth/login          → login and get JWT token

GET  /api/problems            → fetch all problems
GET  /api/problems/:id        → fetch one problem by id

POST /api/submissions         → submit code for evaluation
GET  /api/submissions/:id     → fetch result of a submission

GET  /api/leaderboard         → fetch last 10 submissions
```

---

## Evaluation System

Each submitted code runs inside an isolated Docker container:

- A separate container is spun up per submission
- CPU and memory usage are capped
- Network is disabled inside the container
- A hard timeout stops infinite loops
- Container is destroyed after execution

This ensures malicious code cannot affect the main server.