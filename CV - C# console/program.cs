string? readResult;
bool firstLaunch = false;
string option = "";
string setting = "";

do
{
    Console.Clear();

    if (!firstLaunch)
    {
        Console.WriteLine("Vítejte v konzolové aplikaci pro zobrazení CV: Ing. Michal Marhoul.");
        firstLaunch = true;
    }
    ;

    Console.WriteLine("1. Kontaktní a osobní údaje.");
    Console.WriteLine("2. Profil.");
    Console.WriteLine("3. Pracovní zkušenosti.");
    Console.WriteLine("4. Vzdělání.");
    Console.WriteLine("5. Dovednosti, zájmy.");
    Console.WriteLine("6. Zobrazit veškeré informace.");
    Console.WriteLine("Zadejte číslo dle seznamu, podle kategorie kterou chcete zobrazit.\n");
    Console.WriteLine("Pokud chcete změnit výšku konzole napište \"n\" a potvrďte klávesou Enter.");
    Console.WriteLine("Pokud chcete program ukončit napište \"exit\" a potvrďte klávesou Enter.");
    readResult = Console.ReadLine();

    if (readResult != null)
    {
        option = readResult.ToLower();
        switch (option)
        {

            case "1":
                {
                    Console.WriteLine("\x1b[4m1. Kontaktní a osobní údaje.\x1b[0m");
                    Console.WriteLine(@"Telefon: +420 723 028 376 | E-mail: marhoul.m@seznam.cz | LinkedIn: www.linkedin.com/in/michal-marhoul-223440132
Višňová, Česká republika");
                    Confirmation();
                    break;
                }
            case "2":
                {
                    Console.WriteLine("\x1b[4m2. Profil.\x1b[0m");
                    Console.WriteLine("Při zprovozňování zařízení v zahraničí se jako PLC programátor často musím spolehnout hlavně na sebe a svůj úsudek. Když k tomu přidám odhodlání dotáhnout věci do konce, dostanete přesně mě.");
                    Confirmation();
                    break;
                }
            case "3":
                {
                    Console.WriteLine("\x1b[4m3. Pracovní zkušenosti.\x1b[0m");
                    Console.WriteLine("PLC PROGRAMÁTOR – CENTEC AUTOMATIKA, SPOL. S R.O. / PRAHA\nČervenec 2022 – současnost\n- Programování řídících systémů Siemens (STL) včetně vizualizace\n- Vytváření programů pro řídicí systémy na základě elektrotechnických plánů a funkčních specifikací\n- Zprovoznění zařízení u zákazníka (kontrola vstupů a výstupů (IO), nastavení a úprava regulačních prvků, řešení mechanických, elektrických a technologických problémů, školení personálu)\n- Tvorba operačního manuálu\n- Práce na mezinárodních projektech (pravidelné zahraniční cesty) \n");
                    Console.WriteLine("TECHNOLOG – SAINT-GOBAIN SEKURIT ČR SPOL. S R. O. / HOŘOVICE\nBřezen 2017 – Únor 2018\n- Vytváření technologických postupů\n- Vytváření kontrolních plánů a návodů\n- Dohled nad svěřenou linkou\n- Zavádění nových výrobků na linku\n- Seřizování linky\n- Spolupráce s oddělením kvality a pracovníky na lince\n- Normování\n");
                    Console.WriteLine("TECHNOLOG – GEOMINE A.S. / PŘÍBRAM\nÚnor 2015 – Únor 2017\n- Uvádění nových výrobku do výroby\n- Vytváření výkresové dokumentace\n- Vytváření rozvinu nových dílů\n- Dohled nad ověřovací sérií nových dílů\n- Vytváření technologických postupů\n- Spolupráce s oddělením kontroly a obchodu\n- Normování\n- Navrhování přípravků\n- Komunikace se zákazníkem\n");
                    Console.WriteLine("CNC PROGRAMÁTOR – GEOMINE A.S. / PŘÍBRAM\nSrpen 2014 – Únor 2015\n- Programování CNC Ohraňovacího lisu\n- Příprava nářadí\n- Výroba plechových dílů (ohraňovací lis)\n- Kontrola a měření vyrobených dílů\n");
                    Confirmation();
                    break;
                }
            case "4":
                {
                    Console.WriteLine("\x1b[4m4. Vzdělání.\x1b[0m");
                    Console.WriteLine(@"Magisterské studium: Informační a řídící technika v agropotravinářském komplexu
                    Česká zemědělská univerzita v Praze, 2020 – 2022 ");
                    Console.WriteLine(@"Bakalářské studium: Informační a řídící technika v agropotravinářském komplexu
                    Česká zemědělská univerzita v Praze, 2017 – 2020 ");
                    Console.WriteLine(@"Střední průmyslová škola a vyšší odborná škola, Příbram
                    Obor: Strojírenství počítačové, 2010 – 2014");
                    Confirmation();
                    break;
                }
            case "5":
                {
                    Console.WriteLine("\x1b[4m5. Dovednosti, zájmy.\x1b[0m");
                    Console.WriteLine("Technické dovednosti:\n- Programovací jazyky: STL\n- konfigurace sítí a síťových prvků\n- Nástroje: Siemens TIA Portal (pokročilý), SIMATIC Step7 (základy), Microsoft Office (pokročilý), AutoCAD (mírně pokročilý), Autodesk Inventor (mírně pokročilý)\n\nMěkké dovednosti:\n- Dohled nad projekty\n- Týmová práce\n");
                    Console.WriteLine("Jazyky:\n Angličtina: B2 (středně pokročilá)\nNěmčina: A2\nČeština: rodilý mluvčí\n");
                    Console.WriteLine("Zájmy:\n- Turistika\n- Volejbal\n- 3D tisk\n- studium cizích jazyků");
                    Confirmation();
                    break;
                }
            case "6":
                {
                    Console.WriteLine("\x1b[4m6. Zobrazit veškeré informace.\x1b[0m");
                    Console.WriteLine("\n\x1b[4m1. Kontaktní a osobní údaje.\x1b[0m");
                    Console.WriteLine(@"Telefon: +420 723 028 376 | E-mail: marhoul.m@seznam.cz | LinkedIn: www.linkedin.com/in/michal-marhoul-223440132
Višňová, Česká republika");
                    Console.WriteLine("\n\x1b[4m2. Profil.\x1b[0m");
                    Console.WriteLine("Při zprovozňování zařízení v zahraničí se jako PLC programátor často musím spolehnout hlavně na sebe a svůj úsudek. Když k tomu přidám odhodlání dotáhnout věci do konce, dostanete přesně mě.\n");
                    Console.WriteLine("\x1b[4m3. Pracovní zkušenosti.\x1b[0m");
                    Console.WriteLine("PLC PROGRAMÁTOR – CENTEC AUTOMATIKA, SPOL. S R.O. / PRAHA\nČervenec 2022 – současnost\n- Programování řídících systémů Siemens (STL) včetně vizualizace\n- Vytváření programů pro řídicí systémy na základě elektrotechnických plánů a funkčních specifikací\n- Zprovoznění zařízení u zákazníka (kontrola vstupů a výstupů (IO), nastavení a úprava regulačních prvků, řešení mechanických, elektrických a technologických problémů, školení personálu)\n- Tvorba operačního manuálu\n- Práce na mezinárodních projektech (pravidelné zahraniční cesty) \n");
                    Console.WriteLine("TECHNOLOG – SAINT-GOBAIN SEKURIT ČR SPOL. S R. O. / HOŘOVICE\nBřezen 2017 – Únor 2018\n- Vytváření technologických postupů\n- Vytváření kontrolních plánů a návodů\n- Dohled nad svěřenou linkou\n- Zavádění nových výrobků na linku\n- Seřizování linky\n- Spolupráce s oddělením kvality a pracovníky na lince\n- Normování\n");
                    Console.WriteLine("TECHNOLOG – GEOMINE A.S. / PŘÍBRAM\nÚnor 2015 – Únor 2017\n- Uvádění nových výrobku do výroby\n- Vytváření výkresové dokumentace\n- Vytváření rozvinu nových dílů\n- Dohled nad ověřovací sérií nových dílů\n- Vytváření technologických postupů\n- Spolupráce s oddělením kontroly a obchodu\n- Normování\n- Navrhování přípravků\n- Komunikace se zákazníkem\n");
                    Console.WriteLine("CNC PROGRAMÁTOR – GEOMINE A.S. / PŘÍBRAM\nSrpen 2014 – Únor 2015\n- Programování CNC Ohraňovacího lisu\n- Příprava nářadí\n- Výroba plechových dílů (ohraňovací lis)\n- Kontrola a měření vyrobených dílů\n");
                    Console.WriteLine("\x1b[4m4. Vzdělání.\x1b[0m");
                    Console.WriteLine(@"Magisterské studium: Informační a řídící technika v agropotravinářském komplexu
                    Česká zemědělská univerzita v Praze, 2020 – 2022 ");
                    Console.WriteLine(@"Bakalářské studium: Informační a řídící technika v agropotravinářském komplexu
                    Česká zemědělská univerzita v Praze, 2017 – 2020 ");
                    Console.WriteLine(@"Střední průmyslová škola a vyšší odborná škola, Příbram
                    Obor: Strojírenství počítačové, 2010 – 2014");
                    Console.WriteLine("\n\x1b[4m5. Dovednosti, zájmy.\x1b[0m");
                    Console.WriteLine("Technické dovednosti:\n- Programovací jazyky: STL\n- konfigurace sítí a síťových prvků\n- Nástroje: Siemens TIA Portal (pokročilý), SIMATIC Step7 (základy), Microsoft Office (pokročilý), AutoCAD (mírně pokročilý), Autodesk Inventor (mírně pokročilý)\n\nMěkké dovednosti:\n- Dohled nad projekty\n- Týmová práce\n");
                    Console.WriteLine("Jazyky:\nAngličtina: B2 (středně pokročilá)\nNěmčina: A2\nČeština: rodilý mluvčí\n");
                    Console.WriteLine("Zájmy:\n- Turistika\n- Volejbal\n- 3D tisk\n- studium cizích jazyků");
                    Confirmation();
                    break;
                }
            case "n":
                {
                    Console.WriteLine("1. Původní nastavení.");
                    Console.WriteLine("2. Zvětšit výšku okna.");
                    setting = Console.ReadLine()?.ToLower();
                    if (setting != null)
                    {

                        switch (setting)
                        {
                            case "1":
                                {
                                    Console.WriteLine("Původní nastavení.");
                                    Console.WindowWidth = 80;
                                    Console.WindowHeight = 25;

                                    break;
                                }
                            case "2":
                                {
                                    Console.WriteLine("2. Výška okna byla změněna.");
                                    Console.WindowWidth = 80;
                                    Console.WindowHeight = 80;
                                    break;
                                }
                            default:
                                {
                                    Console.WriteLine("Zadán prázdný nebo chybný znak!");
                                    Confirmation();
                                    break;
                                }
                        }

                        Console.WriteLine("Stiskni klávesu Enter pro návrat do menu.");
                        readResult = Console.ReadLine();
                        break;
                    }
                    else
                    {
                        Console.WriteLine("Zadán prázdný nebo chybný znak!");
                    }
                    break;
                }
            case "exit":
                {
                    break;
                }
            default:
                {
                    Console.WriteLine("Zadán prázdný nebo chybný znak!");
                    Confirmation();
                    break;
                }
        }
    }
} while (option != "exit");

void Confirmation()
{
    Console.WriteLine("Stiskni klávesu Enter pro pokračování.");
    readResult = Console.ReadLine();
}