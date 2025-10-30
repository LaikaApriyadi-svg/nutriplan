document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculate-btn');
    calculateBtn.addEventListener('click', calculateNutrition);
});

function calculateNutrition() {
    // 1. Ambil nilai dari semua input form
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

    // 2. Tentukan Multiplier Aktivitas (PAL - Physical Activity Level)
    let activityMultiplier = 0;
    switch (activity) {
        case 'sedentary': activityMultiplier = 1.2; break;
        case 'light': activityMultiplier = 1.375; break;
        case 'moderate': activityMultiplier = 1.55; break;
        case 'active': activityMultiplier = 1.725; break;
        case 'very_active': activityMultiplier = 1.9; break;
    }

    // 3. Hitung BMR (Basal Metabolic Rate) - Rumus Mifflin-St Jeor
    let bmr = 0;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else { // female
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // 4. Hitung TDEE (Total Daily Energy Expenditure)
    let tdee = bmr * activityMultiplier;

    // 5. Sesuaikan TDEE berdasarkan Tujuan Diet (Kalori Final)
    let finalCalories = tdee;
    let goalAdjustment = '';
    let goalDescription = '';

    switch (goal) {
        case 'maintain':
            goalDescription = 'Mempertahankan Berat Badan';
            break;
        case 'mild_loss':
            finalCalories -= 300; 
            goalAdjustment = 'Defisit 300 Kalori';
            goalDescription = 'Penurunan Berat Badan Ringan';
            break;
        case 'fast_loss':
            finalCalories -= 500; 
            goalAdjustment = 'Defisit 500 Kalori';
            goalDescription = 'Penurunan Berat Badan Cepat';
            break;
        case 'gain':
            finalCalories += 300;
            goalAdjustment = 'Surplus 300 Kalori';
            goalDescription = 'Penambahan Berat Badan';
            break;
    }
    
    // Safety net: Batasan Kalori
    if (finalCalories < 1200 && gender === 'female') finalCalories = 1200;
    if (finalCalories < 1500 && gender === 'male') finalCalories = 1500;


    // 6. Hitung Makronutrien (Distribusi: Protein 30%, Lemak 25%, Karbohidrat 45%)
    // Protein/Karbo = 4 Kal/g; Lemak = 9 Kal/g
    
    const proteinGrams = Math.round((finalCalories * 0.30) / 4);
    const fatGrams = Math.round((finalCalories * 0.25) / 9);
    const carbGrams = Math.round((finalCalories * 0.45) / 4);

    // 7. Tampilkan Hasil (Menggunakan styling class dari CSS)
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
