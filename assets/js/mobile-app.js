/**
 * LIA Mobile Prototype - Main App Flow
 */

const app = {
    currentRoute: 'home',
    history: [],
    state: {
        participant: null,
        test: null,
        testTime: 0,
        testReps: 0
    },

    init() {
        this.navigate('home', null, true);
        this.bindGlobalEvents();
    },

    bindGlobalEvents() {
        // Bottom Nav clicks
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const route = btn.getAttribute('data-route');
                if (route) {
                    this.history = []; // Clear history when using bottom nav
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
        
        if (template) {
            viewContainer.innerHTML = template.innerHTML;
            this.currentRoute = route;
            
            // Re-render icons
            lucide.createIcons();
            
            // Handle specific route logic
            this.handleRouteLogic(route, data);
            
            // Update UI modes
            this.updateUIMode(route);
        } else {
            console.error(`Route template not found: tpl-${route}`);
        }
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
        // Update Bottom Nav active state
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const btnRoute = btn.getAttribute('data-route');
            if (btnRoute === route) {
                btn.classList.remove('text-gray-400');
                btn.classList.add('text-primary');
            } else {
                btn.classList.add('text-gray-400');
                btn.classList.remove('text-primary');
            }
        });

        const appContainer = document.getElementById('app');
        const header = document.getElementById('app-header');
        
        // Hide bottom nav & header for specific execution routes
        const fullscreenRoutes = ['countdown', 'test-execution'];
        if (fullscreenRoutes.includes(route)) {
            appContainer.classList.add('execution-mode');
        } else {
            appContainer.classList.remove('execution-mode');
        }
    },

    handleRouteLogic(route, data) {
        switch(route) {
            case 'participant-summary':
                if (this.state.participant) {
                    document.getElementById('ps-name').innerText = this.state.participant.name;
                    document.getElementById('ps-age').innerText = this.state.participant.age;
                    document.getElementById('ps-initials').innerText = this.getInitials(this.state.participant.name);
                }
                break;
            case 'test-instructions':
                if (this.state.test) {
                    document.getElementById('ti-title').innerText = this.state.test.id;
                    document.getElementById('ti-subtitle').innerText = this.state.test.name;
                }
                break;
            case 'countdown':
                this.startCountdown();
                break;
            case 'test-summary':
                if (this.state.participant) document.getElementById('sum-name').innerText = this.state.participant.name;
                if (this.state.test) document.getElementById('sum-test').innerText = this.state.test.id;
                document.getElementById('sum-reps').innerText = this.state.testReps;
                document.getElementById('sum-time').innerText = this.state.testTime + ' s';
                break;
            case 'sync':
                this.simulateSync();
                break;
            case 'test-execution':
                if (typeof mobileTests !== 'undefined') {
                    mobileTests.initExecution(this.state.test.id);
                }
                break;
        }
    },

    selectParticipant(name, age) {
        this.state.participant = { name, age };
        this.navigate('participant-summary');
    },

    selectTest(id, name) {
        this.state.test = { id, name };
        this.navigate('test-instructions');
    },

    startCountdown() {
        let count = 3;
        const el = document.getElementById('countdown-number');
        if(!el) return;
        
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                el.innerText = count;
                el.classList.remove('fade-in');
                void el.offsetWidth; // trigger reflow
                el.classList.add('fade-in');
            } else {
                clearInterval(interval);
                this.navigate('test-execution');
            }
        }, 1000);
    },

    simulateSync() {
        setTimeout(() => {
            const step3 = document.getElementById('sync-step-3');
            if(step3) {
                step3.innerHTML = `<i data-lucide="check-circle-2" class="w-5 h-5"></i> Sincronizado com sucesso`;
                step3.className = 'flex items-center gap-3 text-success font-medium text-sm fade-in';
                lucide.createIcons();
            }
            
            const anim = document.getElementById('sync-animation');
            const icon = document.getElementById('sync-success-icon');
            const title = document.getElementById('sync-title');
            const desc = document.getElementById('sync-desc');
            const btn = document.getElementById('sync-finish-btn');
            
            if(anim && icon) {
                anim.classList.add('hidden');
                icon.classList.remove('hidden');
                icon.classList.add('fade-in');
                title.innerText = 'Sincronização Concluída';
                desc.innerText = 'Os dados já estão disponíveis na LIA Web.';
                btn.classList.remove('hidden');
                btn.classList.add('fade-in');
            }
        }, 3000);
    },

    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
