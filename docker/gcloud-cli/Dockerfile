FROM mhand79/gpt-terminal-plus:latest

WORKDIR /app

# Install Google Cloud CLI
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
RUN apt-get update -y \ 
    && apt-get install google-cloud-cli -y

# Set environment variable to use the service account
ENV GOOGLE_APPLICATION_CREDENTIALS="/root/.config/gcloud/application_default_credentials.json"

# Set the default project
#RUN gcloud config set project YOUR_PROJECT_ID

# CMD ["node", "dist/index.js"] inherited from Dockerfile.base