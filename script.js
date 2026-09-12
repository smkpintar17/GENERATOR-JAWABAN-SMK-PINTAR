document.addEventListener("DOMContentLoaded", () => {
    const namaInput = document.getElementById("namaSiswa");
    const waktuInput = document.getElementById("waktuPengerjaan");
    const btnPreview = document.getElementById("btnPreview");
    const btnDownload = document.getElementById("btnDownload");
    const canvas = document.getElementById("resultCanvas");
    const ctx = canvas.getContext("2d");

    // --- KUNCI JAWABAN (Bisa Diatur) ---
    const kunciJawaban = [
        ["javascript", "js", "html", "css"],
        ["https", "http"],
        ["mysql", "postgresql", "postgres", "mongodb"],
        ["commit", "push", "git commit"],
        ["css", "cascading style sheets"],
        ["gcp", "google cloud", "google cloud platform"],
        ["json", "javascript object notation"],
        ["bootstrap", "tailwind", "tailwind css"],
        ["node", "nodejs", "node.js"],
        ["github", "gitlab", "bitbucket"]
    ];

    // Data awal untuk simulasi
    namaInput.value = "Budi Santoso";
    waktuInput.value = "4"; // Default 4 menit (Cepat & Bagus)
    const sampelJawaban = [
        "JavaScript", "HTTPS", "MySQL", "Commit", "CSS", 
        "GCP", "JSON", "Tailwind", "NodeJS", "GitHub"
    ];
    for (let i = 1; i <= 10; i++) {
        document.getElementById(`j${i}`).value = sampelJawaban[i - 1];
    }

    // Fungsi menggambar bintang 5 sudut di Canvas
    function drawStar(cx, cy, spikes, outerRadius, innerRadius, fillStyle) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();

        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.strokeStyle = "#b38600";
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Evaluasi Jawaban, Kecepatan, Grade, dan Bintang
    function hitungEvaluasi() {
        let totalBenar = 0;
        const hasilEvaluasi = [];

        // 1. Evaluasi Kualitas Jawaban
        for (let i = 1; i <= 10; i++) {
            const inputUser = document.getElementById(`j${i}`).value.trim().toLowerCase();
            const opsiKunci = kunciJawaban[i - 1];
            const isCorrect = opsiKunci.some(kunci => inputUser.includes(kunci));

            if (isCorrect && inputUser !== "") {
                totalBenar++;
                hasilEvaluasi.push({ jawaban: document.getElementById(`j${i}`).value.trim(), status: true });
            } else {
                hasilEvaluasi.push({ jawaban: document.getElementById(`j${i}`).value.trim(), status: false });
            }
        }

        // 2. Evaluasi Bintang berdasarkan Jawaban Bagus (1 Bintang per Jawaban)
        let bintangJawaban = totalBenar; // 0 - 10 Bintang

        // 3. Evaluasi Kecepatan Waktu Pengerjaan (Menit)
        const waktuPengerjaan = parseInt(waktuInput.value) || 10;
        let kualifikasiWaktu = "Sedang";
        let bonusBintangWaktu = 0;

        if (waktuPengerjaan <= 3) {
            kualifikasiWaktu = "Sangat Cepat ⚡⚡";
            bonusBintangWaktu = 2;
        } else if (waktuPengerjaan <= 6) {
            kualifikasiWaktu = "Cepat ⚡";
            bonusBintangWaktu = 1;
        } else if (waktuPengerjaan <= 10) {
            kualifikasiWaktu = "Standar ⏱️";
            bonusBintangWaktu = 0;
        } else {
            kualifikasiWaktu = "Lambat 🐢";
            bonusBintangWaktu = -1;
        }

        // Total Bintang Gabungan (Maksimal 10 Bintang)
        let totalBintang = Math.min(10, Math.max(0, bintangJawaban + bonusBintangWaktu));

        // 4. Penentuan Grade & Predikat berdasarkan Total Bintang
        let grade = "C";
        let predikat = "SATISFACTORY";
        let warnaGrade = "#ff9800";

        if (totalBintang >= 10) {
            grade = "S+";
            predikat = "SUMMA CUM LAUDE";
            warnaGrade = "#00e676";
        } else if (totalBintang >= 9) {
            grade = "S";
            predikat = "EXCELLENT";
            warnaGrade = "#00e676";
        } else if (totalBintang >= 7) {
            grade = "A";
            predikat = "VERY GOOD";
            warnaGrade = "#29b6f6";
        } else if (totalBintang >= 5) {
            grade = "B";
            predikat = "GOOD";
            warnaGrade = "#ffca28";
        } else if (totalBintang >= 3) {
            grade = "C";
            predikat = "SATISFACTORY";
            warnaGrade = "#ffa726";
        } else {
            grade = "D";
            predikat = "NEEDS IMPROVEMENT";
            warnaGrade = "#e50914";
        }

        return {
            totalBenar,
            hasilEvaluasi,
            waktuPengerjaan,
            kualifikasiWaktu,
            totalBintang,
            grade,
            predikat,
            warnaGrade
        };
    }

    // Fungsi Menggambar Ke Canvas
    function renderCanvas() {
        const evalData = hitungEvaluasi();

        // 1. Background Canvas Hitam Pekat
        ctx.fillStyle = "#0d0d0d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Border Outer Merah
        ctx.strokeStyle = "#e50914";
        ctx.lineWidth = 12;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // Frame Inner Tipis
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 2;
        ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

        // 3. Header Text
        ctx.fillStyle = "#e50914";
        ctx.font = "bold 30px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("LEMBAR EVALUASI & GRADUASI SISWA", canvas.width / 2, 75);

        // Garis Pembatas Header
        ctx.strokeStyle = "#e50914";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(60, 95);
        ctx.lineTo(canvas.width - 60, 95);
        ctx.stroke();

        // 4. Info Nama, Waktu & Tanggal
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 20px 'Segoe UI', sans-serif";
        const namaSiswa = namaInput.value.trim() || "NAMA TIDAK DIISI";
        ctx.fillText(`NAMA SISWA : ${namaSiswa.toUpperCase()}`, 60, 135);

        ctx.fillStyle = "#a0a0a0";
        ctx.font = "15px 'Segoe UI', sans-serif";
        ctx.fillText(`Waktu Pengerjaan : ${evalData.waktuPengerjaan} Menit (${evalData.kualifikasiWaktu})`, 60, 162);

        const today = new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        ctx.font = "italic 14px 'Segoe UI', sans-serif";
        ctx.fillText(`Tanggal Evaluasi : ${today}`, 60, 185);

        // 5. BADGE GRADE AKHIR (Pojok Kanan Atas)
        ctx.fillStyle = "#1e1e1e";
        ctx.fillRect(canvas.width - 230, 110, 170, 85);
        ctx.strokeStyle = evalData.warnaGrade;
        ctx.lineWidth = 3;
        ctx.strokeRect(canvas.width - 230, 110, 170, 85);

        ctx.textAlign = "center";
        ctx.fillStyle = "#a0a0a0";
        ctx.font = "bold 11px 'Segoe UI', sans-serif";
        ctx.fillText("GRADE EVALUASI", canvas.width - 145, 128);

        ctx.fillStyle = evalData.warnaGrade;
        ctx.font = "bold 36px 'Segoe UI', sans-serif";
        ctx.fillText(evalData.grade, canvas.width - 145, 163);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px 'Segoe UI', sans-serif";
        ctx.fillText(evalData.predikat, canvas.width - 145, 182);

        // 6. RENDER 10 BINTANG MAKSIMAL
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffc107";
        ctx.font = "bold 15px 'Segoe UI', sans-serif";
        ctx.fillText("PENCAPAIAN BINTANG (MAX 10 ⭐):", 60, 225);

        const startXStar = 350;
        const startYStar = 220;
        const gapStar = 38;

        for (let s = 1; s <= 10; s++) {
            const posX = startXStar + (s - 1) * gapStar;
            const fill = s <= evalData.totalBintang ? "#ffc107" : "#333333";
            drawStar(posX, startYStar, 5, 14, 7, fill);
        }

        // 7. Render 10 Jawaban + Status Koreksi
        let startY = 280;
        const lineHeight = 65;

        for (let i = 0; i < 10; i++) {
            const item = evalData.hasilEvaluasi[i];
            const textJawaban = item.jawaban || "(Kosong)";

            // Box Background Jawaban
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(60, startY - 22, canvas.width - 120, 48);
            
            ctx.strokeStyle = item.status ? "#00e676" : "#3a1a1a";
            ctx.lineWidth = 1;
            ctx.strokeRect(60, startY - 22, canvas.width - 120, 48);

            // Nomor Jawaban
            ctx.textAlign = "left";
            ctx.fillStyle = "#e50914";
            ctx.font = "bold 18px 'Segoe UI', sans-serif";
            ctx.fillText(`${i + 1}.`, 75, startY + 8);

            // Teks Jawaban (Putih)
            ctx.fillStyle = "#f5f5f5";
            ctx.font = "17px 'Segoe UI', sans-serif";
            let truncatedText = textJawaban;
            if (truncatedText.length > 42) {
                truncatedText = truncatedText.substring(0, 39) + "...";
            }
            ctx.fillText(truncatedText, 110, startY + 8);

            // Status Kualitas Jawaban di Sisi Kanan Box
            ctx.textAlign = "right";
            if (item.status) {
                ctx.fillStyle = "#00e676";
                ctx.font = "bold 15px 'Segoe UI', sans-serif";
                ctx.fillText("✓ BAGUS (1⭐)", canvas.width - 80, startY + 8);
            } else {
                ctx.fillStyle = "#e50914";
                ctx.font = "bold 15px 'Segoe UI', sans-serif";
                ctx.fillText("✗ KURANG (0⭐)", canvas.width - 80, startY + 8);
            }

            startY += lineHeight;
        }

        // 8. Ringkasan & Footer
        ctx.textAlign = "center";
        ctx.fillStyle = "#a0a0a0";
        ctx.font = "bold 16px 'Segoe UI', sans-serif";
        ctx.fillText(`Total Perolehan: ${evalData.totalBintang} / 10 Bintang (${evalData.totalBenar} Jawaban Bagus + Bonus Kecepatan)`, canvas.width / 2, canvas.height - 70);

        ctx.fillStyle = "#555555";
        ctx.font = "13px 'Segoe UI', sans-serif";
        ctx.fillText("Generated Automatically with Grade & Star Evaluation System", canvas.width / 2, canvas.height - 40);
    }

    // Fungsi Download JPG
    function downloadJPG() {
        renderCanvas();
        const imageURI = canvas.toDataURL("image/jpeg", 0.95);

        const rawNama = namaInput.value.trim() || "Siswa";
        const cleanNama = rawNama.replace(/[^a-zA-Z0-9]/g, "_");

        const link = document.createElement("a");
        link.download = `Graduasi_Grade_${cleanNama}.jpg`;
        link.href = imageURI;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event Listener
    btnPreview.addEventListener("click", renderCanvas);
    btnDownload.addEventListener("click", downloadJPG);

    // Initial Render
    renderCanvas();
});
