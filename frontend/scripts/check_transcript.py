import json

with open(r"C:\Users\Yuri\.gemini\antigravity-ide\brain\d3729caf-36de-4f51-a279-fe93fcd5abe4\.system_generated\logs\transcript.jsonl", "r", encoding="utf-8") as f:
    for i, line in enumerate(f):
        step = json.loads(line)
        if step.get("type") == "USER_INPUT":
            print(f"{i}: {step.get('content')}")
