// ===============================
// KONFIGURASI GOOGLE APPS SCRIPT
// ===============================
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw_XLpHZ_EgVEI2e9qGuoGTboU87nEmJVCS02kLix-4T22Bjd5TVzFDjVjge3V5RQfH/exec";

// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ppdbForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusBox = document.getElementById("status");

  if (!form) {
    console.warn("Form ppdbForm tidak ditemukan di halaman ini.");
    return;
  }

  // ===============================
  // SUBMIT FORM
  // ===============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Mengirim...";
    statusBox.innerHTML = "";

    try {
      const formData = new FormData(form);

      // ===============================
      // AMBIL DATA LOCALSTORAGE
      // ===============================
      const jenjang = localStorage.getItem("jenjang") || "";

      const dataMurid = JSON.parse(localStorage.getItem("dataMurid") || "{}");
      const dataWali = JSON.parse(localStorage.getItem("dataWali") || "{}");
      const dataKesejahteraan = JSON.parse(
        localStorage.getItem("dataKesejahteraan") || "{}",
      );

      // ===============================
      // GABUNGKAN SEMUA DATA
      // ===============================
      formData.append("jenjang", jenjang);
      formData.append("tanggal_daftar", new Date().toLocaleString("id-ID"));

      for (const key in dataMurid) {
        formData.append(key, dataMurid[key]);
      }

      for (const key in dataWali) {
        formData.append(key, dataWali[key]);
      }

      for (const key in dataKesejahteraan) {
        formData.append(key, dataKesejahteraan[key]);
      }

      // ===============================
      // KIRIM KE GOOGLE APPS SCRIPT
      // ===============================
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status === "success") {
        statusBox.innerHTML =
          "✅ <b>Pendaftaran berhasil!</b><br>Data telah dikirim.";
        statusBox.style.color = "green";

        localStorage.clear();

        setTimeout(() => {
          window.location.href = "success.html";
        }, 1500);
      } else {
        throw new Error("Gagal menyimpan data");
      }
    } catch (error) {
      console.error(error);
      statusBox.innerHTML =
        "❌ <b>Terjadi kesalahan!</b><br>Silakan coba lagi.";
      statusBox.style.color = "red";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = "Kirim Pendaftaran";
    }
  });
});
