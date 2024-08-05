import { Client } from 'ssh2';
import { createFile } from '../../../../src/handlers/ssh/actions/createFile';
import { presentWorkingDirectory } from '../../../../src/utils/GlobalStateHelper';
import { escapeSpecialChars } from '../../../../src/common/escapeSpecialChars';

jest.mock('ssh2');
jest.mock('../../../../src/utils/GlobalStateHelper');
jest.mock('../../../../src/common/escapeSpecialChars');

describe('createFile', () => {
    let sshClient: Client;
    let mockExec: jest.Mock;

    beforeEach(() => {
        sshClient = new Client();
        mockExec = jest.fn();
        (sshClient as any).exec = mockExec;
        (presentWorkingDirectory as jest.Mock).mockReturnValue('/home/user');
        (escapeSpecialChars as jest.Mock).mockImplementation((content: string) => content);
    });

    // it('should create a file on an SSH server', async () => {
    //     const filePath = 'test.txt';
    //     const content = 'Hello, world!';

    //     mockExec.mockImplementation((command, callback) => {
    //         const stream = {
    //             on: (event: string, handler: () => void) => {
    //                 if (event === 'close') handler();
    //                 return stream;
    //             }
    //         };
    //         callback(null, stream);
    //     });

    //     const result = await createFile(sshClient, filePath, content);
    //     expect(result).toBe(true);
    //     expect(mockExec).toHaveBeenCalledWith(
    //         `cat << EOF > /home/user/${filePath}\n${content}\nEOF\n`,
    //         expect.any(Function)
    //     );
    // });

    it('should throw an error if SSH client is not provided', async () => {
        await expect(createFile(null as unknown as Client, 'test.txt', 'Hello, world!'))
            .rejects
            .toThrow('SSH client must be provided and must be an instance of Client.');
    });

    it('should throw an error if file path is not provided', async () => {
        await expect(createFile(sshClient, '', 'Hello, world!'))
            .rejects
            .toThrow('File path must be provided and must be a string.');
    });

    it('should throw an error if content is not provided', async () => {
        await expect(createFile(sshClient, 'test.txt', ''))
            .rejects
            .toThrow('Content must be provided and must be a string.');
    });
});
