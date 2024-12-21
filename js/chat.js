import('./config.js').then((config) => {
    const API_KEY = config.API_KEY;

    console.log("API Key:", API_KEY);


    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`, 
        },
        body: JSON.stringify({
            model: 'gpt-4', 
            messages: [{ role: 'user', content: 'Hello!' }], 
        }),
    })
        .then((response) => response.json())
        .then((data) => console.log("Response 1:", data))
        .catch((error) => console.error('Error in Request 1:', error));


    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`, 
        },
        body: JSON.stringify({
            model: 'gpt-4', 
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' }, 
                { role: 'user', content: 'Tell me a joke!' } 
            ],
            max_tokens: 50, 
        }),
    })
        .then((response) => response.json())
        .then((data) => console.log("Response 2:", data))
        .catch((error) => console.error('Error in Request 2:', error));
}).catch((error) => console.error('Error loading config:', error));

function closeTab() {
    window.open('', '_self').close();
}

