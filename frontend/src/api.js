// Use VITE_API_URL from environment, or fallback to localhost for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const sendMessage = async (message, threadId) => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                thread_id: threadId,
            }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return await response.json();
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};
