import mm from '../Images/meetmeat.png';
import mm1 from '../Images/meetmeat11.png';
import mm2 from '../Images/meetmeat2.png';
import mm22 from '../Images/meetmeat22.png';
import mm3 from '../Images/meetmeat3.png';
import mm33 from '../Images/meetmeat33.png';
import mm4 from '../Images/meetmeat4.png';
import mm44 from '../Images/meetmeat44.png';
import mmA from '../Images/mmA.png';
import pf from '../Images/portfolio.png';
import tdl from '../Images/tdl.png';
import cv from '../Images/cv.png';
import cmy from '../Images/cSMySql.png';
import cp from '../Images/ContosoPizza.png';

export const projects = [
    {
      id: 1,
      name: "MeetMeat",
      description: "Front-end pro e-commerce",
      detailDescription: "Začal bych motivem, který mě vedl k vytvoření tohoto projektu: kamarád suší maso a kdysi se mě zeptal, zda bych mu zvládl vytvořit jednoduchou stránku na objednávky. Nechal jsem se unést a jeho požadavek jsem trochu rozšířil. Toto je front-endová část projektu, která je napsaná v Reactu za pomoci JavaScriptu. Rovněž zde najdete prvky klasického HTML a CSS. Pro vytvoření jsem využil VS Code a Vite jako vývojové prostředí. Je to rovněž můj první projekt, kde jsem začal používat React, jelikož předtím jsem měl zkušenosti pouze s Vanilla JavaScriptem z kurzu na freeCodeCamp. Z pohledu funkcí e-shopu si můžete vytvořit a odeslat objednávku. Bohužel žádné zboží nedostanete, ale na oplátku nemusíte nic platit. Dále si můžete procházet produkty, filtrovat je a prohlížet jejich detaily. Můžete také prozkoumat kontaktní formulář, nebo se jako zalogovaný uživatel podívat na své vytvořené objednávky. ",
      category: [
        { display: "JS", css: "js" },
        { display: "React", css: "react" },
        { display: "Vite", css: "vite" },
        { display: "VS Code", css: "vscode" },
        { display: "HTML", css: "html" },
        { display: "CSS", css: "css" },
      ],
      img:[ mm, mm1, mm2, mm22, mm3, mm33, mm4, mm44 ],
      source: "https://github.com/MarhoulM/Main/tree/5c515a306a9f0216db3397821574ea7ad9f44681/meetmeat",
    },
    {
      id: 2,
      name: "MeetMeatApi",
      description: "Back-end pro e-commerce",
      detailDescription: "Po dokončení front-endové části projektu jsem se vrhl na back-end. Zejména mě zajímalo, jak celý systém funguje dohromady. Před touto částí jsem znal základy C#, ale přístup, který jsem zde zvolil, a to ASP.NET Core, byl pro mě velice náročný. Jelikož jsem zde poprvé začal s tímto frameworkem, proto jsem při psaní této části velice často využíval umělou inteligenci. Rovněž jsem neznal souvislosti, co a jak funguje, takže jsem se zde opravdu zapotil a strávil desítky hodin. Při vývoji jsem využil Postman a Swagger, pomocí kterých jsem testoval CRUD metody. Odměnou mi však bylo, že i s pomocí jsem dokončil celý full-stack projekt. Rovněž jsem se v rámci této části zaměřil na testy, konkrétně na unit a integrační testy. Jako vývojové prostředí jsem využil Visual Studio.",
      category: [
        { display: "C#", css: "csharp" },
        { display: ".NET Core", css: "dotnetcore" },
        { display: "Visual Studio", css: "visualstudio" },
        { display: "Swagger", css: "swagger" },
        { display: "MySQL", css: "mysql" },
      ],
      img:[ mmA],
      source: "https://github.com/MarhoulM/Main/tree/5c515a306a9f0216db3397821574ea7ad9f44681/meetmeatApi/meetmeatApi",
    },
    {
      id: 3,
      name: "Portfolio",
      description: "Mé osobní portfolio",
      detailDescription: "Tento projekt jsem začal psát po dokončení full-stack projektu MeetMeat, takže už jsem si byl daleko jistější v tvorbě komponent a jejich závislostí. Rovněž jsem si připravil několik výzev, aby to nebylo příliš jednoduché. Použil jsem VS Code, Vite, React a JavaScript. Tento projekt jsem se rozhodl vytvořit jako prezentaci svých zkušeností a projektů, na kterých jsem se podílel. Pro back-end jsem zde použil PHP, jelikož mě tento programovací jazyk zajímal. V back-endové části můžete zhodnotit, jak jsem si počínal. V rámci tohoto full-stacku jsem vytvořil několik testů jak pro front-end, tak i pro back-end, který by měl být z většiny pokryt testy.",
      category: [
        { display: "JS", css: "js" },
        { display: "React", css: "react" },
        { display: "Vite", css: "vite" },
        { display: "VS Code", css: "vscode" },
        { display: "HTML", css: "html" },
        { display: "CSS", css: "css" },
        { display: "PHP", css: "php" },
      ],
      img:[ pf],
      source: "https://github.com/MarhoulM/Main/tree/5c515a306a9f0216db3397821574ea7ad9f44681/portfolio\nhttps://github.com/MarhoulM/Main/tree/59f8be575881ab38ac8a6ad9ab7fbcad2fc83e6b/Portfolio_form",
    },
    {
      id: 4,
      name: "To do list",
      description: "Konzolová aplikace pro psaní poznámek",
      detailDescription: "Jeden z mých prvních rozsáhlejších projektů v C#, jedná se o konzolovou aplikaci spustitelnou v terminálu. Jakmile aplikaci spustíte, můžete přidávat poznámky, upravovat je, mazat, filtrovat, řadit a dokonce i exportovat. Princip ovládání je jednoduchý: podle menu zadáte číslo akce, kterou chcete provést. Pokud chcete aplikaci ukončit, zadejte 'exit' a potvrďte klávesou Enter.",
      category: [
        { display: "C#", css: "csharp" },
        { display: "VS Code", css: "vscode" },
        { display: ".NET 9", css: "dotnet9" },
      ],
      img:[ tdl],
      source: "https://github.com/MarhoulM/Main/tree/5c515a306a9f0216db3397821574ea7ad9f44681/To_do_list",
    },
    {
      id: 5,
      name: "CV - C# console",
      description: "Konzolová aplikace pro zobrazení CV",
      detailDescription: "Můj úplně první projekt v C#, který jsem psal, když jsem dokončil kurz na Microsoft Learn zaměřený na C#. Jedná se o konzolovou aplikaci, kterou můžete spustit v terminálu. Podle menu se pak můžete navigovat napříč informacemi, které vás zajímají. Pokud budete chtít aplikaci ukončit, zadejte v menu 'exit' a potvrďte klávesou Enter. Pracoval jsem zde ve VS Code a .NET 9.",
      category: [
        { display: "C#", css: "csharp" },
        { display: "VS Code", css: "vscode" },
        { display: ".NET 9", css: "dotnet9" },
      ],
      img:[ cv],
      source: "https://github.com/MarhoulM/Main/tree/5c515a306a9f0216db3397821574ea7ad9f44681/CV%20-%20C%23%20console",
    },
    {
      id: 6,
      name: "C# s databází MySQL",
      description: "Konzolová aplikace pro zapsání dat do databáze",
      detailDescription: "V tomto projektu jsem se zaměřil na přenos dat z C# do databáze. K tomu jsem využil MySQL. Kód se skládá ze dvou částí: jedna je určena pro zápis dat do databáze a druhá pro čtení z ní. Ve zdrojovém kódu je aktuálně zakomentovaná část pro přenos dat do databáze.",
      category: [
        { display: "C#", css: "csharp" },
        { display: "VS Code", css: "vscode" },
        { display: ".NET 9", css: "dotnet9" },
      ],
      img:[ cmy],
      source: "https://github.com/MarhoulM/Main/tree/5c515a306a9f0216db3397821574ea7ad9f44681/C%23_with_MySQL_Database",
    },
          {
      id: 7,
      name: "Contoso Pizza",
      description: "Webová stránka - Blazor",
      detailDescription: "Při svém zkoumání různých přístupů k tvorbě webů jsem se dostal i k Blazoru. V rámci jednoho z kurzů jsem si vyzkoušel psaní front-endu pomocí takzvaných Razor Pages, které kombinují C# a HTML prvky. Jelikož jsem měl základy ze C# kurzu, jednoduše nešlo odolat a nevyzkoušet si to. Je to sice malý projekt, ale nemusím zmiňovat, že mě tyto oblasti velmi zajímají. Tento web obsahuje 3 stránky a můžete si zde vytvářet, nacenit a případně i odstranit vlastní pizzu.",
      category: [
        { display: "C#", css: "csharp" },
        { display: "Visual Studio", css: "visualstudio" },
        { display: ".NET 8", css: "dotnet8" },
        { display: "Blazor", css: "blazor" },
      ],
      img:[ cp],
      source: "https://github.com/MarhoulM/Main/tree/fcd1d34752ce44a1f925ad3eb8313cc042a2ccf5/ContosoPizza",
    },
  ];
