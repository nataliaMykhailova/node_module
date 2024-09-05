const path = require("node:path");
const fs = require("node:fs/promises");
// npm init - create project

//ДЗ:
// Створити папку "baseFolder". В ній створити 5 папок,
// в кожній з яких створити по 5 файлів з розширенням txt.
// Вивести в консоль шляхи до кожного файлу чи папки,
// також вивести поряд інформацію про те, чи є це файл чи папка.

const foo = async () => {
    await fs.mkdir(path.join(__dirname, "baseFolder"), { recursive: true });

    for (let dir = 1; dir < 6; dir++) {
        const dirPass = path.join(__dirname, "baseFolder", `folder${dir}`);
        await fs.mkdir(dirPass, { recursive: true });

        for (let file = 1; file < 6; file++) {
            const filePath = path.join(dirPass, `file${file}.txt`);
            await fs.writeFile(filePath, `Folder - ${dir},  text file - ${file}`);
        }
    }
    const outputInfoAboutFolder = async (folder) => {
        const elements = await fs.readdir(folder, { withFileTypes: true });

        for (let element of elements) {
            const elPath = path.join(folder, element.name);
            const elType = element.isDirectory() ? "Folder" : "File";
            console.log(`${elPath} - ${elType}`);

            if (element.isDirectory()) {
                await outputInfoAboutFolder(elPath);
            }
        }
    };
    void outputInfoAboutFolder(path.join(__dirname, "baseFolder"));
};

void foo();
