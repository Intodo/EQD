// LQ Calculator - BED & EQD2 Calculator
class LQCalculator {
    constructor() {
        this.currentAlphaBeta = 10;
        this.schedules = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSchedules();
        this.updateAlphaBetaDisplay();
    }

    setupEventListeners() {
        // Alpha/Beta preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setAlphaBeta(parseFloat(e.target.dataset.value));
            });
        });

        // Custom alpha/beta input
        const customInput = document.getElementById('custom-alpha-beta');
        customInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (value > 0) {
                this.setAlphaBeta(value);
            }
        });

        // Calculate button
        document.getElementById('calculate-btn').addEventListener('click', () => {
            this.calculate();
        });

        // Schedule active checkboxes
        document.querySelectorAll('.schedule-active').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const scheduleCard = e.target.closest('.schedule-card');
                if (e.target.checked) {
                    scheduleCard.classList.add('active');
                } else {
                    scheduleCard.classList.remove('active');
                }
            });
        });

        // Fraction preset buttons
        document.querySelectorAll('.fraction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fractions = parseInt(e.target.dataset.fractions);
                const schedule = e.target.dataset.schedule;
                const fractionsInput = document.getElementById(`fractions${schedule}`);
                const dosePerFractionInput = document.getElementById(`dose-per-fraction${schedule}`);
                const doseInput = document.getElementById(`dose${schedule}`);
                
                fractionsInput.value = fractions;
                
                // Update active state of fraction buttons
                document.querySelectorAll(`.fraction-btn[data-schedule="${schedule}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Recalculate total dose if dose per fraction is set
                const dosePerFraction = parseFloat(dosePerFractionInput.value) || 0;
                if (dosePerFraction > 0) {
                    const totalDose = dosePerFraction * fractions;
                    doseInput.value = totalDose.toFixed(1);
                }
                
                // Trigger calculation
                this.calculate();
            });
        });

        // Dose per fraction preset buttons
        document.querySelectorAll('.dose-per-fraction-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dosePerFraction = parseFloat(e.target.dataset.dose);
                const schedule = e.target.dataset.schedule;
                const dosePerFractionInput = document.getElementById(`dose-per-fraction${schedule}`);
                const fractionsInput = document.getElementById(`fractions${schedule}`);
                const doseInput = document.getElementById(`dose${schedule}`);
                
                dosePerFractionInput.value = dosePerFraction;
                
                // Update active state of dose per fraction buttons
                document.querySelectorAll(`.dose-per-fraction-btn[data-schedule="${schedule}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Recalculate total dose if fractions is set
                const fractions = parseFloat(fractionsInput.value) || 0;
                if (fractions > 0) {
                    const totalDose = dosePerFraction * fractions;
                    doseInput.value = totalDose.toFixed(1);
                }
                
                // Trigger calculation
                this.calculate();
            });
        });

        // Auto-calculate on input changes
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => {
                // Debounce the calculation
                clearTimeout(this.calculationTimeout);
                this.calculationTimeout = setTimeout(() => {
                    this.calculate();
                }, 500);
            });
        });

        // Handle dose per fraction auto-calculation
        this.setupDosePerFractionCalculation();
    }

    setupDosePerFractionCalculation() {
        for (let i = 1; i <= 3; i++) {
            const doseInput = document.getElementById(`dose${i}`);
            const fractionsInput = document.getElementById(`fractions${i}`);
            const dosePerFractionInput = document.getElementById(`dose-per-fraction${i}`);

            // Auto-calculate dose per fraction when total dose and fractions change
            [doseInput, fractionsInput].forEach(input => {
                input.addEventListener('input', () => {
                    const dose = parseFloat(doseInput.value) || 0;
                    const fractions = parseFloat(fractionsInput.value) || 0;
                    if (dose > 0 && fractions > 0) {
                        const dosePerFraction = dose / fractions;
                        dosePerFractionInput.value = dosePerFraction.toFixed(2);
                    }
                });
            });

            // Auto-calculate total dose when dose per fraction and fractions change
            [dosePerFractionInput, fractionsInput].forEach(input => {
                input.addEventListener('input', () => {
                    const dosePerFraction = parseFloat(dosePerFractionInput.value) || 0;
                    const fractions = parseFloat(fractionsInput.value) || 0;
                    if (dosePerFraction > 0 && fractions > 0) {
                        const totalDose = dosePerFraction * fractions;
                        doseInput.value = totalDose.toFixed(1);
                    }
                });
            });

            // Also trigger calculation when any input changes
            [doseInput, fractionsInput, dosePerFractionInput].forEach(input => {
                input.addEventListener('input', () => {
                    this.calculate();
                    
                    // Update active fraction button if fractions input changed
                    if (input === fractionsInput) {
                        const fractions = parseInt(input.value) || 0;
                        const fractionButtons = document.querySelectorAll(`.fraction-btn[data-schedule="${i}"]`);
                        fractionButtons.forEach(btn => {
                            btn.classList.remove('active');
                            if (parseInt(btn.dataset.fractions) === fractions) {
                                btn.classList.add('active');
                            }
                        });
                    }
                    
                    // Update active dose per fraction button if dose per fraction input changed
                    if (input === dosePerFractionInput) {
                        const dosePerFraction = parseFloat(input.value) || 0;
                        const dosePerFractionButtons = document.querySelectorAll(`.dose-per-fraction-btn[data-schedule="${i}"]`);
                        dosePerFractionButtons.forEach(btn => {
                            btn.classList.remove('active');
                            if (parseFloat(btn.dataset.dose) === dosePerFraction) {
                                btn.classList.add('active');
                            }
                        });
                    }
                });
            });
        }
    }

    setAlphaBeta(value) {
        this.currentAlphaBeta = value;
        
        // Update preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.value) === value) {
                btn.classList.add('active');
            }
        });

        // Update custom input
        document.getElementById('custom-alpha-beta').value = value;
        
        this.updateAlphaBetaDisplay();
        this.calculate();
    }

    updateAlphaBetaDisplay() {
        document.getElementById('current-alpha-beta').textContent = this.currentAlphaBeta;
    }

    initializeSchedules() {
        this.schedules = [];
        for (let i = 1; i <= 3; i++) {
            this.schedules.push({
                id: i,
                active: i <= 2, // First two schedules active by default
                dose: 0,
                fractions: 0,
                dosePerFraction: 0
            });
        }
    }

    getScheduleData() {
        const activeSchedules = [];
        
        for (let i = 1; i <= 3; i++) {
            const isActive = document.querySelector(`input[data-schedule="${i}"]`)?.checked || 
                           document.querySelector(`.schedule-card[data-schedule="${i}"] .schedule-active`).checked;
            
            if (isActive) {
                const dose = parseFloat(document.getElementById(`dose${i}`).value) || 0;
                const fractions = parseFloat(document.getElementById(`fractions${i}`).value) || 0;
                const dosePerFraction = parseFloat(document.getElementById(`dose-per-fraction${i}`).value) || 0;

                if (dose > 0 && fractions > 0) {
                    activeSchedules.push({
                        id: i,
                        dose: dose,
                        fractions: fractions,
                        dosePerFraction: dosePerFraction > 0 ? dosePerFraction : dose / fractions
                    });
                }
            }
        }
        
        return activeSchedules;
    }

    calculateBED(dose, dosePerFraction, alphaBeta) {
        // BED = D * (1 + d/(α/β))
        // where D = total dose, d = dose per fraction, α/β = alpha/beta ratio
        return dose * (1 + dosePerFraction / alphaBeta);
    }

    calculateEQD2(bed, alphaBeta) {
        // EQD2 = BED / (1 + 2/α/β)
        // This gives the equivalent dose in 2 Gy fractions
        return bed / (1 + 2 / alphaBeta);
    }

    calculate() {
        const activeSchedules = this.getScheduleData();
        
        if (activeSchedules.length === 0) {
            this.clearResults();
            return;
        }

        const individualResults = [];
        let totalBED = 0;
        let totalDose = 0;
        let totalFractions = 0;

        // Calculate individual schedule results
        activeSchedules.forEach(schedule => {
            const bed = this.calculateBED(schedule.dose, schedule.dosePerFraction, this.currentAlphaBeta);
            const eqd2 = this.calculateEQD2(bed, this.currentAlphaBeta);
            
            individualResults.push({
                scheduleId: schedule.id,
                dose: schedule.dose,
                fractions: schedule.fractions,
                dosePerFraction: schedule.dosePerFraction,
                bed: bed,
                eqd2: eqd2
            });

            totalBED += bed;
            totalDose += schedule.dose;
            totalFractions += schedule.fractions;
        });

        // Calculate combined results
        const totalEQD2 = this.calculateEQD2(totalBED, this.currentAlphaBeta);

        this.displayResults(individualResults, {
            totalBED: totalBED,
            totalEQD2: totalEQD2,
            totalDose: totalDose,
            totalFractions: totalFractions
        });
    }

    displayResults(individualResults, combinedResults) {
        // Display individual results
        const individualContainer = document.getElementById('individual-results');
        individualContainer.innerHTML = '';

        individualResults.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'result-item';
            resultElement.innerHTML = `
                <div>
                    <strong>Schedule ${result.scheduleId}</strong><br>
                    <small>${result.dose} Gy / ${result.fractions} fx (${result.dosePerFraction.toFixed(2)} Gy/fx)</small>
                </div>
                <div style="text-align: right;">
                    <div>EQD2: <strong>${result.eqd2.toFixed(1)}</strong></div>
                    <div>BED: <strong>${result.bed.toFixed(1)}</strong></div>
                </div>
            `;
            individualContainer.appendChild(resultElement);
        });

        // Display combined results
        document.getElementById('total-bed').textContent = combinedResults.totalBED.toFixed(1);
        document.getElementById('total-eqd2').textContent = combinedResults.totalEQD2.toFixed(1);
        document.getElementById('total-dose').textContent = combinedResults.totalDose.toFixed(1);
        document.getElementById('total-fractions').textContent = combinedResults.totalFractions.toFixed(0);
    }

    clearResults() {
        document.getElementById('individual-results').innerHTML = '';
        document.getElementById('total-bed').textContent = '-';
        document.getElementById('total-eqd2').textContent = '-';
        document.getElementById('total-dose').textContent = '-';
        document.getElementById('total-fractions').textContent = '-';
    }

    // Utility function to format numbers
    formatNumber(num, decimals = 1) {
        return parseFloat(num).toFixed(decimals);
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new LQCalculator();
    
    // Add some sample data for demonstration
    setTimeout(() => {
        document.getElementById('dose1').value = '60';
        document.getElementById('fractions1').value = '30';
        document.getElementById('dose-per-fraction1').value = '2.0';
        
        // Set default values for schedule 2
        document.getElementById('dose2').value = '50';
        document.getElementById('fractions2').value = '25';
        document.getElementById('dose-per-fraction2').value = '2.0';
        
        // Set active fraction buttons
        document.querySelector('.fraction-btn[data-fractions="30"][data-schedule="1"]').classList.add('active');
        document.querySelector('.fraction-btn[data-fractions="25"][data-schedule="2"]').classList.add('active');
        
        // Set active dose per fraction buttons
        document.querySelector('.dose-per-fraction-btn[data-dose="2"][data-schedule="1"]').classList.add('active');
        document.querySelector('.dose-per-fraction-btn[data-dose="2"][data-schedule="2"]').classList.add('active');
        
        calculator.calculate();
    }, 100);

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    calculator.calculate();
                    break;
                case '1':
                case '2':
                case '3':
                    e.preventDefault();
                    const scheduleNum = parseInt(e.key);
                    const checkbox = document.querySelector(`.schedule-card[data-schedule="${scheduleNum}"] .schedule-active`);
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                    break;
            }
        }
    });

    // Add touch support for mobile devices
    if ('ontouchstart' in window) {
        document.querySelectorAll('.preset-btn, .calculate-button').forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    // Add service worker for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

// Add some helpful tooltips and validation
document.addEventListener('DOMContentLoaded', () => {
    // Add input validation
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('blur', () => {
            const value = parseFloat(input.value);
            if (value < 0) {
                input.value = 0;
            }
        });
    });

    // Add helpful hints
    const hints = {
        'dose1': 'Enter the total prescribed dose in Gray (Gy)',
        'fractions1': 'Enter the number of treatment fractions',
        'dose-per-fraction1': 'Enter the dose per fraction in Gray (Gy)'
    };

    Object.keys(hints).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.title = hints[id];
        }
    });
});
