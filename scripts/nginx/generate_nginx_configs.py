import jinja2

# Template content
template_content = """
server {
    listen 80;
    server_name {{ service_name }}.example.com;

    location / {
        proxy_pass http://localhost:{{ port }};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
"""

# Services configuration
services = [
    {"service_name": "oci", "port": 5006},
    {"service_name": "aws", "port": 5007},
    {"service_name": "notions", "port": 5008},
    {"service_name": "joplin", "port": 5009},
]

# Initialize Jinja2 template
template = jinja2.Template(template_content)

# Render and write configuration files
for service in services:
    config_content = template.render(service_name=service["service_name"], port=service["port"])
    with open(f'/etc/nginx/sites-available/{service["service_name"]}.conf', 'w') as f:
        f.write(config_content)
