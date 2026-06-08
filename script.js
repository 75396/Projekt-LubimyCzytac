const url = "https://mdsgflidcatnbqznrzvc.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kc2dmbGlkY2F0bmJxem5yenZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MzgzOTcsImV4cCI6MjA5NjQxNDM5N30.VmsuMtctCyC79TcdbCTQT3kt6HgZ-O23GzM3OKsGzqg";
let wybranaKsiazka = null;

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
    fetch(url + "/rest/v1/ksiazki?select=*", {
        headers: {
            "apikey": key,
            "Authorization": "Bearer " + key
        }
    })
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
    wybranaKsiazka = ksiazka;
    const div = document.getElementById("szczegolyKsiazki");
    div.innerHTML = `
        <h3>${ksiazka.tytul}</h3>
        <p><strong>Autor:</strong> ${ksiazka.autor}</p>
        <p><strong>Rok wydania:</strong> ${ksiazka.rok}</p>
    `;
    document.getElementById("usunKsiazke").style.display = "block";
    pobierzOpinie(ksiazka.id);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dodajKsiazke").addEventListener("click", dodajKsiazke);
    pobierzKsiazki();
});

document.getElementById("wyszukiwarka").addEventListener("input", filtrujKsiazki);

function filtrujKsiazki() {
    const fraza = document.getElementById("wyszukiwarka").value.toLowerCase();
    const elementy = document.querySelectorAll("#listaKsiazek li");

    elementy.forEach(li => {
        if (li.textContent.toLowerCase().includes(fraza)) {
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
    });
}

function usunKsiazke() {
    if (!wybranaKsiazka) return;

    fetch(url + "/rest/v1/ksiazki?id=eq." + wybranaKsiazka.id, {
        method: "DELETE",
        headers: {
            "apikey": key,
            "Authorization": "Bearer " + key
        }
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Błąd usuwania");
        }
        wybranaKsiazka = null;
        document.getElementById("szczegolyKsiazki").innerHTML =
            "Wybierz książkę z listy.";
        document.getElementById("usunKsiazke").style.display = "none";
        pobierzKsiazki();
    })
    .catch(err => {
        console.error(err);
    });
}

document.getElementById("usunKsiazke")
    .addEventListener("click", usunKsiazke);

function pobierzOpinie(idKsiazki) {
    fetch(
        url +
        "/rest/v1/opinie?ksiazka_id=eq." +
        idKsiazki +
        "&select=*",
        {
            headers: {
                apikey: key,
                Authorization: "Bearer " + key
            }
        }
    )
    .then(res => res.json())
    .then(data => {
        const kontener = document.getElementById("opinie");
        if (data.length === 0) {
            kontener.innerHTML = "Brak opinii.";
            return;
        }
        kontener.innerHTML = "";
        data.forEach(opinia => {
            kontener.innerHTML += `
                <div class="opinia">
                    <strong>${opinia.autor}</strong>
                    <p>${opinia.tresc}</p>
                </div>
            `;
        });

    });
}

function dodajOpinie() {
    if (!wybranaKsiazka) {
        alert("Najpierw wybierz książkę.");
        return;
    }
    const autor =
        document.getElementById("autorOpinii").value;

    const tresc =
        document.getElementById("trescOpinii").value;

    const dane = {
        ksiazka_id: wybranaKsiazka.id,
        autor: autor,
        tresc: tresc
    };
    fetch(url + "/rest/v1/opinie", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: key,
            Authorization: "Bearer " + key
        },
        body: JSON.stringify(dane)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Błąd dodawania opinii");
        }
        return res.text();
    })
    .then(() => {
        document.getElementById("autorOpinii").value = "";
        document.getElementById("trescOpinii").value = "";
        pobierzOpinie(wybranaKsiazka.id);
    })
    .catch(console.error);
}

document
    .getElementById("dodajOpinie")
    .addEventListener("click", dodajOpinie);
