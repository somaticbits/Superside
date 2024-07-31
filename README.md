# SuperSide Chat Application

This is a chat application built with React and TypeScript, and served with Nginx in a Docker container.

## Prerequisites

- Node.js / npm
- Docker Desktop
- An OpenAI API key

## Structure
The repository is structured as follows:
- `GraphDB` folder which contains the necessary tools to create a dataset from the given PDF file.
- `App` folder which contains the backend and frontend of the application.

## GraphDB
### Requirements
- Python 3.12

### Installation
1. Install the required packages:
```bash
pip install -r requirements.txt
```
2. Run the script:
```bash
python main.py
```

This will create a TTL file in the `GraphDB` folder. 

This TTL file that can be then imported into GraphDB.
To do a quick test, the `Docker` folder contains a `docker-compose.yml` file that can be used to run a GraphDB instance.
You'll need to add an OpenAI API key to the `docker-compose.yml` file if you want to use the ChatGPT API for GraphDB.


## App

### Usage
To run the application, follow these steps:
1. Clone the repository:  
   `git clone somaticbits/Superside`
2. Navigate to the `App` folder:  
   `cd App`
3. Add your OpenAI API key to the `docker-compose.yml` file.
4. Run the application with Docker:  
   `docker-compose up -d`
5. Import the dataset into the GraphDB instance:
    - Open the GraphDB Workbench: `http://localhost:7200`
    - Create a new repository named `superside` and import the TTL file created in the previous step.
6. Open the application in your browser:  
   `http://localhost:5173`

### Development
1. For further development, navigate to the `App/frontend` folder:  
   `cd App/frontend`
2. Install the dependencies:  
   `npm install`
3. Do the same for the `App/backend` folder:  
   `cd ../backend`  
   `npm install`
4. Start the frontend and backend servers (in each folder):  
   `npm run dev`