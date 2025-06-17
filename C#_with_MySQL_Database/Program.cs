using MySql.Data.MySqlClient;

string[] users = { "Jan Novák", "Eva Svobodová", "Tomáš Dvořák", "Petra Horáková", "Jiří Černý", "Lucie Veselá", "Martin Procházka", "Tereza Němcová", "Ondřej Král", "Veronika Jelínková" };

string[,] names = new string[users.Length, 2];
string connectionString = "Server=localhost;Database=CSharp_Database;User=root;Password=MichalTest123;";
using (var connection = new MySqlConnection(connectionString))
{
    try
    {
        connection.Open();

       /* for (int i = 0; i < users.Length; i++)
        {
            string[] partialNames = users[i].Split(" ");
            names[i, 0] = partialNames[0];
            names[i, 1] = partialNames[1];

            string query = "INSERT INTO Uzivatele (Jmeno, Prijmeni) VALUES (@firstName, @lastName)";

            using (var command = new MySqlCommand(query, connection))
            {

                command.Parameters.AddWithValue("@firstName", partialNames[0]);
                command.Parameters.AddWithValue("@lastName", partialNames[1]);

                command.ExecuteNonQuery();
            }
        }
        Console.WriteLine("Data byla úspěšně uložena do databáze.");
        */
        Console.WriteLine("Výpis z databáze:");
        string selectQuery = "Select Id, Jmeno, Prijmeni FROM Uzivatele";

        using (var selectCommand = new MySqlCommand(selectQuery, connection))
        using (var reader = selectCommand.ExecuteReader())
        {
            while (reader.Read())
            {
                int Id = reader.GetInt32("Id");
                string firstName = reader.GetString("Jmeno");
                string lastName = reader.GetString("Prijmeni");
                Console.WriteLine($"Id: {Id}, Jméno: {firstName}, Příjmení: {lastName}");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Chyba při připojení nebo ukládání do databáze: " + ex.Message);
    }
}
/*foreach (string name in users){
    Console.WriteLine(name);
}
for (int i = 0; i < names.GetLength(0); i++)
{
    Console.WriteLine($"Jméno:{names[i, 0]}, Příjmení:{names[i, 1]}");

}*/
