#!/usr/bin/env python3
"""Drive the supergateway StreamableHTTP MCP endpoint for gpt-terminal-plus on :8815,
the same endpoint mcp-gateway fronts with OAuth at /oauth/ex/gpt-terminal-plus/mcp."""
import json, urllib.request

URL = "http://localhost:8815/mcp"

def post(body, session=None):
    data = json.dumps(body).encode()
    req = urllib.request.Request(URL, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json, text/event-stream")
    if session:
        req.add_header("Mcp-Session-Id", session)
    resp = urllib.request.urlopen(req, timeout=60)
    sid = resp.headers.get("Mcp-Session-Id")
    raw = resp.read().decode()
    # response may be SSE ("data: {...}") or plain JSON
    parsed = None
    for line in raw.splitlines():
        line = line.strip()
        if line.startswith("data:"):
            line = line[5:].strip()
        if line.startswith("{"):
            try:
                parsed = json.loads(line)
            except Exception:
                pass
    return sid, parsed

sid, init = post({"jsonrpc":"2.0","id":1,"method":"initialize",
    "params":{"protocolVersion":"2024-11-05","capabilities":{},
              "clientInfo":{"name":"http-probe","version":"1.0"}}})
print("session:", sid)
print("server:", (init or {}).get("result",{}).get("serverInfo"))

post({"jsonrpc":"2.0","method":"notifications/initialized"}, sid)

_, tl = post({"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}, sid)
tools = (tl or {}).get("result",{}).get("tools",[])
print("TOOL COUNT:", len(tools))
print("tools:", ", ".join(t["name"] for t in tools))

_, cr = post({"jsonrpc":"2.0","id":3,"method":"tools/call",
              "params":{"name":"get_server_list","arguments":{}}}, sid)
txt = json.dumps((cr or {}).get("result", cr))
print("CALL get_server_list ->", txt[:300])
