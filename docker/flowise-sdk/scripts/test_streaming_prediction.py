import os
from flowise import Flowise, PredictionData

# Test streaming predictions using Flowise SDK

def test_streaming_prediction():
    api_key = os.getenv('FLOWISE_API_KEY')
    if not api_key:
        print("Error: FLOWISE_API_KEY environment variable is not set.")
        return

    client = Flowise(api_key=api_key)
    prediction_data = PredictionData(
        chatflowId="<chatflow-id>",
        question="Tell me a joke!",
        streaming=True
    )
    completion = client.create_prediction(prediction_data)
    for chunk in completion:
        print("Streaming Response:", chunk)

if __name__ == "__main__":
    test_streaming_prediction()
