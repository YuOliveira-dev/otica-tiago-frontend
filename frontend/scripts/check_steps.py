import json

with open(r"C:\Users\Yuri\.gemini\antigravity-ide\brain\d3729caf-36de-4f51-a279-fe93fcd5abe4\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if 578 <= i <= 624:
            step = json.loads(line)
            stype = step.get('type')
            source = step.get('source')
            calls = step.get('tool_calls', [])
            call_names = [c.get('name') for c in calls] if calls else []
            content = step.get('content', '')
            if isinstance(content, str) and len(content) > 150:
                content = content[:150] + '...'
            print(f"Step {i} ({source}, {stype}): calls={call_names} | content={content}")
