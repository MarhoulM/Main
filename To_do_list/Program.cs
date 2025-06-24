class Note
{
    public required string Text { get; set; } = string.Empty;
    public int Importance { get; set; }
}
class Program
{
    static void Main()
    {
        List<Note> notes = new List<Note>();
        int velikostPole = notes.Capacity;
        string messageConfirmation = "Stiskni klávesu Enter pro pokračování.";
        string? readResult;


        do
        {
            Console.Clear();
            Menu();
            readResult = Console.ReadLine();
            if (readResult != null)
            {
                switch (readResult)
                {
                    case "1":
                        {
                            Console.WriteLine(@"Napište svou poznámku, jakmile ji dokončíte stisknětě Enter.");
                            string? text = Console.ReadLine();


                            Console.WriteLine("Zadejte důležitost (číslo, např. 9 = vysoká, 1 = nízká):");
                            int.TryParse(Console.ReadLine(), out int importance);

                            notes.Add(new Note
                            {
                                Text = text,
                                Importance = importance
                            });

                            Console.WriteLine("Poznámka byla uložena. Stiskněte Enter pro návrat do menu.");
                            Console.ReadLine();
                            break;
                        }
                    case "2":
                        {
                            if (notes.Count == 0)
                            {
                                Console.WriteLine("Žádné poznámky nejsou uložené.");
                            }
                            else
                            {
                                NoteList(notes);
                            }
                            Console.WriteLine(messageConfirmation);
                            Console.ReadLine();
                            break;
                        }
                    case "3":
                        {
                            NoteList(notes);
                            Console.WriteLine("Zadejte číslo poznámky, kterou chcete upravit.");
                            string? readInput = Console.ReadLine();
                            if (int.TryParse(readInput, out int i) && i > 0 && i <= notes.Count)
                            {
                                Console.WriteLine($"Aktuální poznámka: {notes[i - 1].Text} (Důležitost: {notes[i - 1].Importance})");
                                Console.WriteLine("Zadejte poznámku, která nahradí původní.");
                                string? adjustmentString = Console.ReadLine();
                                notes[i - 1].Text = adjustmentString;
                                Console.WriteLine("Poznámka byla uložena.");
                            }
                            else
                            {
                                Console.WriteLine("Neplatný vstup.");
                            }
                            Console.WriteLine(messageConfirmation);
                            Console.ReadLine();
                            break;
                        }
                    case "4":
                        {
                            NoteList(notes);
                            Console.WriteLine("Zadejte číslo poznámky, kterou chcete smazat.");
                            string? readInput2 = Console.ReadLine();
                            if (int.TryParse(readInput2, out int j) && j > 0 && j <= notes.Count)
                            {
                                Console.WriteLine($"{notes[j - 1]} Poznámka smazána.");
                                notes.RemoveAt(j - 1);
                            }
                            else
                            {
                                Console.WriteLine("Neplatný vstup.");
                            }
                            Console.WriteLine(messageConfirmation);
                            Console.ReadLine();
                            break;
                        }
                    case "5":
                        {
                            Console.WriteLine("Zadejte výraz, které chcete vyhledat.");
                            string? readInput3 = Console.ReadLine();
                            if (!string.IsNullOrWhiteSpace(readInput3))
                            {
                                bool search = false;
                                foreach (var note in notes)
                                {
                                    if (note != null && note.Text.Contains(readInput3, StringComparison.OrdinalIgnoreCase))
                                    {
                                        Console.WriteLine($"Poznámka:{note.Text} (Důležitost: {note.Importance}) obsahuje hledaný výraz.");
                                        search = true;
                                    }
                                }
                                if (!search)
                                {
                                    Console.WriteLine("Pro zadaný výraz nebyla nalezena shoda");
                                }
                            }
                            else
                            {
                                Console.WriteLine("Neplatný vstup.");
                            }
                            Console.WriteLine(messageConfirmation);
                            Console.ReadLine();
                            break;
                        }
                    case "6":
                        {
                            Console.WriteLine("6. Změnit důležitost poznámky.");
                            NoteList(notes);
                            Console.WriteLine("Zadejte číslo poznámky, které chcete změnit důležitost.");
                            string? readInput4 = Console.ReadLine();
                            if (int.TryParse(readInput4, out int index) && index > 0 && index <= notes.Count)
                            {
                                Console.WriteLine($"Aktuální důležitost: {notes[index - 1].Importance}");
                                Console.WriteLine("Zadejte novou důležitost (číslo):");
                                string? newImportanceInput = Console.ReadLine();
                                if (int.TryParse(newImportanceInput, out int newImportance))
                                {
                                    notes[index - 1].Importance = newImportance;
                                    Console.WriteLine("Důležitost byla změněna.");
                                }
                                else
                                {
                                    Console.WriteLine("Neplatný vstup pro důležitost.");
                                }
                            }
                            else
                            {
                                Console.WriteLine("Neplatný vstup.");
                            }
                            Console.WriteLine(messageConfirmation);
                            Console.ReadLine();
                            break;
                        }
                    case "7":
                        {
                            Console.WriteLine("7. Seřadit poznámky.");
                            Console.WriteLine("Pro seřazení poznámek abecedně zadejte: 1.\nPro seřazení poznámek dle důležitosti zadejte: 2.");
                            string? readInput5 = Console.ReadLine();
                            if (readInput5 != null)
                            {
                                if (readInput5 == "1")
                                {
                                    notes = notes.OrderBy(n => n.Text).ToList();
                                    Console.WriteLine("Poznámky byly seřazeny.");
                                    NoteList(notes);
                                }
                                else if (readInput5 == "2")
                                {
                                    notes = notes.OrderByDescending(n => n.Importance).ToList();
                                    Console.WriteLine("Poznámky byly seřazeny.");
                                    NoteList(notes);
                                }
                                else
                                    Console.WriteLine("Neplatný vstup.");
                            }
                            Console.WriteLine(messageConfirmation);
                            Console.ReadLine();
                            break;
                        }
                    case "8":
                        {
                            string desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                            string filePath = Path.Combine(desktopPath, "poznamky.txt");

                            string[] notesToExport = notes
                    .Where(n => !string.IsNullOrWhiteSpace(n.Text))
                    .Select(n => $"{n.Text} (Důležitost: {n.Importance})")
                    .ToArray();
                            if (notesToExport.Length > 0)
                            {
                                File.WriteAllLines(filePath, notesToExport);
                                Console.WriteLine($"Poznámky byly exportovány do souboru na plochu: {filePath}");
                            }
                            else
                            {
                                Console.WriteLine("Nebyly nalezeny žádné poznámky k exportu.");
                            }
                            Console.WriteLine(messageConfirmation);
                            Console.ReadLine();
                            break;
                        }
                }
            }
        } while (readResult != "exit");

        Console.WriteLine("Program byl ukončen. Stiskněte Enter pro zavření.");
        Console.ReadLine();
    }

    static void Menu()
    {
        Console.WriteLine("Vítejte v aplikaci To do list."); ;
        Console.WriteLine("Podle akce, kterou chcete provést zadejte číslo jedné z následujících kategorií.");
        Console.WriteLine("1. Přidat novou poznámku.");
        Console.WriteLine("2. Zobrazit poznámky.");
        Console.WriteLine("3. Upravit stávající poznámku.");
        Console.WriteLine("4. Smazat poznámku.");
        Console.WriteLine("5. Vyhledávat v poznámkách.");
        Console.WriteLine("6. Změnit důležitost poznámky.");
        Console.WriteLine("7. Seřadit poznámky.");
        Console.WriteLine("8. Exportuj poznámky do textového souboru.");
        Console.WriteLine("9. Pro ukončení zadejte exit a potvrďte klávesou Enter.");
    }
    static void NoteList(List<Note> notes)
    {
        Console.WriteLine("Seznam poznámek:");
        for (int i = 0; i < notes.Count; i++)
        {
            Console.WriteLine($"{i + 1}. {notes[i].Text} (Důležitost: {notes[i].Importance})");
        }
    }
}

