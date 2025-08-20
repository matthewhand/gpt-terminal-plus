import os
from flowise import Flowise, PredictionData

# Query chart data using the Flowise SDK

def query_chart_data():
    api_key = os.getenv('FLOWISE_API_KEY')
    if not api_key:
        print("Error: FLOWISE_API_KEY environment variable is not set.")
        return

    client = Flowise(api_key=api_key)
    query = "List the sales figures for the last quarter."
    prediction_data = PredictionData(
        chatflowId="<chatflow-id>",
        question=query,
        streaming=False
    )
    completion = client.create_prediction(prediction_data)
    for response in completion:
        print("Response:", response)

if __name__ == "__main__":
    query_chart_data()
