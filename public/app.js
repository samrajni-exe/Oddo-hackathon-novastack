// Synchronizes data onto console logs without freezing UI
async function fetchData(url, elementId) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById(elementId).innerText = data.length > 0 
            ? JSON.stringify(data, null, 2) 
            : "⚠️ Buffer stream clear. No active records found.";
    } catch (err) {
        document.getElementById(elementId).innerText = "❌ Exception Fault: " + err.message;
    }
}

// Blocks standard page redirects to maintain smooth presentation flow
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new URLSearchParams(new FormData(form));
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData
                });
                const message = await response.text();
                alert("Success response: " + message);
                form.reset();
            } catch (err) {
                alert("Transmission Error: " + err.message);
            }
        });
    });
});
