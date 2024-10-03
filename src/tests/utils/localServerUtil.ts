import LocalServer from "@src/handlers/local/LocalServerHandler";

export const createLocalServer = () => {
  return new LocalServer({ hostname: "localhost", protocol: "local", code: true });
};
