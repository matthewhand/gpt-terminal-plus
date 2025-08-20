# Use NVIDIA CUDA base image with cuDNN support for GPU-accelerated workloads
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

# Set environment variables for the container
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Install Python and other necessary system dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    python3-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy the Python script and requirements file into the container
COPY run_flux_pipeline.py /app/
COPY requirements.txt /app/

# Install required Python packages
RUN pip3 install -r requirements.txt

# Set the default command to run the Flask app when the container starts
CMD ["python3", "run_flux_pipeline.py"]
