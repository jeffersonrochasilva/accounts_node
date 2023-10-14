import chalk from "chalk";
import inquirer from "inquirer";

import fs from "fs";

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "criar conta",
          "Consultar saldo",
          "depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((response) => {
      const res = response["action"];
      if (res === "criar conta") {
        createAcount();
      } else if (res === "Consultar saldo") {
        seeValue();
      } else if (res === "depositar") {
        deposit();
      } else if (res === "Sacar") {
        getingAcount();
      } else if (res === "Sair") {
        console.log(chalk.bgBlue.black("Obrigado por usar o acounts!"));
        process.exit();
      }
    })
    .catch((error) => console.log(error));
}

function createAcount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));
  buildingAcount();
}

function buildingAcount() {
  inquirer
    .prompt([
      {
        name: "acountName",
        message: "Digite um nome para a sua conta",
      },
    ])
    .then((response) => {
      const res = response["acountName"];

      if (!fs.existsSync("acounts")) {
        fs.mkdirSync("acounts");
      }

      if (fs.existsSync(`acounts/${res}.json`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome")
        );
        buildingAcount();
        return;
      }

      fs.writeFileSync(
        `acounts/${res}.json`,
        '{"balance": 0}',
        function (error) {
          console.log("deu erro aqui", error);
        }
      );

      console.log(chalk.green("Paranbéns, a sua conta foi criada!"));
      operation();
    })
    .catch((error) => console.log(error));
}

function deposit() {
  inquirer
    .prompt([
      {
        name: "acountName",
        message: "Em qual conta deseja fazer o deposito?",
      },
    ])
    .then((response) => {
      const res = response["acountName"];
      if (!checkAcountName(res)) {
        console.log(chalk.bgRed.black("Essa conta não existe"));
        return deposit();
      }
      inquirer
        .prompt([
          {
            name: "acount",
            message: "Qual valor você deseja depositar?",
          },
        ])
        .then((response) => {
          const valor = response["acount"];
          addAmount(res, valor);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
}
function checkAcountName(item) {
  if (!fs.existsSync(`acounts/${item}.json`)) {
    return false;
  } else {
    return true;
  }
}

function addAmount(name, value) {
  const nameAmount = getAmount(name);
  if (!value) {
    console.log(chalk.bgRed.black("Ocorreu um erro, retorme a operação."));
    return deposit();
  }
  nameAmount.balance = parseFloat(value) + parseFloat(nameAmount.balance);

  fs.writeFileSync(
    `acounts/${name}.json`,
    JSON.stringify(nameAmount),
    function (error) {
      console.log(error);
    }
  );

  console.log(
    chalk.bgGreen.black(`Foi depositado o valorde ${value} na sua conta`)
  );
  return operation();
}
function getAmount(item) {
  const acountJson = fs.readFileSync(`acounts/${item}.json`, {
    encoding: "utf8",
    flag: "r",
  });
  return JSON.parse(acountJson);
}

function seeValue(item) {
  inquirer
    .prompt([
      {
        name: "name",
        message: "De qual conta você deseja ver o saldo?",
      },
    ])
    .then((response) => {
      const resposta = response["name"];
      const valor = getAmount(resposta);
      console.log(
        chalk.bgBlue.black(`o seu saldo em conta é de ${valor.balance}`)
      );
      return operation();
    })
    .catch((error) => console.log(error));
}

function getingAcount(name, value) {
  inquirer
    .prompt([
      {
        name: "name",
        message: "De que conta você deseja fazer o saque?",
      },
    ])
    .then((response) => {
      const res = response["name"];
      // const valor = getAmount(res)
      // const newValue = parseFloat(valor.balance)
      if (!getAmount(res)) {
        console.log(chalk.bgRed.black("Essa conta não existe."));
        return operation();
      }
      inquirer
        .prompt([
          {
            name: "name",
            message: "qual será o valor do seu saque?",
          },
        ])
        .then((response) => {
          const params = response["name"];
          const result = getAmount(res);
          const newValue = parseFloat(result.balance) - parseFloat(params);

          fs.writeFileSync(
            `acounts/${res}.json`,
            JSON.stringify({ balance: newValue }),
            function (error) {
              console.log(error);
            }
          );
          console.log(
            chalk.bgGreen.black(`Você realizou um saque de ${params}`)
          );
          return operation();
        })
        .catch((error) => console.log(error));
    });
}
