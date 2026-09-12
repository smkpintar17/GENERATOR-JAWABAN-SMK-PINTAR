document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMEN DOM ---
    const quizForm = document.getElementById("quizForm");
    const namaInput = document.getElementById("namaSiswa");
    const btnPreview = document.getElementById("btnPreview");
    const btnDownload = document.getElementById("btnDownload");
    const canvas = document.getElementById("resultCanvas");
    const ctx = canvas.getContext("2d");

    // --- KUNCI JAWABAN & BOBOT ---
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

    // 1. Fungsi Konversi Skor Ke Jumlah Bintang (Max 10) & Grade
    function kalkulasiGradeDanBintang() {
        let totalPoin = 0;

        for (let i = 1; i <= 10; i++) {
            const jawabanText = document.getElementById(`j${i}`).value.toLowerCase().trim();
            const keywords = keywordsSoal[i - 1];

            if (jawabanText.length > 0) {
                let matchCount = 0;
                keywords.forEach(kw => {
                    if (jawabanText.includes(kw)) matchCount++;
                });

                // Perolehan bintang per soal (0 atau 1 bintang)
                if (matchCount >= 1 || jawabanText.length > 20) {
                    totalPoin += 1;
                }
            }
        }

        const jumlahBintang = totalPoin; // 0 hingga 10 Bintang
        let grade = "E";

        if (jumlahBintang >= 9) grade = "A";
        else if (jumlahBintang >= 7) grade = "B";
        else if (jumlahBintang >= 5) grade = "C";
        else if (jumlahBintang >= 3) grade = "D";

        return { jumlahBintang, grade };
    }

    // 2. Render Lembar Hasil ke Canvas HTML5 (Tema Merah & Hitam)
    function renderCanvas(nama, bintang, grade) {
        // Clear Canvas
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border Outer (Hitam)
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Header Background (Merah)
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(20, 20, canvas.width - 40, 100);

        // Header Title (Putih)
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("HASIL EVALUASI PEMROGRAMAN WEB", canvas.width / 2, 60);
        ctx.font = "14px sans-serif";
        ctx.fillText("Laporan Penilaian & Rekapitulasi Jawaban Siswa", canvas.width / 2, 85);

        // Metadata Siswa (Hitam)
        ctx.textAlign = "left";
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`Nama Siswa : ${nama || "Tanpa Nama"}`, 40, 150);

        // Render Rating Bintang (Maksimal 10 Bintang)
        ctx.fillText(`Rating     : `, 40, 180);
        let starStr = "";
        for (let b = 0; b < 10; b++) {
            starStr += b < bintang ? "★ " : "☆ ";
        }
        ctx.fillStyle = "#dc2626"; // Bintang warna Merah
        ctx.font = "bold 18px sans-serif";
        ctx.fillText(starStr, 130, 180);

        // Render Grade (Hitam-Merah)
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`Grade      : `, 40, 210);
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText(grade, 130, 212);

        // Garis Pembatas (Merah)
        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, 230);
        ctx.lineTo(canvas.width - 40, 230);
        ctx.stroke();

        // Render List Jawaban
        let currentY = 260;

        for (let i = 1; i <= 10; i++) {
            const val = document.getElementById(`j${i}`).value.trim() || "- Tidak diisi -";
            const truncatedVal = val.length > 85 ? val.substring(0, 82) + "..." : val;

            // Judul Soal (Hitam)
            ctx.fillStyle = "#000000";
            ctx.font = "bold 12px sans-serif";
            ctx.fillText(`Soal ${i}:`, 40, currentY);

            // Teks Jawaban (Merah Gelap)
            ctx.fillStyle = "#7f1d1d";
            ctx.font = "italic 12px sans-serif";
            ctx.fillText(`"${truncatedVal}"`, 100, currentY);

            currentY += 75; // Jarak antar soal
        }

        // Footer Stamp (Hitam)
        ctx.fillStyle = "#000000";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Generated automatically by Web Evaluation System", canvas.width / 2, canvas.height - 30);
    }

    // --- EVENT LISTENERS ---

    // Event Klik "Hitung Nilai & Preview"
    btnPreview.addEventListener("click", () => {
        const nama = namaInput.value.trim();
        if (!nama) {
            alert("Harap isi Nama Peserta Didik terlebih dahulu!");
            namaInput.focus();
            return;
        }

        const { jumlahBintang, grade } = kalkulasiGradeDanBintang();

        // Gambar ke Canvas
        renderCanvas(nama, jumlahBintang, grade);
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

        const fileName = `Hasil_Ujian_${nama.replace(/\s+/g, "_")}.jpg`;
        link.download = fileName;
        link.href = imageURI;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
