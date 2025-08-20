import os
import torch
import safetensors.torch
import gc
from flask import Flask, request, jsonify
from huggingface_hub import hf_hub_download
from accelerate.utils import set_module_tensor_to_device
from accelerate import init_empty_weights
from diffusers import FluxTransformer2DModel, FluxPipeline
from diffusers.loaders.single_file_utils import convert_flux_transformer_checkpoint_to_diffusers

# Initialize Flask application
app = Flask(__name__)

# Load configuration from environment variables
MODEL_REPO = os.getenv('MODEL_REPO', 'lllyasviel/flux1-dev-bnb-nf4')
MODEL_FILE = os.getenv('MODEL_FILE', 'flux1-dev-bnb-nf4-v2.safetensors')
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
DTYPE = torch.bfloat16 if torch.cuda.is_available() else torch.float32

# Global variables for model and pipeline
model = None
pipe = None

def load_model():
    """
    Loads and initializes the Flux model and pipeline.
    The model is loaded from the Hugging Face hub and converted for use with the pipeline.
    """
    global model, pipe

    # Step 1: Download model checkpoint
    print(f"Downloading model checkpoint from {MODEL_REPO}...")
    ckpt_path = hf_hub_download(repo_id=MODEL_REPO, filename=MODEL_FILE)

    # Step 2: Load checkpoint with safetensors
    print(f"Loading checkpoint from {ckpt_path}...")
    try:
        original_state_dict = safetensors.torch.load_file(ckpt_path)
    except Exception as e:
        raise RuntimeError(f"Failed to load checkpoint: {e}")

    # Step 3: Convert the checkpoint to diffusers format
    print("Converting checkpoint to diffusers format...")
    try:
        converted_state_dict = convert_flux_transformer_checkpoint_to_diffusers(original_state_dict)
    except Exception as e:
        raise RuntimeError(f"Failed to convert checkpoint: {e}")

    # Clean up to free memory
    del original_state_dict
    gc.collect()

    # Step 4: Initialize model with empty weights
    print("Initializing model...")
    try:
        with init_empty_weights():
            config = FluxTransformer2DModel.load_config(repo_id=MODEL_REPO)
            model = FluxTransformer2DModel.from_config(config).to(dtype=DTYPE)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize model: {e}")

    # Step 5: Load model parameters into the model
    print("Loading model parameters...")
    try:
        for param_name, param in converted_state_dict.items():
            if torch.is_floating_point(param):
                param = param.to(DTYPE)
            set_module_tensor_to_device(model, param_name, device=DEVICE, value=param)
    except Exception as e:
        raise RuntimeError(f"Failed to load model parameters: {e}")

    # Clean up to free memory
    del converted_state_dict
    gc.collect()

    # Step 6: Initialize the pipeline
    print("Initializing pipeline...")
    try:
        pipe = FluxPipeline.from_pretrained(repo_id=MODEL_REPO, transformer=model, torch_dtype=DTYPE)
        pipe.enable_model_cpu_offload()
    except Exception as e:
        raise RuntimeError(f"Failed to initialize pipeline: {e}")

    print("Model and pipeline loaded successfully.")

# Load the model when the Flask app starts
load_model()

@app.route('/generate', methods=['POST'])
def generate_image():
    """
    Endpoint to generate an image based on a prompt.
    Expects JSON input with keys:
    - prompt: The text prompt for the image generation (mandatory).
    - guidance_scale: Controls the influence of the prompt (optional, default: 3.5).
    - num_inference_steps: The number of inference steps (optional, default: 50).
    
    Returns:
    - JSON response with the path to the generated image.
    """
    data = request.json

    # Ensure the 'prompt' is provided
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "The 'prompt' field is required."}), 400

    guidance_scale = data.get("guidance_scale", 3.5)
    num_inference_steps = data.get("num_inference_steps", 50)

    # Generate the image
    try:
        generator = torch.manual_seed(0)
        image = pipe(prompt, guidance_scale=guidance_scale, num_inference_steps=num_inference_steps, generator=generator).images[0]

        # Save and return the image path
        image_path = os.path.join('/app/output', 'generated_image.png')
        image.save(image_path)
        return jsonify({"image_path": image_path})
    except Exception as e:
        return jsonify({"error": f"Failed to generate image: {e}"}), 500

if __name__ == '__main__':
    # Run the Flask application
    app.run(host='0.0.0.0', port=5005)
