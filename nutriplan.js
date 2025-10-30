document.addEventListener('DOMContentLoaded', () => {
    
    // ------------------------------------
    // 1. LOGIKA KALKULATOR NUTRISI
    // ------------------------------------
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateNutrition);
    }

    function calculateNutrition() {
        const gender = document.getElementById('gender').value;
        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activity = document.getElementById('activity').value;
        const goal = document.getElementById('goal').value;

        const resultDiv = document.getElementById('calculation-result');

        // Validasi input dasar
        if (!gender || isNaN(age) || isNaN(weight) || isNaN(height) || !activity || age <= 0 || weight <= 0 || height <= 0) {
            resultDiv.innerHTML = '<p style="color: #e74c3c; font-weight: bold;">Mohon lengkapi semua data diri dengan angka yang valid.</p>';
            return;
        }

        // Hitung BMR (Mifflin-St Jeor)
        let bmr = 0;
        if (gender === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else { // female
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // TDEE
        let activityMultiplier = 0;
        switch (activity) {
            case 'sedentary': activityMultiplier = 1.2; break;
            case 'light': activityMultiplier = 1.375; break;
            case 'moderate': activityMultiplier = 1.55; break;
            case 'active': activityMultiplier = 1.725; break;
            case 'very_active': activityMultiplier = 1.9; break;
        }
        let tdee = bmr * activityMultiplier;

        // Sesuaikan Kalori berdasarkan Tujuan Diet
        let finalCalories = tdee;
        let goalAdjustment = '';
        let goalDescription = '';

        switch (goal) {
            case 'maintain': goalDescription = 'Mempertahankan Berat Badan'; break;
            case 'mild_loss': finalCalories -= 300; goalAdjustment = 'Defisit 300 Kalori'; goalDescription = 'Penurunan Berat Badan Ringan'; break;
            case 'fast_loss': finalCalories -= 500; goalAdjustment = 'Defisit 500 Kalori'; goalDescription = 'Penurunan Berat Badan Cepat'; break;
            case 'gain': finalCalories += 300; goalAdjustment = 'Surplus 300 Kalori'; goalDescription = 'Penambahan Berat Badan'; break;
        }
        
        if (finalCalories < 1200 && gender === 'female') finalCalories = 1200;
        if (finalCalories < 1500 && gender === 'male') finalCalories = 1500;

        // Hitung Makronutrien (Distribusi: Protein 30%, Lemak 25%, Karbohidrat 45%)
        const proteinGrams = Math.round((finalCalories * 0.30) / 4);
        const fatGrams = Math.round((finalCalories * 0.25) / 9);
        const carbGrams = Math.round((finalCalories * 0.45) / 4);

        // Tampilkan Hasil
        const resultHtml = `
            <div class="result-box">
                <p>Target Anda: **${goalDescription}**</p>
                <p class="final-calorie-label">Perkiraan Kebutuhan Kalori Harian:</p>
                <h3 class="final-calorie-value">${Math.round(finalCalories)} Kalori</h3>
                ${goalAdjustment ? `<p class="calorie-adjustment">(${goalAdjustment})</p>` : ''}
            </div>
            
            <h3 class="macro-title">Rincian Makronutrien Harian (Estimasi)</h3>
            <div class="macro-grid">
                <div class="macro-item">
                    <span class="macro-value">${proteinGrams}g</span>
                    <span class="macro-label">Protein</span>
                </div>
                <div class="macro-item">
                    <span class="macro-value">${carbGrams}g</span>
                    <span class="macro-label">Karbohidrat</span>
                </div>
                <div class="macro-item">
                    <span class="macro-value">${fatGrams}g</span>
                    <span class="macro-label">Lemak</span>
                </div>
            </div>
            
            <p class="disclaimer-small">
                *BMR Anda: ${Math.round(bmr)} Kalori. TDEE Anda: ${Math.round(tdee)} Kalori.
            </p>
        `;

        resultDiv.innerHTML = resultHtml;
    }

    // ------------------------------------
    // 2. LOGIKA TAB SWITCHER (Kalkulator, Rencana Makan, Log Makanan)
    // ------------------------------------
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const targetTab = e.target.getAttribute('data-tab');

            tabLinks.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');

            const panes = document.querySelectorAll('.tab-pane');
            panes.forEach(pane => {
                if (pane.id === targetTab) {
                    pane.classList.remove('hidden');
                } else {
                    pane.classList.add('hidden');
                }
            });
        });
    });


    // ------------------------------------
    // 3. LOGIKA PAGE SWITCHER (Navigasi Utama: Beranda, Resep, Tentang)
    // ------------------------------------
    const navLinks = document.querySelectorAll('.navbar .nav-link');
    const pageContents = document.querySelectorAll('.page-content');
    
    const switchPage = (targetId) => {
        pageContents.forEach(page => {
            if (page.id === targetId) {
                page.classList.remove('hidden');
                page.classList.add('active');
            } else {
                page.classList.add('hidden');
                page.classList.remove('active');
            }
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetPage = e.target.getAttribute('data-page');

            navLinks.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');

            let contentIdToShow = targetPage;
            
            if (targetPage === 'beranda' || targetPage === 'kalkulator' || targetPage === 'home') {
                 contentIdToShow = 'home';
            } else if (targetPage === 'log-main') {
                contentIdToShow = 'log-main'; 
            } else if (targetPage === 'resep') {
                contentIdToShow = 'resep'; 
            } else if (targetPage === 'tentang') {
                contentIdToShow = 'tentang'; 
            }

            switchPage(contentIdToShow);

            // Jika pindah ke Beranda/Kalkulator, pastikan tab Kalkulator sekunder yang aktif.
            if (contentIdToShow === 'home') {
                document.querySelector('.tabs a.tab-link[data-tab="kalkulator-tab"]').click();
            }
        });
    });
});
