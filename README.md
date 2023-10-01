# PSA_CodeSprint
## PSA Code Sprint 2023: Predictive Analytics and Operational Efficiency for Shipping Industry 🌊🚢

### Introduction
[Hack2Win](https://tinyurl.com/Hack2WinPSA2023) is an innovative, open-source platform designed to revolutionize the management and optimization of the shipping industry. It leverages advanced machine learning and operational research techniques to predict future shipping demands, manage berth availability, and minimize operational costs, ensuring streamlined operations and informed decision-making.

Our platform combines the power of XGBoost models and linear programming to provide accurate forecasts and optimize resource allocation, making it a preferred choice for shipping companies, port authorities, and logistics providers.

### Features
- **Predictive Analytics**: Forecast future shipping demand with 1, 5, 10-year models using data from 1995 to 2033.
- **Berth Management**: Efficiently allocate vessels to available berths and manage crane and handling equipment allocation.
- **Operational Cost Calculation**: Utilize linear programming to calculate and minimize operational costs based on provided data.
- **User-friendly Interface**: A seamless and intuitive interface for easy integration and usage.

### [Development](#development)
For local development or contributions, please refer to our [contributing section](#contributing).

### Pre-requisites
- Python
- Node.js
- Git

### [Running Hack2Win Locally](#running-hack2win-locally)
```sh
git clone https://github.com/bryannoels/PSA_CodeSprint.git && cd PSA_CodeSprint
pip install -r requirements.txt
npm install
python openAPI.py
python predict1y.py
```
```sh
cd client
npm start
```

```sh
cd server
node app.js
```

### Modules
Future Shipping Demand Prediction: Uses XGBoost to predict future shipping demand based on vessel arrival, GDP growth, and the number of containers.
Berth Availability Management: Manages available berths and allocates them to upcoming vessels efficiently, notifying the vessels and marking the selected berths as occupied.
Operational Cost Calculation: Employs linear programming to calculate and minimize operational costs based on input data.

### Contributors
Edmerson Low Soon Xiang and 
Bryan Noel Salindeho

