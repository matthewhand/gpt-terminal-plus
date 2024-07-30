for service in "${services[@]}"; do
  IFS=":" read -r name port compose_file <<< "$service"
  docker compose -p $name -f docker/compose/docker-compose.base.yml -f $compose_file up -d --build
  echo "Service $name started with configuration from $compose_file."
done
