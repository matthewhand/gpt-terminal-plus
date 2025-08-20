import os
from flowise import Flowise, PredictionData

# Create a prediction using Flowise SDK

def create_prediction():
    api_key = os.getenv('FLOWISE_API_KEY')
    if not api_key:
        print("Error: FLOWISE_API_KEY environment variable is not set.")
        return

    client = Flowise(api_key=api_key)
    prediction_data = PredictionData(
        chatflowId="<chatflow-id>",
        question="What is the capital of France?",
        streaming=False
    )
    completion = client.create_prediction(prediction_data)
    for response in completion:
        print("Response:", response)

if __name__ == "__main__":
    create_prediction()
