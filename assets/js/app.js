// Analytical Platform Core Logic

const App = {
    currentRoute: 'dashboard',

    init() {
        this.bindEvents();
        this.initGlobalAIAssistant();
        this.navigate('login'); // Default route is now login
        
        if (window.lucide) {
            lucide.createIcons();
        }
    },

    bindEvents() {
        // Sidebar Navigation
        document.querySelectorAll('[data-route]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = e.currentTarget.getAttribute('data-route');
                this.navigate(route);
            });
        });

        // Dynamic routing for buttons/cards
        document.body.addEventListener('click', (e) => {
            const routeBtn = e.target.closest('[data-navigate]');
            if (routeBtn) {
                const route = routeBtn.getAttribute('data-navigate');
                this.navigate(route);
            }
        });

        // Sidebar Hover Behavior
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.addEventListener('mouseenter', () => {
                sidebar.classList.add('w-64');
                sidebar.classList.remove('w-20');
                document.querySelectorAll('.sidebar-text').forEach(el => el.classList.remove('hidden'));
            });

            sidebar.addEventListener('mouseleave', () => {
                sidebar.classList.add('w-20');
                sidebar.classList.remove('w-64');
                document.querySelectorAll('.sidebar-text').forEach(el => el.classList.add('hidden'));
            });

            // Initialize collapsed state
            sidebar.dispatchEvent(new Event('mouseleave'));
        }
    },

    async loadView(url, container) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            const html = await response.text();
            container.innerHTML = html;
            return true;
        } catch (error) {
            console.error('Error loading view:', error);
            container.innerHTML = `<div class="p-8 text-center text-red-500">Erro ao carregar o módulo (${url}).</div>`;
            return false;
        }
    },

    async navigate(route) {
        this.currentRoute = route;

        // Update Sidebar Active State
        document.querySelectorAll('.sidebar-link').forEach(link => {
            const icon = link.querySelector('i');
            const span = link.querySelector('span');
            
            // Check if the current route starts with or matches the link's route
            // For sub-routes (e.g. individuo-detalhe), we might not have a direct match,
            // but let's keep it exact for now or match primary categories.
            if (link.getAttribute('data-route') === route) {
                // Active link styles
                link.classList.add('bg-primary', 'text-white', 'border-secondary', 'shadow-md');
                link.classList.remove('font-medium', 'hover:bg-white/5', 'hover:text-white', 'border-transparent');
                
                if (icon) {
                    icon.classList.add('text-secondary-light');
                    icon.classList.remove('text-gray-400');
                }
                if (span) {
                    span.classList.add('font-semibold');
                }
            } else {
                // Inactive link styles
                link.classList.remove('bg-primary', 'text-white', 'border-secondary', 'shadow-md');
                link.classList.add('font-medium', 'hover:bg-white/5', 'hover:text-white', 'border-transparent');
                
                if (icon) {
                    icon.classList.remove('text-secondary-light');
                    icon.classList.add('text-gray-400');
                }
                if (span) {
                    span.classList.remove('font-semibold');
                }
            }
        });

        const mainContent = document.getElementById('main-content');
        const header = document.querySelector('header');
        const sidebar = document.getElementById('sidebar');
        
        // Handle full-screen layout for login
        if (route === 'login') {
            if (header) header.classList.add('hidden');
            if (sidebar) sidebar.classList.add('hidden');
            mainContent.classList.remove('p-8', 'lg:p-10', 'rounded-tl-3xl', 'shadow-inner-lg');
            mainContent.classList.add('p-0');
        } else {
            if (header) header.classList.remove('hidden');
            if (sidebar) sidebar.classList.remove('hidden');
            mainContent.classList.add('p-8', 'lg:p-10', 'rounded-tl-3xl', 'shadow-inner-lg');
            mainContent.classList.remove('p-0');
        }
        
        if (route === 'analise-30ssts') {
            await this.loadView('views/30ssts/layout.html', mainContent);
            this.runRouteLogic(route);
            this.updateFABVisibility(route);
            if (window.lucide) lucide.createIcons();
            mainContent.scrollTop = 0;
            return;
        }

        const success = await this.loadView(`views/${route}.html`, mainContent);
        if (success) {
            this.runRouteLogic(route);
            this.updateFABVisibility(route);
            if (window.lucide) lucide.createIcons();
            mainContent.scrollTop = 0;
        }
    },

    updateFABVisibility(route) {
        const fab = document.getElementById('ai-fab-container');
        if (!fab) return;
        
        // List of routes that represent "analysis" screens
        const analysisRoutes = [
            'analise-30ssts', 
            'populacoes', 
            '30ssts/populacao',
            'comparacao',
            'individuo-detalhe'
        ];
        
        if (analysisRoutes.includes(route)) {
            fab.classList.remove('hidden');
        } else {
            fab.classList.add('hidden');
        }
    },

    runRouteLogic(route) {
        switch (route) {
            case 'login':
                this.initLogin();
                break;
            case 'dashboard':
                this.initDashboard();
                break;
            case 'individuos':
                this.initIndividuos();
                break;
            case 'individuo-detalhe':
                this.initIndividuoDetalhe();
                break;
            case 'testes':
                this.initTestes();
                break;
            case 'teste-detalhe':
                this.initTesteDetalhe();
                break;
            case 'populacoes':
                this.initPopulacoes();
                break;
            case 'avaliacoes':
                this.initAvaliacoes();
                break;
            case 'movimento':
                this.initMovimento();
                break;
            case 'dados':
                this.initDados();
                break;
            case 'analise-30ssts':
                this.init30sSTS();
                break;
            case 'comparacao':
                this.initComparacaoIndividual();
                break;
            case '30ssts/populacao':
                if (window.LIACharts && window.LIACharts.initPopulacao30sSTSScreen) {
                    window.LIACharts.initPopulacao30sSTSScreen();
                }
                break;
            case 'assistente':
                if (window.LIAAssistente) {
                    window.LIAAssistente.init();
                }
                break;
        }
    },

    initLogin() {
        const togglePassword = document.getElementById('toggle-password');
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('toggle-password-icon');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Toggle lucide icon
                if (type === 'text') {
                    togglePassword.innerHTML = '<i data-lucide="eye-off" class="h-5 w-5 text-gray-600 transition-colors"></i>';
                } else {
                    togglePassword.innerHTML = '<i data-lucide="eye" class="h-5 w-5 text-gray-400 transition-colors"></i>';
                }
                if (window.lucide) lucide.createIcons();
            });
        }

        const forgotPwdLink = document.getElementById('forgot-password-link');
        const backToLoginBtn = document.getElementById('back-to-login');
        const loginForm = document.getElementById('login-form');
        const recoveryForm = document.getElementById('recovery-form');
        
        if (forgotPwdLink && loginForm && recoveryForm) {
            forgotPwdLink.addEventListener('click', (e) => {
                e.preventDefault();
                loginForm.classList.add('hidden');
                recoveryForm.classList.remove('hidden');
            });
        }

        if (backToLoginBtn && loginForm && recoveryForm) {
            backToLoginBtn.addEventListener('click', () => {
                recoveryForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
                document.getElementById('recovery-success-alert').classList.add('hidden');
                document.getElementById('recovery-email').value = '';
            });
        }

        if (recoveryForm) {
            recoveryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = document.getElementById('recovery-btn');
                const btnText = document.getElementById('recovery-btn-text');
                const spinner = document.getElementById('recovery-btn-spinner');
                const alert = document.getElementById('recovery-success-alert');
                
                btn.disabled = true;
                btnText.textContent = 'Enviando...';
                spinner.classList.remove('hidden');
                alert.classList.add('hidden');
                
                setTimeout(() => {
                    btn.disabled = false;
                    btnText.textContent = 'Enviar instruções';
                    spinner.classList.add('hidden');
                    alert.classList.remove('hidden');
                }, 1500);
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const errorAlert = document.getElementById('login-error-alert');
                
                errorAlert.classList.add('hidden');

                if (!email || !password) {
                    errorAlert.classList.remove('hidden');
                    return;
                }

                const btn = document.getElementById('login-btn');
                const btnText = document.getElementById('login-btn-text');
                const spinner = document.getElementById('login-btn-spinner');
                
                btn.disabled = true;
                btnText.textContent = 'Entrando...';
                spinner.classList.remove('hidden');
                
                // Mock authentication delay
                setTimeout(() => {
                    this.navigate('dashboard');
                }, 1500);
            });
        }
    },

    initDashboard() {
        if (!window.LIACharts) return;
        setTimeout(() => {
            window.LIACharts.renderDashboardEvolution();
        }, 100);
    },

    initIndividuos() {
        if (!window.mockData) return;
        const tbody = document.getElementById('individuos-table-body');
        if (tbody) {
            tbody.innerHTML = window.mockData.participants.map(p => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" onclick="App.navigate('individuo-detalhe')">
                    <td class="py-4 px-4 text-text-muted text-sm font-mono">${p.id}</td>
                    <td class="py-4 px-4 font-medium text-text-main">${p.name}</td>
                    <td class="py-4 px-4 text-text-muted">${p.age}</td>
                    <td class="py-4 px-4 text-text-muted">${p.gender}</td>
                    <td class="py-4 px-4 text-text-muted text-center">${p.evalCount}</td>
                    <td class="py-4 px-4 text-right">
                        <i data-lucide="chevron-right" class="w-4 h-4 text-gray-300 inline-block"></i>
                    </td>
                </tr>
            `).join('');
        }
    },

    initIndividuoDetalhe() {
        if (window.LIACharts) {
            setTimeout(() => {
                window.LIACharts.renderIndividualEvolution();
            }, 100);
        }

        const featureSelector = document.getElementById('feature-selector');
        if (featureSelector) {
            featureSelector.addEventListener('change', (e) => {
                if (window.LIACharts) {
                    window.LIACharts.renderIndividualEvolution(e.target.value);
                }
            });
        }
    },

    initTestes() {
        if (!window.mockData) return;
        const grid = document.getElementById('testes-grid');
        if (grid) {
            grid.innerHTML = window.mockData.protocols.map(p => {
                const isEnabled = p.id === '30ssts';
                return `
                <div class="bg-white border border-gray-200 rounded-xl p-6 transition-all ${isEnabled ? 'hover:shadow-md hover:border-secondary/50 cursor-pointer group' : 'opacity-60 cursor-not-allowed relative'}" ${isEnabled ? `onclick="App.navigate('30ssts/populacao')"` : ''}>
                    ${!isEnabled ? '<div class="absolute inset-0 z-10" title="Em breve"></div>' : ''}
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-primary">${p.name}</h3>
                            <p class="text-xs text-text-muted font-medium mt-1">${p.fullName}</p>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary ${isEnabled ? 'group-hover:bg-secondary/10 group-hover:text-secondary transition-colors' : ''}">
                            <i data-lucide="activity" class="w-5 h-5"></i>
                        </div>
                    </div>
                    <p class="text-sm text-text-muted line-clamp-2 mb-6 h-10">${p.description}</p>
                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div class="text-sm">
                            <span class="font-bold ${isEnabled ? 'text-text-main' : 'text-gray-400'}">${p.evalCount}</span>
                            <span class="text-text-muted text-xs">avaliações</span>
                        </div>
                        <span class="text-xs font-medium flex items-center gap-1 ${isEnabled ? 'text-secondary group-hover:underline' : 'text-gray-400 bg-gray-100 px-2 py-1 rounded-md'}">
                            ${isEnabled ? `Analisar <i data-lucide="arrow-right" class="w-3 h-3"></i>` : 'Em Breve'}
                        </span>
                    </div>
                </div>
                `;
            }).join('');
        }
    },

    initTesteDetalhe() {
        if (window.LIACharts) {
            setTimeout(() => {
                window.LIACharts.renderTestDistribution();
            }, 100);
        }
    },

    initPopulacoes() {
        if (window.LIAPopulacao && window.LIAPopulacao.init) {
            window.LIAPopulacao.init();
        }
    },

    initAvaliacoes() {
        if (!window.mockData) return;
        const tbody = document.getElementById('avaliacoes-table-body');
        if (tbody) {
            tbody.innerHTML = window.mockData.evaluations.map(ev => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onclick="App.navigate('analise-30ssts')">
                    <td class="py-4 px-4 font-medium text-text-main">${ev.date}</td>
                    <td class="py-4 px-4 text-text-main hover:text-primary">${ev.participant}</td>
                    <td class="py-4 px-4 font-medium text-primary">${ev.protocol}</td>
                    <td class="py-4 px-4">
                        <span class="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">${ev.status}</span>
                    </td>
                    <td class="py-4 px-4 text-right">
                        <button class="text-secondary hover:text-primary text-sm font-medium transition-colors">Ver Análise</button>
                    </td>
                </tr>
            `).join('');
        }
    },

    initMovimento() {
        if (window.LIACharts) {
            setTimeout(() => {
                window.LIACharts.renderKinematicsChart('kinematicsAccel', 'accel');
                window.LIACharts.renderKinematicsChart('kinematicsGyro', 'gyro');
            }, 100);
        }
    },

    initDados() {
        // Reuse evaluations logic but mapped to 'dados-table-body'
        if (!window.mockData) return;
        const tbody = document.getElementById('dados-table-body');
        if (tbody) {
            tbody.innerHTML = window.mockData.evaluations.map(ev => `
                <tr class="border-b border-gray-100 hover:bg-gray-50 text-sm">
                    <td class="py-3 px-4 text-text-muted font-mono">${ev.id}</td>
                    <td class="py-3 px-4">${ev.date}</td>
                    <td class="py-3 px-4">${ev.participant}</td>
                    <td class="py-3 px-4">${ev.protocol}</td>
                    <td class="py-3 px-4 text-text-muted">Acel/Giro (100Hz)</td>
                    <td class="py-3 px-4 text-right space-x-3">
                        <button class="text-text-muted hover:text-primary"><i data-lucide="code" class="w-4 h-4"></i></button>
                        <button class="text-text-muted hover:text-primary"><i data-lucide="download" class="w-4 h-4"></i></button>
                    </td>
                </tr>
            `).join('');
        }
    },

    async init30sSTS() {
        // Initialize view
        this.toggle30sSTSView('clinical');
        
        // Tab logic
        const tabs = document.querySelectorAll('#main-content .sts-tab-btn');
        const contentArea = document.getElementById('sts-tab-content-area');

        tabs.forEach(tab => {
            tab.addEventListener('click', async (e) => {
                const target = e.currentTarget.getAttribute('data-sts-tab');
                
                tabs.forEach(t => {
                    t.classList.remove('font-bold', 'text-primary', 'border-primary');
                    t.classList.add('font-medium', 'text-gray-400', 'border-transparent');
                });
                
                e.currentTarget.classList.remove('font-medium', 'text-gray-400', 'border-transparent');
                e.currentTarget.classList.add('font-bold', 'text-primary', 'border-primary');

                if (contentArea) {
                    const success = await this.loadView(`views/30ssts/${target}.html`, contentArea);
                    if (success) {
                        console.log('[LIA][STS] Aba carregada:', target);
                        
                        if (target === 'resumo' && window.LIACharts) {
                            requestAnimationFrame(() => {
                                window.LIACharts.init30sSTS();
                            });
                        } else if (target === 'sinais' && window.LIACharts) {
                            requestAnimationFrame(() => {
                                window.LIACharts.initSignalsTab();
                            });
                        } else if (target === 'indicadores' && window.LIACharts) {
                            requestAnimationFrame(() => {
                                window.LIACharts.initIndicadoresTab();
                            });
                        } else if (target === 'comparacao' && window.LIACharts) {
                            requestAnimationFrame(() => {
                                window.LIACharts.initComparacaoTab();
                            });
                        } else if (window.lucide) {
                            lucide.createIcons();
                        }
                    }
                }
            });
        });

        if (contentArea) {
            const success = await this.loadView('views/30ssts/resumo.html', contentArea);
            if (success && window.LIACharts) {
                requestAnimationFrame(() => {
                    window.LIACharts.init30sSTS();
                });
            }
        }
    },

    toggle30sSTSView(view) {
        const btnClinical = document.getElementById('btn-view-clinical');
        const btnScientific = document.getElementById('btn-view-scientific');
        const scientificElements = document.querySelectorAll('.sts-scientific-view');
        
        if (!btnClinical || !btnScientific) return;

        if (view === 'clinical') {
            btnClinical.classList.replace('text-text-muted', 'text-primary');
            btnClinical.classList.replace('bg-transparent', 'bg-white');
            btnClinical.classList.add('shadow-sm');
            
            btnScientific.classList.replace('text-primary', 'text-text-muted');
            btnScientific.classList.replace('bg-white', 'bg-transparent');
            btnScientific.classList.remove('shadow-sm');

            scientificElements.forEach(el => el.classList.add('hidden'));
        } else {
            btnScientific.classList.replace('text-text-muted', 'text-primary');
            btnScientific.classList.replace('bg-transparent', 'bg-white');
            btnScientific.classList.add('shadow-sm');
            
            btnClinical.classList.replace('text-primary', 'text-text-muted');
            btnClinical.classList.replace('bg-white', 'bg-transparent');
            btnClinical.classList.remove('shadow-sm');

            scientificElements.forEach(el => el.classList.remove('hidden'));
        }
    },

    initComparacaoIndividual() {
        if (window.LIACharts) {
            setTimeout(() => {
                window.LIACharts.initComparacaoIndividualScreen();
            }, 100);
        }
    },

    initGlobalAIAssistant() {
        const fabInput = document.getElementById('ai-fab-input');
        const fabSendBtn = document.getElementById('ai-fab-send-btn');
        const drawer = document.getElementById('ai-drawer');
        const overlay = document.getElementById('ai-drawer-overlay');
        const closeBtn = document.getElementById('ai-drawer-close');
        
        const drawerInput = document.getElementById('ai-drawer-input');
        const drawerSendBtn = document.getElementById('ai-drawer-send-btn');
        const messagesContainer = document.getElementById('ai-drawer-messages');

        if (!fabInput || !drawer) return;

        const openDrawer = () => {
            drawer.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        };

        const closeDrawer = () => {
            drawer.classList.add('translate-x-full');
            overlay.classList.add('opacity-0');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        };

        const appendUserMessage = (text) => {
            if (!text || !text.trim()) return;
            const msgHtml = `
                <div class="flex items-start gap-3 justify-end animate-fade-in mt-4">
                    <div class="bg-primary border border-primary-light rounded-2xl rounded-tr-sm p-3 text-sm text-white shadow-sm max-w-[85%] text-right">
                        <p>${text.trim()}</p>
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', msgHtml);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const appendAssistantMessage = (text) => {
            const msgHtml = `
                <div class="flex items-start gap-3 animate-fade-in mt-4">
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-700 shadow-sm max-w-[85%]">
                        <p>${text}</p>
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', msgHtml);
            if (window.lucide) lucide.createIcons();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const handleSend = (text) => {
            if (!text || !text.trim()) return;
            openDrawer();
            appendUserMessage(text);
            
            // Add typing animation
            const typingHtml = `
                <div id="ai-typing" class="flex items-start gap-3 animate-fade-in mt-4">
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-sm">
                        <i data-lucide="sparkles" class="w-4 h-4 text-white"></i>
                    </div>
                    <div class="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-1.5 h-10">
                        <div class="w-1.5 h-1.5 bg-primary/40 rounded-full typing-dot"></div>
                        <div class="w-1.5 h-1.5 bg-primary/60 rounded-full typing-dot" style="animation-delay: -0.16s"></div>
                        <div class="w-1.5 h-1.5 bg-primary rounded-full typing-dot" style="animation-delay: 0s"></div>
                    </div>
                </div>
            `;
            messagesContainer.insertAdjacentHTML('beforeend', typingHtml);
            if (window.lucide) lucide.createIcons();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            setTimeout(() => {
                const typingEl = document.getElementById('ai-typing');
                if (typingEl) typingEl.remove();
                
                // Mock response
                appendAssistantMessage("Essa é uma resposta automática do assistente para: <strong>" + text + "</strong>. Como este é um protótipo, a inteligência artificial real não está conectada.");
            }, 1500);
        };

        // FAB events
        fabSendBtn.addEventListener('click', () => {
            handleSend(fabInput.value);
            fabInput.value = '';
        });
        fabInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(fabInput.value);
                fabInput.value = '';
            }
        });

        // Drawer events
        drawerSendBtn.addEventListener('click', () => {
            handleSend(drawerInput.value);
            drawerInput.value = '';
        });
        drawerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(drawerInput.value);
                drawerInput.value = '';
            }
        });

        closeBtn.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);
    }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
