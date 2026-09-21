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
        this.timeLeft = testId === '30sSTS' ? 30 : 15; // default examples
        this.reps = 0;
        this.isPaused = false;
        
        // Reset UI
        document.getElementById('exec-test-name').innerText = testId;
        this.updateTimeUI();
        this.updateRepsUI();
        
        // Start simulation
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
        // Simulate sensor detecting sit-to-stand cycles
        const states = ['Levantando...', 'Em pé', 'Sentando...', 'Sentado'];
        let stateIndex = 0;

        this.statusInterval = setInterval(() => {
            if (!this.isPaused) {
                const statusEl = document.getElementById('exec-status-text');
                if(statusEl) {
                    statusEl.innerText = states[stateIndex];
                }
                
                // When returning to 'Sentado' after a cycle, count a rep
                if (stateIndex === 3) {
                    this.reps++;
                    this.updateRepsUI();
                }

                stateIndex = (stateIndex + 1) % states.length;
            }
        }, 800); // cycle speed simulation
    },

    updateTimeUI() {
        const el = document.getElementById('exec-timer');
        if(el) {
            el.innerHTML = `${this.timeLeft}<span class="text-3xl text-gray-400 ml-1">s</span>`;
        }
    },

    updateRepsUI() {
        const el = document.getElementById('exec-reps');
        if(el) {
            // zero pad
            el.innerText = this.reps.toString().padStart(2, '0');
            
            // Pop effect
            el.classList.remove('scale-110', 'text-white');
            void el.offsetWidth;
            el.classList.add('scale-110', 'text-white', 'transition-transform');
            setTimeout(() => {
                el.classList.remove('scale-110', 'text-white');
            }, 200);
        }
    },

    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('btn-exec-pause');
        if (this.isPaused) {
            btn.innerText = 'Retomar';
            btn.classList.add('bg-blue-600', 'border-blue-500');
            btn.classList.remove('bg-gray-800', 'border-gray-700');
            document.getElementById('exec-status-text').innerText = 'Pausado';
        } else {
            btn.innerText = 'Pausar';
            btn.classList.remove('bg-blue-600', 'border-blue-500');
            btn.classList.add('bg-gray-800', 'border-gray-700');
        }
    },

    cancel() {
        const confirmCancel = confirm("Deseja realmente cancelar esta avaliação? Os dados não serão salvos.");
        if (confirmCancel) {
            this.clearAll();
            app.navigate('test-selection');
        }
    },

    finishTest() {
        this.clearAll();
        
        // Save to global state to show in summary
        app.state.testTime = app.state.test.id === '30sSTS' ? 30 : 15;
        app.state.testReps = this.reps;
        
        app.navigate('test-summary');
    },

    clearAll() {
        clearInterval(this.timer);
        clearInterval(this.statusInterval);
    }
};
