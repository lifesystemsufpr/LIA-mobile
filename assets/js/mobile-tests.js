/**
 * LIA Mobile Prototype - Test Execution Simulation
 */

const mobileTests = {
    testId: null,
    timer: null,
    timeLeft: 30,
    reps: 0,
    isPaused: false,
    statusInterval: null,

    initExecution(testId) {
        this.testId = testId;
        this.timeLeft = testId === '30sSTS' ? 30 : 15;
        this.reps = 0;
        this.isPaused = false;

        const btn = document.getElementById('btn-exec-action');
        if (btn) {
            btn.innerText = 'Reiniciar';
            btn.classList.add('bg-white/10', 'border-white/15');
            btn.classList.remove('bg-primary', 'border-primary', 'text-white');
        }

        const testNameEl = document.getElementById('exec-test-name');
        if (testNameEl) testNameEl.innerText = testId;

        this.updateTimeUI();
        this.updateRepsUI();

        this.startTimer();
        this.startSimulation();
    },

    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                this.updateTimeUI();

                if (this.timeLeft <= 0) {
                    this.finishTest();
                }
            }
        }, 1000);
    },

    startSimulation() {
        const states = ['Levantando...', 'Em pé', 'Sentando...', 'Sentado'];
        let stateIndex = 0;

        this.statusInterval = setInterval(() => {
            if (!this.isPaused) {
                const statusEl = document.getElementById('exec-status-text');
                if (statusEl) {
                    statusEl.innerText = states[stateIndex];
                }

                if (stateIndex === 3) {
                    this.reps++;
                    this.updateRepsUI();
                }

                stateIndex = (stateIndex + 1) % states.length;
            }
        }, 800);
    },

    updateTimeUI() {
        const el = document.getElementById('exec-timer');
        if (el) {
            el.innerHTML = `${this.timeLeft}<span class="text-3xl text-blue-300/40 ml-1">s</span>`;
        }
    },

    updateRepsUI() {
        const el = document.getElementById('exec-reps');
        if (el) {
            el.innerText = this.reps.toString().padStart(2, '0');

            el.classList.remove('scale-110', 'text-white');
            void el.offsetWidth;
            el.classList.add('scale-110', 'text-white', 'transition-transform');
            setTimeout(() => {
                el.classList.remove('scale-110', 'text-white');
            }, 200);
        }
    },

    handleAction() {
        const btn = document.getElementById('btn-exec-action');
        if (!btn) return;

        if (btn.innerText.trim() === 'Reiniciar') {
            this.clearAll();
            app.navigate('test-instructions');
        } else if (btn.innerText.trim() === 'Finalizar') {
            app.navigate('test-summary');
        }
    },

    cancel() {
        const confirmCancel = confirm('Deseja realmente cancelar esta avaliação? Os dados não serão salvos.');
        if (confirmCancel) {
            this.clearAll();
            app.navigate('test-selection');
        }
    },

    finishTest() {
        this.clearAll();

        app.state.testTime = app.state.test.id === '30sSTS' ? 30 : 15;
        app.state.testReps = this.reps;

        const btn = document.getElementById('btn-exec-action');
        if (btn) {
            btn.innerText = 'Finalizar';
            btn.classList.add('bg-primary', 'border-primary', 'text-white');
            btn.classList.remove('bg-white/10', 'border-white/15');
        }
        
        const statusEl = document.getElementById('exec-status-text');
        if (statusEl) statusEl.innerText = 'Teste Finalizado';

        if ('speechSynthesis' in window && app.getSoftSpeech) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(app.getSoftSpeech("Teste finalizado"));
        }
    },

    clearAll() {
        clearInterval(this.timer);
        clearInterval(this.statusInterval);
    }
};
