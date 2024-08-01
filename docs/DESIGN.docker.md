
## Customizing the Solution Stack

The `gpt-terminal-plus` solution stack can be customised to fit specific needs. Each service, such as `aws-cli`, `oci-cli`, `ssh-cli`, `joplin`, and `notion-sdk`, is containerised using Docker, and configurations can be adjusted through their respective Docker Compose files.

### Examples of Customisation

- **Adding New Services**: You can add new services by creating new directories with their own `Dockerfile` and `docker-compose.yml`.
- **Adjusting Environment Variables**: Modify the `.env` file or directly in the Docker Compose files to change settings such as ports, API tokens, and other configurations.
- **Updating Dockerfiles**: Customise the `Dockerfile` in each service directory to add or remove dependencies, change build steps, or adjust runtime commands.

### Detailed Directory Structure

The following is the detailed directory structure of the solution stack:

```
├── .env
├── docker/
│   ├── aws-cli/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── oci-cli/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── ssh-cli/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   ├── joplin/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── notion-sdk/
│       ├── Dockerfile
│       └── docker-compose.yml
├── fly_configs/
│   ├── fly-aws-app.toml
│   └── fly-terminal-app.toml
└── scripts/
    ├── launch_all_docker_compose.sh
```

Refer to this document and the `README.md` for more detailed instructions on customising and extending the solution stack.

## Notes

- Ensure each service is started with incrementally numbered ports to avoid conflicts.
