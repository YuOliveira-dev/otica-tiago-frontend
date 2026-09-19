import json

with open(r"C:\Users\Yuri\.gemini\antigravity-ide\brain\d3729caf-36de-4f51-a279-fe93fcd5abe4\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        if "process_logo.py" in line:
            step = json.loads(line)
            calls = step.get('tool_calls', [])
            call_names = [c.get('name') for c in calls] if calls else []
            print(f"Step {i}: {step.get('type')}, calls={call_names}")
