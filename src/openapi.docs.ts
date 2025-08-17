/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: API_TOKEN
 *   schemas:
 *     ExecutionResult:
 *       type: object
 *       properties:
 *         stdout:
 *           type: string
 *         stderr:
 *           type: string
 *         exitCode:
 *           type: integer
 *         error:
 *           type: boolean
 *       required:
 *         - stdout
 *         - stderr
 *         - exitCode
 *         - error
 */

/**
 * @openapi
 * /server/list:
 *   get:
 *     operationId: serverList
 *     summary: List servers for this API token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 servers:
 *                   type: array
 *                   items:
 *                     type: object
 *               required:
 *                 - servers
 */

/**
 * @openapi
 * /command/execute:
 *   post:
 *     operationId: executeCommand
 *     summary: Execute using first available mode
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               command:
 *                 type: string
 *             required:
 *               - command
 *     responses:
 *       '200':
 *         description: Execution complete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/ExecutionResult'
 *                 aiAnalysis:
 *                   type: object
 *               required:
 *                 - result
 */

/**
 * @openapi
 * /command/execute-code:
 *   post:
 *     operationId: executeCode
 *     summary: Execute a code snippet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *               code:
 *                 type: string
 *               timeoutMs:
 *                 type: integer
 *             required:
 *               - language
 *               - code
 *     responses:
 *       '200':
 *         description: Execution complete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/ExecutionResult'
 *                 aiAnalysis:
 *                   type: object
 *               required:
 *                 - result
 */

/**
 * @openapi
 * /command/execute-file:
 *   post:
 *     operationId: executeFile
 *     summary: Execute a file present on the server/target (deprecated)
 *     deprecated: true
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *               directory:
 *                 type: string
 *               timeoutMs:
 *                 type: integer
 *             required:
 *               - filename
 *     responses:
 *       '200':
 *         description: Execution complete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   $ref: '#/components/schemas/ExecutionResult'
 *                 aiAnalysis:
 *                   type: object
 *               required:
 *                 - result
 */

/**
 * @openapi
 * /command/execute-llm:
 *   post:
 *     operationId: executeLlm
 *     summary: Run an LLM plan or direct instruction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instructions:
 *                 type: string
 *               dryRun:
 *                 type: boolean
 *               stream:
 *                 type: boolean
 *             required:
 *               - instructions
 *     responses:
 *       '200':
 *         description: LLM execution complete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plan:
 *                   type: object
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 */