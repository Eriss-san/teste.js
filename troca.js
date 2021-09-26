const Command = require("../../structures/Command");
const Emojis = require("../../utils/Emojis");
const ms = require("ms");
const User = require("../../database/Schemas/User");

module.exports = class Background extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "troca";
    this.category = "";
    this.description = "";
    this.usage = "";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run({ message, args, prefix, author }, t) {
    const doc = await this.client.database.users.findOne({
      idU: message.author.id,
    });

    const USER =
      this.client.users.cache.get(args[1]) ||
      message.mentions.users.first() ||
      message.author;

    const user = await this.client.database.users.findOne({ idU: USER.id });

    if (!args[0])
      return message.reply(
        `${Emojis.errado} » ${message.author}, modo de usar o comando: **${prefix}troca mine <nome> <quantidade>**.\n> ex: \`${prefix}troca mine cavão 1\`.`
      );

    const itens = {
      carvão: 1,
      ametista: 1,
      esmeralda: 1,
      ruby: 1,
      safira: 1,
    };

    if (args[0].toLowerCase() !== "mine") {
      return message.reply(
        `${Emojis.errado} » ${message.author}, essa ação não pode ser executada.\n> Use: \`${prefix}troca mine <nome> <quantidade>\`.`
      );
    }
    if (!args[1])
      return message.reply(
        `${Emojis.errado} » ${message.author}, você não inseriu o **nome** do **minérios**.`
      );
    const name = args[1].toLowerCase();

    const minerios = {
      carvao: user.cavao,
      cavao: user.cavao,
      ametista: user.ametista,
      esmeralda: user.Esmeralda,
      ruby: user.Ruby,
      safira: user.Safira,
    };

    let cavao = user.cavao;
    let ametista = user.ametista;
    let esmeralda = user.Esmeralda;
    let ruby = user.Ruby;
    let safira = user.Safira; //aqui é pra definir elas na linha 98 pra baixo

    let price = itens[name];
    const item = itens[name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")];
    if (!price || name === 0)
      return message.reply(
        `${Emojis.picks} » ${message.author}, não temos nenhum **minério** com este nome.\n**Minérios que temos**:\n> **${Emojis.cavão} cavão\n> ${Emojis.ametista} Ametista\n> ${Emojis.esme} Esmeralda\n> ${Emojis.ruby} Ruby\n> ${Emojis.safira} Safira**`
      );
    console.log(item <= 0);

    if (price > doc.bank || item <= 0)
      return message.reply(
        `${Emojis.errado} » ${message.author}, você não tem **minérios** o suficiente para trocar.`
      );
    else {
      if (!args[2])
        return message.reply(
          `${Emojis.errado} » ${message.author}, você não inseriu quantos **minérios** você quer trocar.`
        );

      let time = ms(args[2]);
      if (time < ms("1") || time > ms("1")) {
        return message.reply(
          `${Emojis.errado} » ${message.author}, não é possível trocar menos ou mais de 1 minério.`
        );
      }
      if (String(time) == "undefined") {
        return message.reply(
          `${Emojis.errado} » ${message.author}, o número inserido é inválido.`
        );
      } else {
        if (name == "carvão") {
          message.reply(
            `${Emojis.cavão} » ${message.author}, você trocou seu **Cavão** com sucesso.`
          );
          return await User.findOneAndUpdate(
            { idU: USER.id },
            {
              $set: {
                coins: doc.coins + 500,
                cavao: cavao - 1,
              },
            }
          );
        }
        if (name == "ametista") {
          message.reply(
            `${Emojis.ametista} » ${message.author}, você trocou sua **Ametista** com sucesso.`
          );
          return await User.findOneAndUpdate(
            { idU: USER.id },
            {
              $set: {
                coins: doc.coins + 1000,
                ametista: ametista - 1,
              },
            }
          );
        }
        if (name == "esmeralda") {
          message.reply(
            `${Emojis.esme} » ${message.author}, você trocou sua **Esmeralda** por com sucesso.`
          );
          return await User.findOneAndUpdate(
            { idU: USER.id },
            {
              $set: {
                coins: doc.coins + 2000,
                Esmeralda: esmeralda - 1,
              },
            }
          );
        }
        if (name == "ruby") {
          message.reply(
            `${Emojis.ruby} » ${message.author}, você trocou sua **Ruby** por com sucesso.`
          );
          return await User.findOneAndUpdate(
            { idU: USER.id },
            {
              $set: {
                coins: doc.coins + 4000,
                Ruby: ruby - 1,
              },
            }
          );
        }
        if (name == "safira") {
          message.reply(
            `${Emojis.safira} » ${message.author}, você trocou sua **Safira** por com sucesso.`
          );
          return await User.findOneAndUpdate(
            { idU: USER.id },
            {
              $set: {
                coins: doc.coins + 8000,
                Safira: safira - 1,
              },
            }
          );
        }
      }
    }
  }
};
