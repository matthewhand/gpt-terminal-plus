import { expect } from 'chai';
import fs from 'fs';
import sinon from 'sinon';
import { updateFile } from '../../../../src/handlers/local/actions/updateFile';

describe('updateFile', () => {
  let readFileSyncStub: sinon.SinonStub;
  let writeFileSyncStub: sinon.SinonStub;
  let existsSyncStub: sinon.SinonStub;

  beforeEach(() => {
    readFileSyncStub = sinon.stub(fs, 'readFileSync');
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
    existsSyncStub = sinon.stub(fs, 'existsSync');
    existsSyncStub.returns(true);
  });

  afterEach(() => {
    readFileSyncStub.restore();
    writeFileSyncStub.restore();
    existsSyncStub.restore();
  });

  it('should update the file with the replacement text', async () => {
    const filePath = 'test.txt';
    const fileContent = 'Hello World';
    readFileSyncStub.returns(fileContent);

    const pattern = 'World';
    const replacement = 'Universe';
    const multiline = false;

    const result = await updateFile(filePath, pattern, replacement, multiline);

    expect(result).to.be.true;
    expect(writeFileSyncStub.calledOnce).to.be.true;
    const updatedContent = writeFileSyncStub.getCall(0).args[1];
    expect(updatedContent).to.equal('Hello Universe');
  });

  it('should throw an error if file does not exist', async () => {
    const filePath = 'nonexistent.txt';
    // Previously we threw from readFileSync; we should instead simulate missing file via existsSync
    existsSyncStub.returns(false);

    try {
      await updateFile(filePath, 'pattern', 'replacement', false);
      expect.fail('Expected error was not thrown');
    } catch (error) {
      expect((error as Error).message).to.equal('File not found');
    }
  });

  it('should handle invalid input parameters', async () => {
    try {
      await updateFile('', 'pattern', 'replacement', false);
      expect.fail('Expected error was not thrown for invalid file path');
    } catch (error) {
      expect((error as Error).message).to.equal('Invalid file path');
    }

    try {
      await updateFile('file.txt', '', 'replacement', false);
      expect.fail('Expected error was not thrown for invalid pattern');
    } catch (error) {
      expect((error as Error).message).to.equal('Invalid pattern');
    }

    try {
      await updateFile('file.txt', 'pattern', '', false);
      expect.fail('Expected error was not thrown for invalid replacement');
    } catch (error) {
      expect((error as Error).message).to.equal('Invalid replacement');
    }
  });
});
