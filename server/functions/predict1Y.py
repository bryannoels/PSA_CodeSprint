import pandas as pd
import xgboost as xgb
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.seasonal import STL
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

data = pd.read_csv('../data/vesselsAll.csv')

data['month'] = pd.to_datetime(data['month'])
data.set_index('month', inplace=True)

num_months_to_predict = 120  # Predict for the next 10 years (120 months)

X = data[['gross_tonnage']]
y = data['number_of_vessels']

# Train an XGBoost model for number_of_vessels
model_number_of_vessels = xgb.XGBRegressor(objective="reg:squarederror")
model_number_of_vessels.fit(X, y)

# Train an XGBoost model for gross_tonnage
model_gross_tonnage = xgb.XGBRegressor(objective="reg:squarederror")
model_gross_tonnage.fit(X, data['gross_tonnage'])

last_month = data.index[-1]
future_months = pd.date_range(start=last_month, periods=num_months_to_predict, freq='M')

stl = STL(y, seasonal=13)
result = stl.fit()

# Make predictions for future months
future_X = pd.DataFrame({'gross_tonnage': [X.iloc[-1]['gross_tonnage']] * num_months_to_predict}, index=future_months)
future_residuals = result.resid[-1 * num_months_to_predict:]  # Use the last year of residuals

# Predict number_of_vessels for future months
future_predictions_number_of_vessels = model_number_of_vessels.predict(future_X) + future_residuals

# Predict gross_tonnage for future months
future_predictions_gross_tonnage = model_gross_tonnage.predict(future_X)

# Create a DataFrame for future predictions
future_predictions_df = pd.DataFrame({
    'Month': future_months,
    'number_of_vessels': future_predictions_number_of_vessels,
    'gross_tonnage': future_predictions_gross_tonnage
})

# Combine future predictions with the original data
combined_data = pd.concat([data, future_predictions_df])

# Save the combined data to a CSV file with the required format
predicted_csv_path = '../data/predictedVessels.csv'
combined_data.to_csv(predicted_csv_path, columns=['number_of_vessels', 'gross_tonnage'], header=True, index=True)

# Plot all available data and predictions for number_of_vessels
plt.figure(figsize=(12, 6))
plt.plot(combined_data.index, combined_data['number_of_vessels'], label='Actual', marker='o')
plt.plot(future_predictions_df['Month'], future_predictions_df['number_of_vessels'], label='Predicted', marker='o')
plt.xlabel('Month')
plt.ylabel('Number of Vessels')
plt.legend()
plt.title('Actual vs. Predicted Number of Vessels')
plt.grid(True)
plt.show()

# Plot all available data and predictions for gross_tonnage
plt.figure(figsize=(12, 6))
plt.plot(combined_data.index, combined_data['gross_tonnage'], label='Actual', marker='o')
plt.plot(future_predictions_df['Month'], future_predictions_df['gross_tonnage'], label='Predicted', marker='o')
plt.xlabel('Month')
plt.ylabel('Gross Tonnage')
plt.legend()
plt.title('Actual vs. Predicted Gross Tonnage')
plt.grid(True)
plt.show()

# Calculate in-sample predictions and evaluation metrics for number_of_vessels
in_sample_predictions_number_of_vessels = model_number_of_vessels.predict(X)
mae_number_of_vessels = mean_absolute_error(y, in_sample_predictions_number_of_vessels)
mse_number_of_vessels = mean_squared_error(y, in_sample_predictions_number_of_vessels)
rmse_number_of_vessels = np.sqrt(mse_number_of_vessels)
r2_number_of_vessels = r2_score(y, in_sample_predictions_number_of_vessels)

print("In-Sample Metrics for Number of Vessels:")
print("Mean Absolute Error (MAE):", mae_number_of_vessels)
print("Mean Squared Error (MSE):", mse_number_of_vessels)
print("Root Mean Squared Error (RMSE):", rmse_number_of_vessels)
print("R-squared (R²):", r2_number_of_vessels)

# Calculate in-sample predictions and evaluation metrics for gross_tonnage
in_sample_predictions_gross_tonnage = model_gross_tonnage.predict(X)
mae_gross_tonnage = mean_absolute_error(data['gross_tonnage'], in_sample_predictions_gross_tonnage)
mse_gross_tonnage = mean_squared_error(data['gross_tonnage'], in_sample_predictions_gross_tonnage)
rmse_gross_tonnage = np.sqrt(mse_gross_tonnage)
r2_gross_tonnage = r2_score(data['gross_tonnage'], in_sample_predictions_gross_tonnage)

print("\nIn-Sample Metrics for Gross Tonnage:")
print("Mean Absolute Error (MAE):", mae_gross_tonnage)
print("Mean Squared Error (MSE):", mse_gross_tonnage)
print("Root Mean Squared Error (RMSE):", rmse_gross_tonnage)
print("R-squared (R²):", r2_gross_tonnage)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model_number_of_vessels.fit(X_train, y_train)
model_gross_tonnage.fit(X_train, data.loc[X_train.index, 'gross_tonnage'])
out_of_sample_predictions_number_of_vessels = model_number_of_vessels.predict(X_test)
out_of_sample_predictions_gross_tonnage = model_gross_tonnage.predict(X_test)

mae_test_number_of_vessels = mean_absolute_error(y_test, out_of_sample_predictions_number_of_vessels)
mse_test_number_of_vessels = mean_squared_error(y_test, out_of_sample_predictions_number_of_vessels)
rmse_test_number_of_vessels = np.sqrt(mse_test_number_of_vessels)
r2_test_number_of_vessels = r2_score(y_test, out_of_sample_predictions_number_of_vessels)

mae_test_gross_tonnage = mean_absolute_error(data.loc[X_test.index, 'gross_tonnage'], out_of_sample_predictions_gross_tonnage)
mse_test_gross_tonnage = mean_squared_error(data.loc[X_test.index, 'gross_tonnage'], out_of_sample_predictions_gross_tonnage)
rmse_test_gross_tonnage = np.sqrt(mse_test_gross_tonnage)
r2_test_gross_tonnage = r2_score(data.loc[X_test.index, 'gross_tonnage'], out_of_sample_predictions_gross_tonnage)

print("\nOut-of-Sample Metrics for Number of Vessels:")
print("Testing Set MAE:", mae_test_number_of_vessels)
print("Testing Set MSE:", mse_test_number_of_vessels)
print("Testing Set RMSE:", rmse_test_number_of_vessels)
print("Testing Set R-squared (R²):", r2_test_number_of_vessels)

print("\nOut-of-Sample Metrics for Gross Tonnage:")
print("Testing Set MAE:", mae_test_gross_tonnage)
print("Testing Set MSE:", mse_test_gross_tonnage)
print("Testing Set RMSE:", rmse_test_gross_tonnage)
print("Testing Set R-squared (R²):", r2_test_gross_tonnage)

# Print the predicted data in the required format
print("\nPredicted Data:")
print(future_predictions_df.to_string(index=False, header=False))
