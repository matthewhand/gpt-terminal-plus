import LocalServer from "../../src/handlers/local/LocalServerHandler";

export const createLocalServer = () => {
  return new LocalServer({ host: "localhost", protocol: "local", code: true });
};
