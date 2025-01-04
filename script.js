const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', handleUserMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleUserMessage();
});

async function handleUserMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, 'user');
    userInput.value = '';

    const botResponse = await fetchWikipediaSummary(userMessage);
    addMessage(botResponse.text, 'bot', botResponse.image);
}

function addMessage(message, sender, imageUrl = null) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;

    chatMessages.appendChild(messageDiv);

    if (imageUrl) {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = "Related image";
        chatMessages.appendChild(image);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchWikipediaSummary(query) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error fetching data from Wikipedia');
        }
        const data = await response.json();

        return {
            text: data.extract || 'Sorry, I could not find information on that topic.',
            image: data.thumbnail ? data.thumbnail.source : null
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            text: 'An error occurred while fetching data. Please try again later.',
            image: null
        };
    }
}
