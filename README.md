
# Python Loop Master

This is a Vite + React implementation of *Python Loop Master*.

## Local Development

```bash
npm install
npm run dev
```

The application will be available on the port reported by Vite (default `http://localhost:5173`).

## Docker

Build and run the production image locally:

```bash
docker build -t mini-game-for-loops .
docker run --rm -p 8080:80 mini-game-for-loops
```

Or use Docker Compose for a one-step workflow:

```bash
docker compose up --build
```

The site will be exposed at `http://localhost:8080`.

## Documentație (RO)

**Prezentare generală**
- *Python Loop Master* este un joc web interactiv care îi învață pe începători să folosească buclele `for` și `while` în Python.
- Fiecare provocare include descrieri, cod de pornire, output așteptat și indicii progresive.

**Utilitate educațională**
- Oferă feedback imediat prin rularea reală a codului în Pyodide, astfel încât elevii văd instant rezultatul propriilor soluții.
- Încurajează învățarea incrementală: utilizatorii parcurg niveluri tot mai complexe și câștigă stele pentru a-și urmări progresul.
- Poate fi folosit în clasă sau în regim autodidact, fiind accesibil din browser fără instalarea Python pe calculator.

**Caracteristici cheie**
- Editor embedded cu cod de pornire și reset rapid, adaptat pentru tastatură și dispozitive mobile.
- Sistem de hint-uri care dezvăluie conceptele pas cu pas, limitând frustrarea și crescând motivația.
- Panou de rezultate care validează output-ul și trasează progresul global prin bare de status și trofee.

**Mod de utilizare recomandat**
- Introduceți jocul după ce elevii au învățat noțiunile de bază despre variabile și tipuri.
- Încurajați experimentarea: modificarea codului de pornire și testarea ipotezelor duce la înțelegere profundă.
- Folosiți sistemul de stele ca mecanism de gamificare pentru a motiva atingerea tuturor provocărilor.
  