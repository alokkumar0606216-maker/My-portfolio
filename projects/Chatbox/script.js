document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');
    const themeBtn = document.getElementById('theme-btn');
    const contactItems = document.querySelectorAll('.contact-item');
    const activeChatName = document.getElementById('active-chat-name');

    // Toggle Dark Mode
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // Send Message
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if (!text) return;

        // Current time format
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Append outgoing message
        const outgoingMsg = document.createElement('div');
        outgoingMsg.className = 'message outgoing';
        outgoingMsg.innerHTML = `
            <div class="message-content">
                <p>${escapeHTML(text)}</p>
                <span class="msg-time">${timeStr} <i class="fa-solid fa-check-double read-check"></i></span>
            </div>
        `;
        chatMessages.appendChild(outgoingMsg);
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate intelligent automated reply
        setTimeout(() => {
            const replies = [
                "Awesome! Thanks for reaching out.",
                "Got your message! Everything looks great.",
                "Working on this feature right now 👍",
                "Sounds like a plan! Let's connect soon.",
                "Checked out the code updates, nicely done!"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            const incomingMsg = document.createElement('div');
            incomingMsg.className = 'message incoming';
            incomingMsg.innerHTML = `
                <div class="message-content">
                    <p>${randomReply}</p>
                    <span class="msg-time">${timeStr}</span>
                </div>
            `;
            chatMessages.appendChild(incomingMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    });

    // Switch contacts
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            contactItems.forEach(c => c.classList.remove('active'));
            item.classList.add('active');
            const name = item.getAttribute('data-name');
            if (activeChatName) activeChatName.textContent = name;
        });
    });

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});