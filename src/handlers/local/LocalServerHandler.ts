import { AbstractServerHandler } from '../../types/ServerHandler';
import Debug from 'debug';
import { ExecutionResult } from '../../types/ExecutionResult';
import { PaginatedResponse } from '../../types/PaginatedResponse';
import { executeLocalCode } from './actions/executeCode';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const localServerDebug = Debug('app:LocalServerHandler');

// The rest of the file content remains unchanged
