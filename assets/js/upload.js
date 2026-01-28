const scriptURL = "PASTE_URL_APPS_SCRIPT_KAMU_DI_SINI";

document
  .getElementById("formUpload")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const status = document.getElementById("status");
    status.innerHTML = "⏳ Mengupload berkas...";

    const form = e.target;
    const files = form.querySelectorAll("input[type=file]");

    let dataFiles = {};

    for (let input of files) {
      if (input.files.length > 0) {
        const file = input.files[0];
        const base64 = await toBase64(file);
        dataFiles[input.name] = {
          name: file.name,
          type: file.type,
          data: base64,
        };
      }
    }

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(dataFiles),
    })
      .then((res) => res.text())
      .then(() => {
        status.innerHTML = "✅ Pendaftaran berhasil dikirim";
        form.reset();
      })
      .catch(() => {
        status.innerHTML = "❌ Gagal mengirim data";
      });
  });

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
