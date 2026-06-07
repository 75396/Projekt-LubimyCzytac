const SUPABASE_URL = "";
const SUPABASE_KEY = "";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const tytulInput = document.getElementById("tytul");
const autorInput = document.getElementById("autor");
const rokInput = document.getElementById("rok");

const listaKsiazek = document.getElementById("listaKsiazek");
const szczegolyKsiazki = document.getElementById("szczegolyKsiazki");
const dodajPrzycisk = document.getElementById("dodajKsiazke");

async function pobierzKsiazki() {
    const { data, error } = await supabase
        .from("ksiazki")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    listaKsiazek.innerHTML = "";

    data.forEach(ksiazka => {
        const li = document.createElement("li");

        li.textContent = ksiazka.tytul;

        li.addEventListener("click", () => {
            pokazSzczegoly(ksiazka);
        });

        listaKsiazek.appendChild(li);
    });
}

function pokazSzczegoly(ksiazka) {
    szczegolyKsiazki.innerHTML = `
        <h3>${ksiazka.tytul}</h3>
        <p><strong>Autor:</strong> ${ksiazka.autor}</p>
        <p><strong>Rok wydania:</strong> ${ksiazka.rok}</p>
    `;
}

async function dodajKsiazke() {
    const tytul = tytulInput.value;
    const autor = autorInput.value;
    const rok = rokInput.value;

    if (!tytul || !autor || !rok) {
        alert("Wypełnij wszystkie pola.");
        return;
    }

    const { error } = await supabase
        .from("ksiazki")
        .insert([
            {
                tytul: tytul,
                autor: autor,
                rok: rok
            }
        ]);

    if (error) {
        console.error(error);
        return;
    }

    tytulInput.value = "";
    autorInput.value = "";
    rokInput.value = "";

    pobierzKsiazki();
}

dodajPrzycisk.addEventListener("click", dodajKsiazke);

document.addEventListener("DOMContentLoaded", pobierzKsiazki);
