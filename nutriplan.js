document.getElementById('calculate-btn').addEventListener('click', calculateNutrition);

function calculateNutrition() {
    // 1. Ambil nilai dari input
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activity = document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;

    // Validasi input
    if (!gender || !age || !weight || !height || !activity) {
        alert('Mohon lengkapi semua data diri dan aktivitas.');
        return;
    }

    // 2. Tentukan Multiplier Aktivitas
    let activityMultiplier = 0;
    switch (activity) {
        case 'sedentary': activityMultiplier = 1.2; break;
        case 'light': activityMultiplier = 1.375; break;
        case 'moderate': activityMultiplier = 1.55; break;
        case 'active': activityMultiplier = 1.725; break;
        case 'very_active': activityMultiplier = 1.9; break;
    }

    // 3. Hitung BMR (Menggunakan rumus Mifflin-St Jeor - yang paling akurat)
    let bmr = 0;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else { // female
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // 4. Hitung TDEE (Total Daily Energy Expenditure)
    let tdee = bmr * activityMultiplier;

    // 5. Sesuaikan TDEE berdasarkan Tujuan Diet
    let finalCalories = tdee;
    let goalDescription = '';

    switch (goal) {
        case 'maintain':
            // Tidak ada perubahan
            goalDescription = `Untuk mempertahankan berat badan, perkiraan kebutuhan kalori harian Anda adalah **${Math.round(finalCalories)} Kalori**.`;
            break;
        case 'mild_loss':
            finalCalories -= 250; // Defisit ringan
            goalDescription = `Untuk penurunan berat badan ringan, target kalori harian Anda adalah **${Math.round(finalCalories)} Kalori** (Defisit 250 Kalori).`;
            break;
        case 'fast_loss':
            finalCalories -= 500; // Defisit cepat
            goalDescription = `Untuk penurunan berat badan cepat, target kalori harian Anda adalah **${Math.round(finalCalories)} Kalori** (Defisit 500 Kalori).`;
            break;
        case 'gain':
            finalCalories += 300; // Surplus
            goalDescription = `Untuk penambahan berat badan, target kalori harian Anda adalah **${Math.round(finalCalories)} Kalori** (Surplus 300 Kalori).`;
            break;
    }
    
    // Pastikan kalori tidak terlalu rendah
    if (finalCalories < 1200 && gender === 'female') finalCalories = 1200;
    if (finalCalories < 1500 && gender === 'male') finalCalories = 1500;


    // 6. Hitung Makronutrien (Contoh distribusi)
    // Asumsi: Protein 30%, Lemak 25%, Karbohidrat 45% dari Total Kalori
    // Protein: 4 Kalori/gram, Karbo: 4 Kalori/gram, Lemak: 9 Kalori/gram
    
    const proteinGrams = Math.round((finalCalories * 0.30) / 4);
    const fatGrams = Math.round((finalCalories * 0.25) / 9);
    const carbGrams = Math.round((finalCalories * 0.45) / 4);


    // 7. Tampilkan Hasil di Kolom Kanan
    const resultHtml = `
        <p>${goalDescription}</p>
        
        <h3>Rincian Makronutrien Harian (Estimasi)</h3>
        <ul>
            <li>**Kalori Target:** ${Math.round(finalCalories)} Kalori</li>
            <li>**Protein:** ${proteinGrams} gram</li>
            <li>**Lemak:** ${fatGrams} gram</li>
            <li>**Karbohidrat:** ${carbGrams} gram</li>
        </ul>

        <p class="disclaimer">BMR Anda: ${Math.round(bmr)} Kalori. TDEE Anda: ${Math.round(tdee)} Kalori. Perhitungan Makro ini hanya estimasi, sesuaikan dengan preferensi diet Anda.</p>
    `;

    document.getElementById('calculation-result').innerHTML = resultHtml;
}