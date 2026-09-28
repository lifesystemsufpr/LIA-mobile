/**
 * LIA Mobile Prototype - Main App Flow
 * Redesigned with new navigation and screens
 */

const app = {
    currentRoute: 'login',
    history: [],
    state: {
        participant: null,
        test: null,
        testTime: 0,
        testReps: 0,
        selectMode: false,
    },

    init() {
        this.navigate('login', null, true);
        this.bindGlobalEvents();
    },

    bindGlobalEvents() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const route = btn.getAttribute('data-route');
                if (route) {
                    this.history = [];
                    this.navigate(route, null, true);
                }
            });
        });
    },

    navigate(route, data = null, isRoot = false) {
        if (!isRoot && this.currentRoute) {
            this.history.push(this.currentRoute);
        }

        const template = document.getElementById(`tpl-${route}`);
        const viewContainer = document.getElementById('main-view');

        if (!template) {
            return;
        }

        viewContainer.innerHTML = template.innerHTML;
        this.currentRoute = route;

        lucide.createIcons();

        this.handleRouteLogic(route, data);
        this.updateUIMode(route);
    },

    goBack() {
        if (this.history.length > 0) {
            const previous = this.history.pop();
            this.navigate(previous, null, true);
        } else {
            this.navigate('home', null, true);
        }
    },

    updateUIMode(route) {
        const appContainer = document.getElementById('app');

        // Update Bottom Nav active state + indicators
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const btnRoute = btn.getAttribute('data-route');
            const indicator = btn.querySelector('.nav-indicator');

            if (btnRoute === route) {
                btn.classList.remove('text-text-muted');
                btn.classList.add('text-primary-dark');
                btn.querySelector('span').classList.remove('font-medium');
                btn.querySelector('span').classList.add('font-bold');
                if (indicator) {
                    indicator.classList.remove('bg-transparent');
                    indicator.classList.add('bg-primary-dark');
                }
            } else {
                btn.classList.add('text-text-muted');
                btn.classList.remove('text-primary-dark');
                btn.querySelector('span').classList.add('font-medium');
                btn.querySelector('span').classList.remove('font-bold');
                if (indicator) {
                    indicator.classList.add('bg-transparent');
                    indicator.classList.remove('bg-primary-dark');
                }
            }
        });

        // Fullscreen execution mode
        const fullscreenRoutes = ['countdown', 'test-execution'];
        if (fullscreenRoutes.includes(route)) {
            appContainer.classList.add('execution-mode');
            appContainer.classList.remove('login-mode');
        } else if (route === 'login') {
            appContainer.classList.add('login-mode');
            appContainer.classList.remove('execution-mode');
        } else {
            appContainer.classList.remove('execution-mode');
            appContainer.classList.remove('login-mode');
        }
    },

    handleRouteLogic(route, data) {
        switch(route) {
            case 'participants':
                if (data && data.selectMode) {
                    this.state.selectMode = data.selectMode;
                    const title = document.getElementById('participants-title');
                    if (title) {
                        title.innerText = 'Selecionar Participante';
                    }
                }
                break;

            case 'participant-summary':
                if (this.state.participant) {
                    const nameEl = document.getElementById('ps-name');
                    const ageEl = document.getElementById('ps-age');
                    const initialsEl = document.getElementById('ps-initials');
                    if (nameEl) nameEl.innerText = this.state.participant.name;
                    if (ageEl) ageEl.innerText = this.state.participant.age;
                    if (initialsEl) initialsEl.innerText = this.getInitials(this.state.participant.name);
                }
                break;

            case 'participant-detail':
                if (this.state.participant) {
                    const pdName = document.getElementById('pd-name');
                    const pdAge = document.getElementById('pd-age');
                    const pdInitials = document.getElementById('pd-initials');
                    if (pdName) pdName.innerText = this.state.participant.name;
                    if (pdAge) pdAge.innerText = this.state.participant.age;
                    if (pdInitials) pdInitials.innerText = this.getInitials(this.state.participant.name);
                }
                break;

            case 'evaluation-detail':
                const isSynced = data && data.synced !== undefined ? data.synced : true;
                const statusCard = document.getElementById('eval-detail-status-card');
                const actionContainer = document.getElementById('eval-detail-actions');
                
                if (statusCard && actionContainer) {
                    if (isSynced) {
                        statusCard.className = 'bg-success/10 rounded-2xl p-4 flex items-center gap-3 mb-6 border border-success/20';
                        statusCard.innerHTML = `
                            <div class="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                                <i data-lucide="cloud-check" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-success">Sincronizado</p>
                                <p class="text-[11px] text-success/80 font-medium">Os dados foram enviados para a LIA Web</p>
                            </div>
                        `;
                        actionContainer.innerHTML = `
                            <button class="w-full bg-white text-primary border border-primary font-extrabold py-3.5 rounded-xl shadow-sm btn-press text-sm flex items-center justify-center gap-2" onclick="app.goBack()">
                                Voltar
                            </button>
                        `;
                    } else {
                        statusCard.className = 'bg-warning/10 rounded-2xl p-4 flex items-center gap-3 mb-6 border border-warning/20';
                        statusCard.innerHTML = `
                            <div class="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center text-warning">
                                <i data-lucide="cloud-off" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-sm font-bold text-warning">Pendente de Sincronização</p>
                                <p class="text-[11px] text-warning/80 font-medium">Os dados estão salvos apenas no dispositivo</p>
                            </div>
                        `;
                        actionContainer.innerHTML = `
                            <button class="w-full bg-primary text-white font-extrabold py-3.5 rounded-xl shadow-lg btn-press text-sm flex items-center justify-center gap-2 mb-3" onclick="app.navigate('sync')">
                                <i data-lucide="cloud-upload" class="w-4 h-4"></i> Sincronizar Agora
                            </button>
                            <button class="w-full bg-white text-text-muted border border-border font-extrabold py-3.5 rounded-xl shadow-sm btn-press text-sm flex items-center justify-center gap-2" onclick="app.goBack()">
                                Voltar
                            </button>
                        `;
                    }
                    if (window.lucide) {
                        lucide.createIcons({
                            root: statusCard
                        });
                        lucide.createIcons({
                            root: actionContainer
                        });
                    }
                }
                break;

            case 'screening':
                if (this.state.participant) {
                    const scrName = document.getElementById('scr-participant-name');
                    if (scrName) scrName.innerText = this.state.participant.name;
                }
                break;

            case 'test-selection':
                if (this.state.participant) {
                    const tsParticipant = document.getElementById('ts-participant');
                    if (tsParticipant) {
                        tsParticipant.innerText = `${this.state.participant.name}, ${this.state.participant.age} anos`;
                    }
                }
                break;

            case 'test-instructions':
                if (this.state.test) {
                    const tiTitle = document.getElementById('ti-title');
                    const tiSubtitle = document.getElementById('ti-subtitle');
                    // if (tiTitle) tiTitle.innerText = this.state.test.id;
                    // if (tiSubtitle) tiSubtitle.innerText = this.state.test.name;
                }
                break;

            case 'countdown':
                this.startCountdown();
                break;

            case 'test-summary':
                if (this.state.participant) {
                    const sumName = document.getElementById('sum-name');
                    if (sumName) sumName.innerText = this.state.participant.name;
                }
                if (this.state.test) {
                    const sumTest = document.getElementById('sum-test');
                    if (sumTest) sumTest.innerText = this.state.test.id;
                }
                const sumReps = document.getElementById('sum-reps');
                const sumTime = document.getElementById('sum-time');
                if (sumReps) sumReps.innerText = this.state.testReps;
                if (sumTime) sumTime.innerText = this.state.testTime + ' s';
                break;

            case 'sync':
                this.simulateSync();
                break;

            case 'test-execution':
                if (typeof mobileTests !== 'undefined' && this.state.test) {
                    mobileTests.initExecution(this.state.test.id);
                }
                break;
        }
    },

    selectParticipant(name, age) {
        this.state.participant = { name, age };
        if (this.state.selectMode === 'new-test') {
            this.state.selectMode = false;
            this.state.test = null;
            this.openSummaryModal();
        } else if (this.state.selectMode) {
            this.state.selectMode = false;
            this.openSummaryModal();
        } else {
            this.navigate('participant-detail');
        }
    },

    openSummaryModal() {
        const modal = document.getElementById('modal-summary');
        const content = document.getElementById('modal-summary-content');
        
        if(this.state.participant) {
            document.getElementById('modal-ps-name').textContent = this.state.participant.name;
            document.getElementById('modal-ps-age').textContent = this.state.participant.age;
            
            const names = this.state.participant.name.split(' ');
            let initials = names[0].charAt(0);
            if (names.length > 1) {
                initials += names[names.length - 1].charAt(0);
            }
            document.getElementById('modal-ps-initials').textContent = initials.toUpperCase();
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Trigger reflow
        void modal.offsetWidth;
        
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-y-full');
    },

    closeSummaryModal() {
        const modal = document.getElementById('modal-summary');
        const content = document.getElementById('modal-summary-content');
        
        modal.classList.add('opacity-0');
        content.classList.add('translate-y-full');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    },

    confirmParticipantAndContinue() {
        this.closeSummaryModal();
        setTimeout(() => {
            if (this.state.test) {
                this.navigate('test-instructions');
            } else {
                this.navigate('test-selection');
            }
        }, 300);
    },

    showSendDataModal() {
        const modal = document.getElementById('modal-send-data');
        const content = document.getElementById('modal-send-data-content');
        if (modal && content) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            content.classList.remove('translate-y-full');
        }
    },

    closeSendDataModal() {
        const modal = document.getElementById('modal-send-data');
        const content = document.getElementById('modal-send-data-content');
        if (modal && content) {
            modal.classList.add('opacity-0');
            content.classList.add('translate-y-full');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        }
    },

    confirmSendData() {
        this.closeSendDataModal();
        setTimeout(() => {
            this.navigate('sync');
        }, 300);
    },

    selectProtocolForNew(element, id, name) {
        this.state.test = { id, name };
        
        // Remove active state from all cards
        document.querySelectorAll('.test-card').forEach(card => {
            card.classList.remove('border-primary', 'bg-primary/5');
            card.classList.add('border-border', 'bg-white');
            
            const iconBg = card.querySelector('.icon-bg');
            if (iconBg) {
                iconBg.classList.remove('bg-primary', 'text-white');
                iconBg.classList.add('bg-primary/5', 'text-primary');
            }

            const indicator = card.querySelector('.test-indicator');
            if (indicator) {
                indicator.innerHTML = '<i data-lucide="chevron-right" class="w-5 h-5"></i>';
                indicator.classList.remove('text-primary');
                indicator.classList.add('text-border');
            }
        });

        // Add active state to selected card
        element.classList.remove('border-border', 'bg-white');
        element.classList.add('border-primary', 'bg-primary/5');

        const activeIconBg = element.querySelector('.icon-bg');
        if (activeIconBg) {
            activeIconBg.classList.remove('bg-primary/5', 'text-primary');
            activeIconBg.classList.add('bg-primary', 'text-white');
        }

        const activeIndicator = element.querySelector('.test-indicator');
        if (activeIndicator) {
            activeIndicator.innerHTML = '<div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center"><i data-lucide="check" class="w-4 h-4"></i></div>';
            activeIndicator.classList.remove('text-border');
            activeIndicator.classList.add('text-primary');
        }

        if (window.lucide) {
            lucide.createIcons();
        }

        // Navigate immediately with a small delay for visual feedback
        setTimeout(() => {
            if (this.state.participant) {
                this.navigate('test-instructions');
            } else {
                this.navigate('participants', { selectMode: true });
            }
        }, 300);
    },

    startTestFromCatalog(id, name) {
        this.state.test = { id, name };
        this.navigate('participants', { selectMode: true });
    },

    selectTest(id, name) {
        this.state.test = { id, name };
        this.navigate('test-instructions');
    },

    getSoftSpeech(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'pt-BR';
        msg.pitch = 1.1; 
        msg.rate = 0.95;
        msg.volume = 0.8;
        
        const voices = window.speechSynthesis.getVoices();
        const ptVoices = voices.filter(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR'));
        // Try to find a soft/female voice
        const softVoice = ptVoices.find(v => v.name.toLowerCase().match(/(maria|luciana|zira|female)/));
        if (softVoice) {
            msg.voice = softVoice;
        } else if (ptVoices.length > 0) {
            msg.voice = ptVoices[0];
        }
        return msg;
    },

    startCountdown() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        const msg = this.getSoftSpeech("Cinco segundos para iniciar o teste, faça os ajustes necessários");
        
        let count = 5;
        const el = document.getElementById('countdown-number');
        const bar = document.getElementById('countdown-bar');
        
        if (el) {
            el.innerText = count;
            if (bar) bar.style.width = '100%';
        }

        const startTimer = () => {
            if (!el) return;

            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(this.getSoftSpeech(count.toString()));
            }

            const interval = setInterval(() => {
                count--;
                if (count > 0) {
                    el.innerText = count;
                    el.classList.remove('countdown-pulse');
                    void el.offsetWidth;
                    el.classList.add('countdown-pulse');
                    if (bar) {
                        bar.style.width = `${(count / 5) * 100}%`;
                    }
                    
                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        window.speechSynthesis.speak(this.getSoftSpeech(count.toString()));
                    }
                } else {
                    clearInterval(interval);
                    if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        window.speechSynthesis.speak(this.getSoftSpeech("Já!"));
                    }
                    this.navigate('test-execution');
                }
            }, 1000);
        };

        if ('speechSynthesis' in window) {
            msg.onend = startTimer;
            msg.onerror = startTimer;
            window.speechSynthesis.speak(msg);
        } else {
            startTimer();
        }
    },

    simulateSync() {
        setTimeout(() => {
            const step3 = document.getElementById('sync-step-3');
            if (step3) {
                step3.innerHTML = `<div class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0"><i data-lucide="check" class="w-4 h-4"></i></div> Sincronizado com sucesso`;
                step3.className = 'flex items-center gap-3 text-success font-medium text-sm fade-in';
                lucide.createIcons();
            }

            const anim = document.getElementById('sync-animation');
            const icon = document.getElementById('sync-success-icon');
            const title = document.getElementById('sync-title');
            const desc = document.getElementById('sync-desc');
            const btn = document.getElementById('sync-finish-btn');

            if (anim && icon) {
                anim.classList.add('hidden');
                icon.classList.remove('hidden');
                icon.classList.add('scale-in');
                if (title) title.innerText = 'Sincronização Concluída';
                if (desc) desc.innerText = 'Os dados já estão disponíveis na LIA Web.';
                if (btn) {
                    btn.classList.remove('hidden');
                    btn.classList.add('fade-in');
                }
            }
        }, 3000);
    },

    simulateSyncIcon() {
        // Visual feedback for sync button in header
        const headerRight = document.getElementById('header-right');
        if (!headerRight) return;
        const syncBtn = headerRight.querySelector('button');
        if (syncBtn) {
            syncBtn.classList.add('animate-spin');
            setTimeout(() => {
                syncBtn.classList.remove('animate-spin');
            }, 1500);
        }
    },

    switchParticipantTab(tabId) {
        const tabDados = document.getElementById('tab-btn-dados');
        const tabHistory = document.getElementById('tab-btn-history');
        const contentDados = document.getElementById('tab-content-dados');
        const contentHistory = document.getElementById('tab-content-history');

        if (!tabDados || !tabHistory) return;

        if (tabId === 'dados') {
            tabDados.classList.add('text-primary', 'border-primary');
            tabDados.classList.remove('text-text-muted', 'border-transparent');
            
            tabHistory.classList.remove('text-primary', 'border-primary');
            tabHistory.classList.add('text-text-muted', 'border-transparent');
            
            contentDados.classList.remove('hidden');
            contentDados.classList.add('block');
            
            contentHistory.classList.remove('block');
            contentHistory.classList.add('hidden');
        } else {
            tabHistory.classList.add('text-primary', 'border-primary');
            tabHistory.classList.remove('text-text-muted', 'border-transparent');
            
            tabDados.classList.remove('text-primary', 'border-primary');
            tabDados.classList.add('text-text-muted', 'border-transparent');
            
            contentHistory.classList.remove('hidden');
            contentHistory.classList.add('block');
            
            contentDados.classList.remove('block');
            contentDados.classList.add('hidden');
        }
    },

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
