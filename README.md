# Pocket Book Rear
### Design and implement a backend service for Managing Task

### API Endpoints
1. POST Call for Sign up: https://task-manager-rear.onrender.com/register

    **Example:**

    >**API Call:** https://task-manager-rear.onrender.com/register

    **Body:** 
    ```
    {
        "name": "Rakesh Sharma",
        "email": "rakesh@gmail.com",
        "mobile": "9958374881",
        "role": "manager",
        "password": "#BigSaviour12"
    }
    ```

    **Response:**
    ```
    {
        "message": {
            "name": "Rakesh Sharma",
            "email": "rakesh@gmail.com",
            "mobile": "9958374881",
            "role": "manager",
            "password": "$2a$10$Wstw3vhSvPTZ31G9HkkVB.SZNDfHlGFsK0AUTj76PG.0bBpi4BK92",
            "tasks": [],
            "_id": "63cfc7398d89e9c408a5faa6",
            "createdAt": "2023-01-24T11:55:37.274Z",
            "updatedAt": "2023-01-24T11:55:37.274Z",
            "__v": 0
        }
    }
    ```

2. POST Call for Login: https://task-manager-rear.onrender.com/login

    **Example 1:**

    >**API Call:** https://task-manager-rear.onrender.com/login

    **Body:** 
    ```
    {
        "email": "rakesh@gmail.com",
        "password": "#BigSaviour12"
    }
    ```

    **Response:** 
    ``` 
    {
        "message": {
            "name": "Rakesh Sharma",
            "email": "rakesh@gmail.com",
            "mobile": "9958374881",
            "role": "manager",
            "tasks": [],
            "token": {
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJha2VzaEBnbWFpbC5jb20iLCJpYXQiOjE2NzQ1NjE0MjMsImV4cCI6MTY3NDczNDIyM30.1pBXP3-7LAeCk2yWE6oR97nil0b6rT_cx2exFM9Yfio",
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJha2VzaEBnbWFpbC5jb20iLCJpYXQiOjE2NzQ1NjE0MjN9.VTMPOknnmLApKGy9XJL-9o2QPQmAQ6_LO4ZBmrHXE00"
            }
    }
}
   
3. POST Call Create Team: https://task-manager-rear.onrender.com/create-team

    **Example:**

    >API Call: https://task-manager-rear.onrender.com/create-team

    **Body**
    ```
    {
        "team_id": "digital_creators",
        "name": "Digital Tech",
        "members": [
            {
            "name": "Yash Gupta",
            "email": "yashgupta1@gmail.com",
            "mobile": "9876543564",
            "role": "employee",
            "password": "#Yash1234"
            },
            {
            "name": "Aman Rai",
            "email": "amanrai@gmail.com",
            "mobile": "9676523340",
            "role": "employee",
            "password": "#Aman1234"
            }
        ]
    }
    ```

    **Response**
    ```
    {
        "message": {
            "team_id": "digital_creators",
            "name": "Digital Tech",
            "members": [
                "63cfc8ba8d89e9c408a5fab6",
                "63cfc8bb8d89e9c408a5fab7"
            ],
            "manager": "63cfc7398d89e9c408a5faa6",
            "_id": "63cfc8bb8d89e9c408a5faba",
            "createdAt": "2023-01-24T12:02:03.619Z",
            "updatedAt": "2023-01-24T12:02:03.619Z",
            "__v": 0
        }
    }
    ```

4. POST Call to add new member: https://task-manager-rear.onrender.com/member

    **Example:**

    >API Call: https://task-manager-rear.onrender.com/member

    **Body**
    ```
    {
        "name": "Prakhar Srivastav",
        "email": "prakhar123@gmail.com",
        "mobile": "5483464711",
        "role": "employee",
        "password": "#Prakhar100",
        "team": "63cfc8bb8d89e9c408a5faba"
    }
    ```

    **Response:**
    ```
    {
        "message": {
            "name": "Prakhar Srivastav",
            "email": "prakhar123@gmail.com",
            "mobile": "5483464711",
            "role": "employee",
            "password": "$2a$10$A.guPszcDblXv9Ft5j3PmO9VS0tPzWh5.NQzVH95nUmG8wXRybx7e",
            "team": "63cfc8bb8d89e9c408a5faba",
            "tasks": [],
            "_id": "63cfc9be8d89e9c408a5fac0",
            "createdAt": "2023-01-24T12:06:22.268Z",
            "updatedAt": "2023-01-24T12:06:22.268Z",
            "__v": 0
        }
    }
    ```

5. PUT Call to update employee details: https://task-manager-rear.onrender.com/member

    **Example:**

    >API Call: https://task-manager-rear.onrender.com/member

    **Body**
    ```
    {
        "name": "Prakhar Srivastav",
        "email": "prakhar123@gmail.com",
        "mobile": "5483464711",
        "role": "employee",
        "password": "#Prakhar100",
        "team": "63cfc8bb8d89e9c408a5faba"
    }
    ```

    **Response:**
    ```
    {
        "message": {
            "name": "Prakhar Srivastav",
            "email": "prakhar123@gmail.com",
            "mobile": "5483464711",
            "role": "employee",
            "password": "$2a$10$A.guPszcDblXv9Ft5j3PmO9VS0tPzWh5.NQzVH95nUmG8wXRybx7e",
            "team": "63cfc8bb8d89e9c408a5faba",
            "tasks": [],
            "_id": "63cfc9be8d89e9c408a5fac0",
            "createdAt": "2023-01-24T12:06:22.268Z",
            "updatedAt": "2023-01-24T12:06:22.268Z",
            "__v": 0
        }
    }
    ```

### Setup Instructions

> **Node version: v16.16.0**
1. Clone the repository task_manager_rear
2. nvm install v16.16.0
3. nvm use v16.16.0
4. Install all dependency: **npm install**
5. Create .env file and paste the shared enviornment vairables
6. Start server: **npm start**


