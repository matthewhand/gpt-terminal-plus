/**
 * @fileoverview Tests for the createFile function in SSH actions.
 */

import { expect } from 'chai';
import { createFile } from '@src/handlers/ssh/actions/createFile';
import sinon from 'sinon';
import fs from 'fs';

describe('createFile', () => {
  let writeFileSyncStub: sinon.SinonStub;

  beforeEach(() => {
    writeFileSyncStub = sinon.stub(fs, 'writeFileSync');
  });

  afterEach(() => {
    writeFileSyncStub.restore();
  });

  it('should create a file successfully', () => {
    const directory = '/remote/path';
    const filename = 'remote.txt';
    const content = 'Remote content';

    createFile(directory, filename, content);

    expect(writeFileSyncStub.calledOnce).to.be.true;
    expect(writeFileSyncStub.calledWith(`${directory}/${filename}`, content)).to.be.true;
  });

  it('should throw an error if directory does not exist', () => {
    const directory = '/nonexistent/path';
    const filename = 'remote.txt';
    const content = 'Remote content';

    writeFileSyncStub.throws(new Error('Directory does not exist'));

    expect(() => createFile(directory, filename, content)).to.throw('Directory does not exist');
  });
});
