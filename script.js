const SUPABASE_URL = "https://mdsgflidcatnbqznrzvc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc2dmbGlkY2F0bmJxem5yenZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzgzOTcsImV4cCI6MjA5NjQxNDM5N30.VmsuMtctCyC79TcdbCTQT3kt6HgZ-O23GzM3OKsGzqg";

function dodajKsiazke() {
    const tytul = document.getElementById("tytul").value;
    const autor = document.getElementById("autor").value;
    const rok = document.getElementById("rok").value;

    const dane = {
        tytul,
        autor,
        rok: Number(rok)
    };

    fetch(url + "/rest/v1/ksiazki", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": key,
            "Authorization": "Bearer " + key,
            "Prefer": "return=representation"
        },
        body: JSON.stringify(dane)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Błąd zapisu: " + res.status);
        }
        return res.json();
    })
    .then(data => {
        console.log("Dodano książkę:", data);
        pobierzKsiazki(); // odśwież listę
    })
    .catch(err => {
        console.error(err);
        alert("Błąd dodawania książki");
    });
}
