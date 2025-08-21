import { executeLocalCode } from "../../../../src/handlers/local/actions/executeCode";
import { exec } from "child_process";

jest.mock("child_process", () => ({
  exec: jest.fn()
}));

describe("executeLocalCode", () => {
  const execMock = exec as unknown as jest.Mock<any, any>;

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw an error if code is not provided", async () => {
    await expect(executeLocalCode("", "node")).rejects.toThrow(
      "Code is required for execution."
    );
  });

  it("should throw an error if language is not provided", async () => {
    await expect(executeLocalCode("console.log('hi');", "")).rejects.toThrow(
      "Language is required for code execution."
    );
  });

  it("should execute command and resolve with stdout and stderr", async () => {
    const code = "console.log('hello');";
    const language = "node";
    const expectedStdout = "hello\n";
    const expectedStderr = "";

    execMock.mockImplementation(
      (command: string, options: { timeout?: number }, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
        callback(null, expectedStdout, expectedStderr);
      }
    );

    const result = await executeLocalCode(code, language);
    expect(result).toEqual({ stdout: expectedStdout, stderr: expectedStderr });
    expect(execMock).toHaveBeenCalled();
  });

  it("should construct command with directory when provided", async () => {
    const code = "console.log('hello');";
    const language = "node";
    const directory = "/tmp";
    const expectedCommand = `cd ${directory} && ${language} -c "${code}"`;
    const expectedStdout = "hello\n";
    const expectedStderr = "";

    execMock.mockImplementation(
      (command: string, options: { timeout?: number }, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
        expect(command).toBe(expectedCommand);
        callback(null, expectedStdout, expectedStderr);
      }
    );

    const result = await executeLocalCode(code, language, undefined, directory);
    expect(result).toEqual({ stdout: expectedStdout, stderr: expectedStderr });
  });

  it("should reject if exec returns an error", async () => {
    const code = "console.log('hello');";
    const language = "node";
    const error = new Error("exec error");

    execMock.mockImplementation(
      (command: string, options: { timeout?: number }, callback: (error: Error | null, stdout: string, stderr: string) => void) => {
        callback(error, "", "");
      }
    );

    await expect(executeLocalCode(code, language)).rejects.toThrow(
      "Failed to execute code: exec error"
    );
  });
});
