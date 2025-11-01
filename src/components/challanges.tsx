import { Challenge } from "./models/challange";

export const challenges: Challenge[] = [
    {
      id: 1,
      title: "Prima ta buclă FOR",
      description:
        "Învață să folosești bucla for pentru a itera printr-o listă",
      task: "Scrie un program care afișează numerele de la 1 la 5 folosind o buclă for.",
      starterCode:
        "# Afișează numerele de la 1 la 5\nfor i in range(1, 6):\n    print(i)",
      solution: "for i in range(1, 6):\n    print(i)",
      testCases: [{ expectedOutput: "1\n2\n3\n4\n5" }],
      hints: [
        "Folosește range(1, 6) pentru numerele de la 1 la 5",
        "range(start, stop) nu include valoarea stop",
        "Folosește print(i) pentru a afișa fiecare număr",
      ],
      category: "for",
    },
    {
      id: 2,
      title: "Suma numerelor",
      description: "Calculează suma numerelor folosind o buclă",
      task: "Calculează suma numerelor de la 1 la 10 și afișează rezultatul.",
      starterCode:
        "# Calculează suma numerelor de la 1 la 10\nsuma = 0\nfor i in range(1, 11):\n    suma = suma + i\nprint(suma)",
      solution:
        "suma = 0\nfor i in range(1, 11):\n    suma = suma + i\nprint(suma)",
      testCases: [{ expectedOutput: "55" }],
      hints: [
        "Inițializează o variabilă suma = 0",
        "Folosește range(1, 11) pentru numerele de la 1 la 10",
        "Adaugă fiecare număr la sumă în buclă",
      ],
      category: "for",
    },
    {
      id: 3,
      title: "Buclă WHILE",
      description: "Învață să folosești bucla while",
      task: "Afișează numerele de la 5 la 1 în ordine descrescătoare folosind o buclă while.",
      starterCode:
        "# Afișează numerele de la 5 la 1\nn = 5\nwhile n >= 1:\n    print(n)\n    n = n - 1",
      solution:
        "n = 5\nwhile n >= 1:\n    print(n)\n    n = n - 1",
      testCases: [{ expectedOutput: "5\n4\n3\n2\n1" }],
      hints: [
        "Inițializează n = 5",
        "Condiția while: n >= 1",
        "Nu uita să decrementezi n în fiecare iterație!",
      ],
      category: "while",
    },
    {
      id: 4,
      title: "Tabla înmulțirii",
      description: "Generează tabla înmulțirii cu 5",
      task: "Afișează tabla înmulțirii cu 5 (de la 5x1 la 5x10) în formatul: '5 x 1 = 5'",
      starterCode:
        "# Tabla înmulțirii cu 5\nfor i in range(1, 11):\n    print(f'5 x {i} = {5 * i}')",
      solution:
        "for i in range(1, 11):\n    print(f'5 x {i} = {5 * i}')",
      testCases: [
        {
          expectedOutput:
            "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50",
        },
      ],
      hints: [
        "Folosește range(1, 11) pentru numerele de la 1 la 10",
        "Folosește f-string pentru formatare: f'5 x {i} = {5 * i}'",
        "Înmulțește 5 cu fiecare număr din range",
      ],
      category: "for",
    },
    {
      id: 5,
      title: "Numere pare",
      description: "Filtrează și afișează doar numerele pare",
      task: "Afișează doar numerele pare de la 2 la 20.",
      starterCode:
        "# Afișează numerele pare de la 2 la 20\nfor i in range(2, 21, 2):\n    print(i)",
      solution: "for i in range(2, 21, 2):\n    print(i)",
      testCases: [
        { expectedOutput: "2\n4\n6\n8\n10\n12\n14\n16\n18\n20" },
      ],
      hints: [
        "Folosește range cu pas: range(2, 21, 2)",
        "Pasul de 2 va sări peste numerele impare",
        "Alternativ: poți folosi if i % 2 == 0",
      ],
      category: "range",
    },
    {
      id: 6,
      title: "Factorial",
      description: "Calculează factorialul unui număr",
      task: "Calculează factorialul lui 5 (5! = 5 × 4 × 3 × 2 × 1) și afișează rezultatul.",
      starterCode:
        "# Calculează 5!\nfactorial = 1\nfor i in range(1, 6):\n    factorial = factorial * i\nprint(factorial)",
      solution:
        "factorial = 1\nfor i in range(1, 6):\n    factorial = factorial * i\nprint(factorial)",
      testCases: [{ expectedOutput: "120" }],
      hints: [
        "Inițializează factorial = 1 (nu 0!)",
        "Înmulțește factorial cu fiecare număr de la 1 la 5",
        "5! = 5 × 4 × 3 × 2 × 1 = 120",
      ],
      category: "for",
    },
    {
      id: 7,
      title: "Pattern cu stele",
      description: "Creează un pattern vizual cu bucle imbricate",
      task: "Creează un pattern crescător de stele (*, **, ***, ****, *****).",
      starterCode:
        "# Pattern cu stele\nfor i in range(1, 6):\n    print('*' * i)",
      solution: "for i in range(1, 6):\n    print('*' * i)",
      testCases: [{ expectedOutput: "*\n**\n***\n****\n*****" }],
      hints: [
        "Folosește range(1, 6) pentru 5 linii",
        "Înmulțește string-ul '*' cu i pentru a repeta stelele",
        "'*' * 3 va produce '***'",
      ],
      category: "nested",
    },
    {
      id: 8,
      title: "Numărătoare inversă",
      description: "Numărătoare inversă cu condiție while",
      task: "Creează o numărătoare inversă de la 10 la 0 cu mesaj 'Start!' la final.",
      starterCode:
        "# Numărătoare inversă\nn = 10\nwhile n >= 0:\n    print(n)\n    n = n - 1\nprint('Start!')",
      solution:
        "n = 10\nwhile n >= 0:\n    print(n)\n    n = n - 1\nprint('Start!')",
      testCases: [
        {
          expectedOutput:
            "10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n0\nStart!",
        },
      ],
      hints: [
        "Începe cu n = 10",
        "Condiția while trebuie să includă și 0: n >= 0",
        "După buclă, afișează 'Start!'",
      ],
      category: "while",
    },
  ];