const Command = require("../../structures/Command");
const Emojis = require("../../utils/Emojis");
const ClientEmbed = require("../../structures/ClientEmbed");
const moment = require("moment");
require("moment-duration-format");
const Utils = require("../../utils/Util");

module.exports = class Factory extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "factory";
    this.category = "Economia";
    this.description = "Comando do sistema de Fábrica do Bot.";
    this.usage = `\n> **factory info** <user>\n > **factory invite** <user>\n> **factory kick** <user> \n> **factory work**\n> **factory create**\n> **factory up**\n> **factory name <nome>**`;
    this.aliases = ["fabrica", "fb", "factory"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run({ message, args, prefix, author }, t) {
    const USER =
      this.client.users.cache.get(args[0]) ||
      message.mentions.users.first() ||
      message.author;

    const user = await this.client.database.users.findOne({ idU: USER.id });
    const fb = user?.factory;
    let money = Math.ceil(fb.level * 2 * fb.coins + 200);
    console.log(fb.level, fb.coins, Math.ceil(fb.level * 2 * fb.coins + 200))
    if (!args[0]) {
      if (!fb.hasFactory)
        return message.reply(
          `${Emojis.errado} - ${message.author}, ${
            USER.id == message.author
              ? `você não faz parte de nenhuma Fábrica.\n> Para criar uma use: **${prefix}factory create (Preço: 20k)**\n> Ou peça para alguém lhe convidar para uma Fábrica.\n> Para saber mais sobre o sistema de Fábrica use: **${prefix}factory help**`
              : `o ${USER} não faz parte de uma Fábrica.`
          }`
        );
      const owner = await this.client.users.fetch(fb.owner);
      const fd = await this.client.database.users
        .findOne({ idU: owner.id })
        .then((x) => x.factory);

      const members = [];
      const list = fd.employers;

      await this.PUSH(members, list);

      const EMBED = new ClientEmbed(author)
        .setTitle(`${Emojis.fabrica} Informações da Fábrica`)
        .addFields(
          {
            name: `${Emojis.donozinhoz} Dono(a) da Fábrica`,
            value: `${owner.tag} ( ${
              2.88e7 - (Date.now() - fd.lastWork) < 0
                ? "**Pode Trabalhar**"
                : `\`${moment
                    .duration(2.88e7 - (Date.now() - fd.lastWork))
                    .format("h[h], m[m] s[s]")}\``
            } )`,
          },
          {
            name: `${Emojis.name} Nome da Fábrica`,
            value: fd.name == "null" ? "Nome não Definido" : fd.name,
          },
          {
            name: `Level **${fd.level}** » XP: [**${fd.exp}/${
              fd.level * fd.nextLevel
            }**]`,
            value: `\`\`\`css\n[${this.progressBar(
              fd.exp > fd.level * fd.nextLevel
                ? fd.level * fd.nextLevel
                : fd.exp,
              fd.level * fd.nextLevel,
              25
            )}]\`\`\``,
          },
          {
            name: `${Emojis.members} Funcionários [${fb.employers.length}]`,
            value: !fd.employers.length
              ? "Nenhum Funcionário no Momento"
              : `${members
                  .map(
                    (x) =>
                      `**\`${x.user.tag}\`** (${
                        2.88e7 - (Date.now() - x.lastWork) < 0
                          ? "**Pode Trabalhar**"
                          : `\`${moment
                              .duration(2.88e7 - (Date.now() - x.lastWork))
                              .format("h [horas], m [minutos] e s [segundos]")
                              .replace("minsutos", "minutos")}\``
                      })`
                  )
                  .join("\n")}`,
          },
          {
            name: `${Emojis.drakCoins} Salário`,
            value: `${Utils.toAbbrev(money)} MCoins`,
          }
        );

      message.reply({ embeds: [EMBED] });
      return;
    }
    if (["help"].includes(args[0].toLowerCase())) {
      const HELP = new ClientEmbed(author)
        .setTitle(`${Emojis.factory} Sistema de Fábrica`)
        .setDescription(
          `\n\`\`\`fix\n${prefix}factory info <user>\n${prefix}factory invite <user>\n${prefix}factory kick <user>\n${prefix}factory work\n${prefix}factory create\n${prefix}factory up\n${prefix}factory name <nome>\n${prefix}factory-rank\`\`\`\n${Emojis.certo} Como Funciona? Você cria sua Fábrica **( custo de 20K )**, e assim que você criar ela chame seus amigos para trabalhar com você e assim que você trabalha é aplicado um **cooldown de 8 horas** para trabalhar novamente.`
        );
      message.reply({ embeds: [HELP] });
      return;
    }
    if (["info"].includes(args[0].toLowerCase())) {
      if (!fb.hasFactory)
        return message.reply(
          `${Emojis.errado} » ${message.author}, ${
            USER.id == message.author
              ? `você não faz parte de nenhuma Fábrica.\n> Para criar uma use: **${prefix}fb create (Preço: 20k)**\n> Ou peça para alguém lhe convidar para uma Fábrica.\n> Para saber mais sobre o sistema de Fábrica use: **${prefix}factory help**`
              : `o ${USER} não faz parte de uma Fábrica.`
          }`
        );
      const owner = await this.client.users.fetch(fb.owner);
      const fd = await this.client.database.users
        .findOne({ idU: owner.id })
        .then((x) => x.factory);

      const members = [];
      const list = fd.employers;

      await this.PUSH(members, list);

      const EMBED = new ClientEmbed(author)
        .setTitle(`${Emojis.fabrica} Informações da Fábrica`)
        .addFields(
          {
            name: `${Emojis.donozinhoz} Dono(a) da Fábrica`,
            value: `${owner.tag} ( ${
              2.88e7 - (Date.now() - fd.lastWork) < 0
                ? "**Pode Trabalhar**"
                : `\`${moment
                    .duration(2.88e7 - (Date.now() - fd.lastWork))
                    .format("h[h], m[m] s[s]")}\``
            } )`,
          },
          {
            name: `${Emojis.idcard} Nome da Fábrica`,
            value: fd.name == "null" ? "Nome não Definido" : fd.name,
          },
          {
            name: `Level **${fd.level}** » XP: [**${fd.exp}/${
              fd.level * fd.nextLevel
            }**]`,
            value: `\`\`\`css\n[${this.progressBar(
              fd.exp > fd.level * fd.nextLevel
                ? fd.level * fd.nextLevel
                : fd.exp,
              fd.level * fd.nextLevel,
              25
            )}]\`\`\``,
          },
          {
            name: `${Emojis.members} Funcionários [${fb.employers.length}]`,
            value: !fd.employers.length
              ? "Nenhum Funcionário no Momento"
              : `${members
                  .map(
                    (x) =>
                      `**\`${x.user.tag}\`** (${
                        2.88e7 - (Date.now() - x.lastWork) < 0
                          ? "**Pode Trabalhar**"
                          : `\`${moment
                              .duration(2.88e7 - (Date.now() - x.lastWork))
                              .format("h [horas], m [minutos] e s [segundos]")
                              .replace("minsutos", "minutos")}\``
                      })`
                  )
                  .join("\n")}`,
          },
          {
            name: `${Emojis.drakCoins} Salário`,
            value: `${Utils.toAbbrev(money)} TCoins`,
          }
        );

      return message.reply({ embeds: [EMBED] });
    }

    if (["work", "trabalhar"].includes(args[0].toLowerCase())) {
      const user = await this.client.database.users.findOne({
        idU: message.author.id,
      });
      const fd = user?.factory;

      if (!fd.hasFactory)
        return message.reply(
          `${Emojis.errado} » ${message.author}, ${
            USER.id == message.author
              ? `você não faz parte de nenhuma Fábrica.\n> Para criar uma use: **${prefix}fb create (Preço: 20k)**\n> Ou peça para alguém lhe convidar para uma Fábrica.\n> Para saber mais sobre o sistema de Fábrica use: **${prefix}factory help**`
              : `o ${USER} não faz parte de uma Fábrica.`
          }`
        );

      let XP = this.generateRandomNumber(20, 500);
      let money = Math.ceil(fb.level * 2 * fb.coins + 200);

      let cooldown = 2.88e7 - (Date.now() - fd.lastWork);

      if (cooldown > 0) {
        return message.reply(
          `${Emojis.errado} » ${message.author}, você deve aguardar **${moment
            .duration(cooldown)
            .format("h [horas], m [minutos] e s [segundos]")
            .replace("minsutos", "minutos")}** para poder trabalhar novamente.`
        );
      } else {
        message.reply(
          `${Emojis.drakCoins} » ${
            message.author
          }, você trabalhou com sucesso e conseguiu **${XP} XP** para sua Fábrica e **${Utils.toAbbrev(
            money
          )} TCoins** que já foram depositados em seu banco.`
        );

        const owner = await this.client.users.fetch(fd.owner);
        const fc = await this.client.database.users
          .findOne({ idU: owner.id })
          .then((x) => x.factory);

        await this.client.database.users.findOneAndUpdate(
          { idU: message.author.id },
          { $set: { bank: user.bank + money, "factory.lastWork": Date.now() } }
        );
        await this.client.database.users.findOneAndUpdate(
          { idU: owner.id },
          { $set: { "factory.exp": fc.exp + XP } }
        );
      }
    }

    if (["kick", "demitir", "kickar"].includes(args[0].toLowerCase())) {
      if (!fb.hasFactory)
        return message.reply(
          `${Emojis.errado} - ${message.author}, ${
            USER.id == message.author
              ? `você não faz parte de nenhuma Fábrica.\n> Para criar uma use: **${prefix}fb create (Preço: 20k)**\n> Ou peça para alguém lhe convidar para uma Fábrica.\n> Para saber mais sobre o sistema de Fábrica use: **${prefix}factory help**`
              : `o ${USER} não faz parte de uma Fábrica.`
          }`
        );
      if (USER.id === message.author.id)
        return message.reply(
          `${Emojis.errado} » ${message.author}, você não pode se kickar da Fábrica.`
        );

      const owner = await this.client.users.fetch(fb.owner);
      const fd = await this.client.database.users
        .findOne({ idU: owner.id })
        .then((x) => x.factory);

      if (!fd.employers.some((x) => x === USER.id)) {
        return message.reply(
          `${Emojis.errado} » ${message.author}, este usuário não está contratado em sua Fábrica.`
        );
      } else {
        message.reply(
          `${Emojis.certo} » ${message.author}, funcionário demitido com sucesso.`
        );

        await this.client.database.users.findOneAndUpdate(
          { idU: message.author.id },
          { $pull: { "factory.employers": USER.id } }
        );

        await this.client.database.users.findOneAndUpdate(
          { idU: USER.id },
          {
            $set: {
              "factory.owner": "null",
              "factory.hasFactory": false,
            },
          }
        );
      }
    }
    if (["invite", "convidar", "contratar"].includes(args[0].toLowerCase())) {
      if (USER.bot)
        return message.reply(
          `${Emojis.errado} » ${message.author}, não é possível contratar Bots.`
        );

      if (!USER && USER.id == message.author.id) {
        return message.reply(
          `${Emojis.errado} » ${message.author}, você deve mencionar quem deseja contratar primeiro.`
        );
      } else if (user.factory.hasFactory) {
        return message.reply(
          `${Emojis.errado} » ${message.author}, este membro já possui uma Fábrica ou está em uma.`
        );
      } else {
        if (USER.id === message.author.id)
          return message.reply(
            `${Emojis.errado} » ${message.author}, você não pode si contratar para uma Fábrica.`
          );
        if (!USER)
          return message.reply(
            `${Emojis.errado} » ${message.author}, você deve mencionar quem deseja contratar.`
          );
        message
          .reply(
            `${Emojis.help} » ${USER}, o(a) ${message.author} lhe fez uma proposta de trabalho, ele está convidando você para ser funcionário na empresa dele!\n\nDeseja aceitar a contratação? \`SIM\` - **Aceita** | \`NÃO\` - **Recusa**`
          )
          .then(async (msg) => {
            let collector = msg.channel.createMessageCollector(
              (m) => m.author.id === USER.id,
              {
                max: 1,
                time: 150000,
              }
            );

            collector.on("collect", async (collected) => {
              if (
                ["sim", "y", "yes", "s"].includes(
                  collected.content.toLowerCase()
                )
              ) {
                message.reply(
                  `${Emojis.certo} » ${message.author}, você contratou o(a) usuário(a) ${USER} com sucesso.`
                );

                await this.client.database.users.findOneAndUpdate(
                  { idU: message.author.id },
                  { $push: { "factory.employers": USER.id } }
                );

                await this.client.database.users.findOneAndUpdate(
                  { idU: USER.id },
                  {
                    $set: {
                      "factory.owner": message.author.id,
                      "factory.hasFactory": true,
                      "factory.lastWork": 0,
                    },
                  }
                );
                msg.delete();
                collector.stop();
              }

              if (
                ["não", "nao", "no", "n"].includes(
                  collected.content.toLowerCase()
                )
              ) {
                message.reply(
                  `${Emojis.errado} » ${message.author}, o(a) ${USER} recusou o pedido.`
                );
                msg.delete();
                collector.stop();
              }
            });
          });
      }
    }

    if (["up", "upar", "subir"].includes(args[0].toLowerCase())) {
      if (!fb.createFactory)
        return message.reply(
          `${Emojis.errado} » ${message.author}, somente o Dono(a) da fábrica pode subir o level dela.`
        );

      if (fb.nextLevel * fb.level > fb.exp)
        return message.reply(
          `${Emojis.errado} » ${message.author}, a fábrica não tem o xp suficiente para upar de level.`
        );

      message.reply(
        `${Emojis.certo} » ${message.author}, a fábrica foi elevada com sucesso.`
      );

      await this.client.database.users.findOneAndUpdate(
        { idU: message.author.id },
        {
          $set: {
            "factory.level": fb.level + 1,
            "factory.exp": fb.exp - fb.nextLevel * fb.level,
          },
        }
      );

      return;
    }

    if (["name", "nome"].includes(args[0].toLowerCase())) {
      if (!fb.createFactory)
        return message.reply(
          `${Emojis.errado} » ${message.author}, somente o Dono(a) da fábrica pode alterar o nome dela.`
        );

      const name = args.slice(1).join(" ");

      if (name.length > 20)
        return message.reply(
          `${Emojis.errado} » ${message.author}, o nome da fábrica deve conter 20 ou menos caracteres.`
        );

      if (fb.name === name)
        return message.reply(
          `${Emojis.errado} » ${message.author}, o nome inserido é o mesmo setado atualmente.`
        );

      message.reply(
        `${Emojis.certo} » ${message.author}, o nome da sua fábrica foi alterado com sucesso!`
      );
      await this.client.database.users.findOneAndUpdate(
        { idU: message.author.id },
        { $set: { "factory.name": name } }
      );

      return;
    }

    if (["create", "criar"].includes(args[0].toLowerCase())) {
      if (fb.hasFactory) {
        return message.reply(
          `${Emojis.errado} » ${message.author}, você já faz parte de uma Fábrica, portanto não é possível criar uma.`
        );
      } else if (user.bank < 20000) {
        return message.reply(
          `${Emojis.errado} » ${message.author}, você precisa de **20k TCoins** para criar uma Fábrica.`
        );
      } else {
        message.reply(
          `${Emojis.certo} » ${message.author}, sua Fábrica foi criada com sucesso.`
        );
        await this.client.database.users.findOneAndUpdate(
          { idU: message.author.id },
          {
            $set: {
              "factory.name": "null",
              "factory.exp": 0,
              "factory.coins": 200,
              "factory.level": 1,
              "factory.nextLevel": 500,
              "factory.owner": message.author.id,
              "factory.employers": [],
              "factory.hasFactory": true,
              "factory.createFactory": true,
              "factory.lastWork": 0,
              bank: user.bank - 20000,
            },
          }
        );
      }
    }
  }
  async PUSH(members, list) {
    for (const employer of list) {
      const doc = await this.client.database.users
        .findOne({ idU: employer })
        .then((x) => x.factory);
      members.push({
        user: await this.client.users.fetch(employer).then((user) => {
          return user;
        }),
        lastWork: doc.lastWork,
      });
    }
  }
  generateRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  progressBar(current, total, barSize) {
    const progress = Math.round((barSize * current) / total);

    return "▮".repeat(progress) + ":".repeat(barSize - progress);
  }
};
