const fs = require("fs");
const path = require("path");

class storageManager {
  constructor(archive) {
    this.archive = archive;
  }

  async getAll() {
    try {
      const listObjs = await fs.promises.readFile(
        path.join(__dirname + `/../database/${this.archive}`),
        "utf-8",
        2
      );
      if (listObjs === "") {
        return console.log("La lista de items está vacía");
      } else {
        const listParce = JSON.parse(listObjs);
        return listParce;
      }
    } catch (err) {
      console.log(`Ocurrió el error: ${err}`);
    }
  }

  async save(object) {
    let listObjs = await this.getAll();
    let id;
    if (listObjs === undefined) {
      listObjs = [];
      id = 1;
    } else {
      id = listObjs.length + 1;
    }
    const newObject = { ...object, id: id };
    listObjs.push(newObject);

    try {
      await fs.promises.writeFile(
        path.join(__dirname + `/../database/${this.archive}`),
        JSON.stringify(listObjs, null, 2)
      );
      return console.log(`Se guardó el objeto con el id: ${id}`);
    } catch (err) {
      throw new Error("Error al guardar el objeto en el archivo.");
    }
  }
}

module.exports = storageManager;
