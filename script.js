const url = "https://mdsgflidcatnbqznrzvc.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc2dmbGlkY2F0bmJxem5yenZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzgzOTcsImV4cCI6MjA5NjQxNDM5N30.VmsuMtctCyC79TcdbCTQT3kt6HgZ-O23GzM3OKsGzqg";

function dodajKsiazke() {
    const tytul = document.getElementById("tytul").value;
    const autor = document.getElementById("autor").value;
    const rok = document.getElementById("rok").value;

    if (!tytul || !autor || !rok) {
        alert("Wypełnij wszystkie pola!");
        return;
    }

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
    .then(() => {
        document.getElementById("tytul").value = "";
        document.getElementById("autor").value = "";
        document.getElementById("rok").value = "";
        pobierzKsiazki();
    })
    .catch(err => {
        console.error(err);
        alert("Błąd dodawania książki");
    });
}

function pobierzKsiazki() {
    fetch(url + "/rest/v1/ksiazki?select=*")
        .then(res => {
            if (!res.ok) {
                throw new Error("Błąd pobierania: " + res.status);
            }
            return res.json();
        })
        .then(data => {
            const lista = document.getElementById("listaKsiazek");
            lista.innerHTML = "";

            data.forEach(ksiazka => {
                const li = document.createElement("li");
                li.textContent = ksiazka.tytul;

                li.addEventListener("click", () => {
                    pokazSzczegoly(ksiazka);
                });

                lista.appendChild(li);
            });
        })
        .catch(err => {
            console.error(err);
        });
}

function pokazSzczegoly(ksiazka) {
    const div = document.getElementById("szczegolyKsiazki");

    div.innerHTML = `
        <h3>${ksiazka.tytul}</h3>
        <p><strong>Autor:</strong> ${ksiazka.autor}</p>
        <p><strong>Rok wydania:</strong> ${ksiazka.rok}</p>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dodajKsiazke").addEventListener("click", dodajKsiazke);
    pobierzKsiazki();
});
