document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMEN DOM ---
    const quizForm = document.getElementById("quizForm");
    const namaInput = document.getElementById("namaSiswa");
    const btnPreview = document.getElementById("btnPreview");
    const btnDownload = document.getElementById("btnDownload");
    const canvas = document.getElementById("resultCanvas");
    const ctx = canvas.getContext("2d");

    // --- VARIABEL TIMER ---
    let detikPengerjaan = 0;
    let timerInterval = null;

    // --- KUNCI JAWABAN & BOBOT ---
    // Menggunakan kata kunci penting untuk penilaian otomatis sederhana (skor total: 100)
    const keywordsSoal = [
        ["struktur", "semantik", "elemen", "aksesibilitas", "seo"],            // Soal 1
        ["visual", "usability", "tampilan", "layout", "pengguna", "style"],   // Soal 2
        ["interaktif", "dinamis", "event", "logika", "dom"],                   // Soal 3
        ["dom", "element", "eventlistener", "click", "toggle", "innerhtml"],  // Soal 4
        ["versi", "history", "kolaborasi", "lacak", "branch", "repositori"],   // Soal 5
        ["lokal", "remote", "simpan", "unggah", "server", "github"],           // Soal 6
        ["deployment", "otomatis", "build", "ci/cd", "github", "integrasi"],  // Soal 7
        ["add", "commit", "push", "main", "deploy", "vercel"],                 // Soal 8
        ["path", "conflict", "env", "cors", "build", "error"],                // Soal 9
        ["mobile-first", "modular", "clean code", "testing", "branch"]        // Soal 10
    ];

    // 1. Inisialisasi Timer Stopwatch
    function startTimer() {
        timerInterval = setInterval(() => {
            detikPengerjaan++;
        }, 1000);
    }

    // Format detik ke format HH:MM:SS atau MM:SS
    function formatWaktu(detikTotal) {
        const jam = Math.floor(detikTotal / 3600);
        const menit = Math.floor((detikTotal % 3600) / 60);
        const detik = detikTotal % 60;

        const pad = (num) => String(num).padStart(2, "0");
        return jam > 0 ? `${pad(jam)}:${pad(menit)}:${pad(detik)}` : `${pad(menit)}:${pad(detik)}`;
    }

    // 2. Fungsi Hitung Nilai
    function hitungNilai() {
        let totalSkor = 0;

        for (let i = 1; i <= 10; i++) {
            const jawabanText = document.getElementById(`j${i}`).value.toLowerCase().trim();
            const keywords = keywordsSoal[i - 1];

            if (jawabanText.length > 0) {
                // Hitung berapa kata kunci yang cocok dalam jawaban
                let matchCount = 0;
                keywords.forEach(kw => {
                    if (jawabanText.includes(kw)) matchCount++;
                });

                // Setiap soal memiliki bobot maksimal 10 poin
                if (matchCount >= 2 || jawabanText.length > 50) {
                    totalSkor += 10; // Jawaban sangat lengkap
                } else if (matchCount === 1 || jawabanText.length > 15) {
                    totalSkor += 6;  // Jawaban cukup
                } else {
                    totalSkor += 3;  // Jawaban singkat
                }
            }
        }
        return totalSkor;
    }

    // 3. Render Lembar Hasil ke Canvas HTML5
    function renderCanvas(nama, skor, waktuStr) {
        // Clear Canvas
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border Outer
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Header Background
        ctx.fillStyle = "#2563eb";
        ctx.fillRect(20, 20, canvas.width - 40, 100);

        // Header Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HASIL EVALUASI PEMROGRAMAN WEB", canvas.width / 2, 60);
        ctx.font = "14px sans-serif";
        ctx.fillText("Laporan Penilaian & Rekapitulasi Jawaban Siswa", canvas.width / 2, 85);

        // Metadata Siswa
        ctx.textAlign = "left";
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`Nama Siswa : ${nama || "Tanpa Nama"}`, 40, 150);
        ctx.fillText(`Durasi     : ${waktuStr}`, 40, 175);
        ctx.fillText(`Nilai Total: ${skor} / 100`, 40, 200);

        // Garis Pembatas
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 215);
        ctx.lineTo(canvas.width - 40, 215);
        ctx.stroke();

        // Render List Jawaban Ringkas
        let currentY = 245;
        ctx.font = "12px sans-serif";

        for (let i = 1; i <= 10; i++) {
            const val = document.getElementById(`j${i}`).value.trim() || "- Tidak diisi -";
            const truncatedVal = val.length > 85 ? val.substring(0, 82) + "..." : val;

            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText(`Soal ${i}:`, 40, currentY);

            ctx.fillStyle = "#475569";
            ctx.font = "italic 12px sans-serif";
            ctx.fillText(`"${truncatedVal}"`, 100, currentY);

            currentY += 75; // Jarak antar soal
        }

        // Footer Stamp
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Generated automatically by Web Evaluation System", canvas.width / 2, canvas.height - 30);
    }

    // --- EVENT LISTENERS ---

    // Jalankan timer saat halaman dibuka
    startTimer();

    // Event Klik "Hitung Nilai & Preview"
    btnPreview.addEventListener("click", () => {
        const nama = namaInput.value.trim();
        if (!nama) {
            alert("Harap isi Nama Peserta Didik terlebih dahulu!");
            namaInput.focus();
            return;
        }

        // Hentikan timer saat tombol diproses
        if (timerInterval) clearInterval(timerInterval);

        const skor = hitungNilai();
        const waktuTerselesaikan = formatWaktu(detikPengerjaan);

        // Gambar ke Canvas
        renderCanvas(nama, skor, waktuTerselesaikan);
    });

    // Event Klik "Download (JPG)"
    btnDownload.addEventListener("click", () => {
        const nama = namaInput.value.trim();
        if (!nama) {
            alert("Harap isi nama dan klik 'Hitung Nilai & Preview' terlebih dahulu.");
            return;
        }

        // Konversi Canvas ke Data URL Image (JPG)
        const imageURI = canvas.toDataURL("image/jpeg", 0.9);
        const link = document.createElement("a");
        
        // Buat nama file berdasarkan nama siswa
        const fileName = `Hasil_Ujian_${nama.replace(/\s+/g, "_")}.jpg`;
        link.download = fileName;
        link.href = imageURI;
        
        // Memicu aksi unduh
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
