import LocalServer from "../../src/handlers/local/LocalServerImplementation";

export const createLocalServer = () => {
  return new LocalServer({ host: "localhost", protocol: "local", code: true });
};
