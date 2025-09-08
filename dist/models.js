export const AI_MODELS = [
    {
        name: "llama-3.1-8b-instant",
        capabilities: ["tool_use", "json_object"],
        context_window: 131_072,
        max_output_token: 131_072,
        input: "text",
    },
    {
        name: "llama-3.3-70b-versatile",
        capabilities: ["tool_use", "json_object"],
        context_window: 131_072,
        max_output_token: 32_768,
        input: "text",
    },
    {
        name: "meta-llama/llama-guard-4-12b",
        capabilities: ["tool_use", "json_object"],
        context_window: 131_072,
        max_output_token: 1024,
        input: ["text", "images"],
        max_file_size: 20 * 1024 * 1024,
        max_file_inputs: 5,
    },
    {
        name: "openai/gpt-oss-120b",
        capabilities: [
            "tool_use",
            "browser_search",
            "code_execution",
            "json_object",
            "json_schema",
            "reasoning",
        ],
        context_window: 131_072,
        max_output_token: 65_536,
        input: "text",
    },
    {
        name: "openai/gpt-oss-20b",
        capabilities: [
            "tool_use",
            "browser_search",
            "code_execution",
            "json_object",
            "json_schema",
            "reasoning",
        ],
        context_window: 131_072,
        max_output_token: 65_536,
        input: "text",
    },
    {
        name: "openai/whisper-large-v3",
        capabilities: ["speech_to_text"],
        input: "audio",
        output: "text",
        max_file_size: 100 * 1024 * 1024, //
    },
    {
        name: "openai/whisper-large-v3-turbo",
        capabilities: ["speech_to_text"],
        input: "audio",
        output: "text",
        max_file_size: 100 * 1024 * 1024,
    },
];
// not usingth is file it's for informational purposes
