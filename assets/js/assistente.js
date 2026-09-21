window.LIAAssistente = {
    messagesContainer: null,
    inputEl: null,
    sendBtn: null,
    suggestionsContainer: null,
    clearBtn: null,

    // Mock responses based on keywords
    mockResponses: [
        {
            keywords: ['30ssts', 'último', 'características'],
            response: "No último teste 30sSTS (P-1004, 18/09/2026), observamos 12 repetições completas. A mediana do tempo de transferência foi de 1.25s e a amplitude angular do tronco atingiu 45.1°. A variabilidade temporal manteve-se em 12.5%, o que indica um ritmo consistente, embora o tempo de ciclo tenha aumentado 0.5s no terço final."
        },
        {
            keywords: ['populacional', 'perfil', '2026'],
            response: "Em 2026, a plataforma LIA analisou 142 participantes únicos (65% feminino, 35% masculino) com média de idade de 68 anos. O protocolo mais utilizado foi o 30sSTS (45% das avaliações), seguido pelo Timed Up and Go (30%). A maioria dos participantes (72%) apresenta risco de queda moderado ou baixo."
        },
        {
            keywords: ['velocidade', 'angular', 'homens', 'mulheres', 'compare'],
            response: "Comparando os sexos na base atual, a velocidade angular mediana durante a fase de levantamento (30sSTS) é de 85 °/s em homens e 78 °/s em mulheres. Na fase de sentar, os valores são 72 °/s e 65 °/s, respectivamente. Essa diferença é estatisticamente comum na população idosa, refletindo diferentes estratégias de controle motor."
        }
    ],
    
    defaultResponse: "Interessante. Como sou uma versão de demonstração (mock), ainda não tenho acesso completo ao backend para realizar consultas dinâmicas complexas sobre isso. Você pode tentar me perguntar sobre as características do último 30sSTS ou o perfil populacional de 2026!",

    init() {
        this.messagesContainer = document.getElementById('assistente-messages');
        this.inputEl = document.getElementById('assistente-input');
        this.sendBtn = document.getElementById('assistente-send-btn');
        this.suggestionsContainer = document.getElementById('assistente-suggestions');

        if (!this.messagesContainer) return; // Not on the right page

        this.bindEvents();
        this.setupAutoResize();
    },

    bindEvents() {
        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.handleSend());

        // Send message on Enter (but allow Shift+Enter for new line)
        this.inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Enable/disable send button based on input
        this.inputEl.addEventListener('input', () => {
            if (this.inputEl.value.trim().length > 0) {
                this.sendBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                this.sendBtn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        });

        // Clear chat
        const clearChatAction = () => {
            // Keep only the first message (welcome message)
            const firstMessage = this.messagesContainer.firstElementChild;
            this.messagesContainer.innerHTML = '';
            if (firstMessage) {
                this.messagesContainer.appendChild(firstMessage);
            }
            // Show suggestions again
            if (this.suggestionsContainer) {
                this.suggestionsContainer.classList.remove('opacity-0', 'pointer-events-none');
                this.suggestionsContainer.classList.add('pointer-events-auto');
            }
        };

        const newBtn = document.getElementById('assistente-new-btn');
        if (newBtn) newBtn.addEventListener('click', clearChatAction);

        // Suggestions click
        if (this.suggestionsContainer) {
            const chips = this.suggestionsContainer.querySelectorAll('.suggestion-chip');
            chips.forEach(chip => {
                chip.addEventListener('click', () => {
                    const text = chip.innerText.trim();
                    this.inputEl.value = text;
                    this.handleSend();
                });
            });
        }

        // Tab Switching
        const tabChat = document.getElementById('tab-chat');
        const tabFerramentas = document.getElementById('tab-ferramentas');
        const chatArea = document.getElementById('assistente-chat-area');
        const ferramentasArea = document.getElementById('assistente-ferramentas-area');

        if (tabChat && tabFerramentas && chatArea && ferramentasArea) {
            tabChat.addEventListener('click', () => {
                // Set Chat Tab Active
                tabChat.classList.add('bg-white', 'border-gray-200', 'text-primary', 'shadow-sm');
                tabChat.classList.remove('bg-transparent', 'text-gray-500', 'hover:bg-gray-100');
                
                // Set Ferramentas Tab Inactive
                tabFerramentas.classList.remove('bg-white', 'border-gray-200', 'text-primary', 'shadow-sm');
                tabFerramentas.classList.add('bg-transparent', 'text-gray-500', 'hover:bg-gray-100');

                // Switch views
                chatArea.classList.remove('hidden');
                chatArea.classList.add('flex');
                ferramentasArea.classList.add('hidden');
                ferramentasArea.classList.remove('flex');
            });

            tabFerramentas.addEventListener('click', () => {
                // Set Ferramentas Tab Active
                tabFerramentas.classList.add('bg-white', 'border-gray-200', 'text-primary', 'shadow-sm');
                tabFerramentas.classList.remove('bg-transparent', 'text-gray-500', 'hover:bg-gray-100');
                
                // Set Chat Tab Inactive
                tabChat.classList.remove('bg-white', 'border-gray-200', 'text-primary', 'shadow-sm');
                tabChat.classList.add('bg-transparent', 'text-gray-500', 'hover:bg-gray-100');

                // Switch views
                ferramentasArea.classList.remove('hidden');
                ferramentasArea.classList.add('flex');
                chatArea.classList.add('hidden');
                chatArea.classList.remove('flex');
            });
        }
    },

    setupAutoResize() {
        this.inputEl.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            if (this.value === '') {
                this.style.height = 'auto';
            }
        });
    },

    handleSend() {
        const text = this.inputEl.value.trim();
        if (!text) return;

        // Hide suggestions
        if (this.suggestionsContainer) {
            this.suggestionsContainer.classList.add('opacity-0', 'pointer-events-none');
            this.suggestionsContainer.classList.remove('pointer-events-auto');
        }

        // Add user message
        this.appendUserMessage(text);
        
        // Reset input
        this.inputEl.value = '';
        this.inputEl.style.height = 'auto';
        this.sendBtn.classList.add('opacity-50', 'cursor-not-allowed');

        // Show typing indicator
        const typingId = this.appendTypingIndicator();

        // Simulate network delay and respond
        setTimeout(() => {
            this.removeTypingIndicator(typingId);
            const response = this.getMockResponse(text);
            this.appendAssistantMessage(response);
        }, 1500 + Math.random() * 1000); // 1.5s to 2.5s delay
    },

    getMockResponse(text) {
        const lower = text.toLowerCase();
        
        for (const mock of this.mockResponses) {
            // Check if at least 2 keywords match, or if it's a short query and 1 matches
            let matchCount = 0;
            for (const kw of mock.keywords) {
                if (lower.includes(kw)) matchCount++;
            }
            if (matchCount >= 2 || (matchCount >= 1 && mock.keywords.length <= 2)) {
                return mock.response;
            }
        }
        
        return this.defaultResponse;
    },

    appendUserMessage(text) {
        const escapedText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const html = `
            <div class="flex items-end justify-end gap-2 animate-fade-in">
                <div class="bg-primary text-white rounded-2xl rounded-tr-sm py-3 px-4 text-sm shadow-sm max-w-[80%] whitespace-pre-wrap">${escapedText}</div>
            </div>
        `;
        this.messagesContainer.insertAdjacentHTML('beforeend', html);
        this.scrollToBottom();
    },

    appendAssistantMessage(text) {
        const html = `
            <div class="flex items-start gap-4 animate-fade-in">
                <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-md">
                    <i data-lucide="sparkles" class="w-5 h-5 text-white"></i>
                </div>
                <div class="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-700 shadow-sm max-w-[80%] whitespace-pre-wrap">${text}</div>
            </div>
        `;
        this.messagesContainer.insertAdjacentHTML('beforeend', html);
        if (window.lucide) lucide.createIcons();
        this.scrollToBottom();
    },

    appendTypingIndicator() {
        const id = 'typing-' + Date.now();
        const html = `
            <div id="${id}" class="flex items-start gap-4 animate-fade-in">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <i data-lucide="sparkles" class="w-5 h-5 text-primary"></i>
                </div>
                <div class="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm p-4 text-sm shadow-sm flex items-center gap-1.5 h-12">
                    <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                </div>
            </div>
        `;
        this.messagesContainer.insertAdjacentHTML('beforeend', html);
        if (window.lucide) lucide.createIcons();
        this.scrollToBottom();
        return id;
    },

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    },

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
};
