const Discord= require('discord.js')
const db = require('quick.db')
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)})}
module.exports = {
    name: 'blacklist',
    aliases: ["bl"],
    run: async (client, message, args) => {
let prefix =  db.get(` ${process.env.owner}.prefix`)
if(prefix === null) prefix = process.env.prefix;
  let color = db.get(`${process.env.owner}.color`) 
   if(color === null  ) color = process.env.color
 
        if(process.env.owner ===message.author.id || db.get(`ownermd.${message.author.id}`) === true) {
     if(args[0]){
        let member = client.users.cache.get(message.author.id);
        if (args[0]) {
            member = client.users.cache.get(args[0]);
        } else {
            return message.channel.send(`Aucun membre trouvé pour \`${args[0]|| "rien"}\``)

        }
        if (message.mentions.members.first()) {
            member = client.users.cache.get(message.mentions.members.first().id);
        }
        if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[0]|| "rien"}\``)
        if (process.env.owner === member.id) { return message.channel.send(`Impossible de blacklist un owner`)}
        if (db.get(`ownermd.${member.id}`) === true) { return message.channel.send(`${member.username} est déjà owner`)}
        if (db.get(`blacklistmd.${member.id}`) === true) { return message.channel.send(`${member.username} est déjà blacklist`)}
      db.add(`${process.env.owner}.blacklistcount`,1)
      db.set(`blacklistmd.${member.id}`,true)

        db.push(`${process.env.owner}.blacklist`,  member.id)
        let nmb = 0
        let nmbe = 0
        client.guilds.cache.forEach(g => {
            if(g.members.cache.get(member.id)) {
                g.members.cache.get(member.id).ban().then(() => {nmb=nmb+1}).catch(err => {nmbe=nmbe+1})
             
            }
        });
            message.channel.send(`${member.username} est maintenant dans la blacklist\nIl a été **ban** de ${nmb || 0} ${nmb >1? "serveurs":"serveur"}\nJe n'ai pas pu le **ban** de ${nmbe || 0} ${nmbe >1? "serveurs":"serveur"}`)
        
       } else if(!args[0]) {

try {
    let own = db.get(`${process.env.owner}.blacklist`) 
    let ownc = db.get(`${process.env.owner}.blacklistcount`) 
    if(ownc === null)ownc=1
    let p0 = 0;
    let p1 = 30;
    let page = 1;
    let embed = new Discord.MessageEmbed()
   embed.setTitle("Blacklist")
    .setColor(color)
    .setDescription(!own   ? "None":own.map((user, i) => `<@${user}>`).slice(0, 30).join("\n")
    )
        .setFooter(`${page}/${Math.ceil(ownc||1/ 30)} • chupapi#6109`)
      message.channel.send(embed).then(async tdata => {
   

    if (ownc> 30) {
       await tdata.react("◀");
        await sleep(250);
         await tdata.react("▶");
        await sleep(250);
    }


    const data_res = tdata.createReactionCollector((reaction, user) => user.id === message.author.id);

    data_res.on("collect", async (reaction) => {

        if (reaction.emoji.name === "◀") {

            p0 = p0 - 30;
            p1 = p1 - 30;
            page = page - 1

            if (p0 < 0) {
                return
            }
            if (p0 === undefined || p1 === undefined) {
                return
            }


            embed  .setDescription(own
    
                        .map((user, i) => `<@${user}>`)

                .slice(0, 30)
    )

        .setFooter(`${page}/${Math.ceil(ownc/ 30)} • chupapi#6109`)
            tdata.edit(embed);

        }

        if (reaction.emoji.name === "▶") {

            p0 = p0 + 30;
            p1 = p1 + 30;

            page++;

            if (p1 > ownc+ 30) {
                return
            }
            if (p0 === undefined || p1 === undefined) {
                return
            }


            embed  .setDescription(own
    
                        .map((user, i) => `<@${user}>`)

                .slice(0, 30)
    )
                .setFooter(`${page}/${Math.ceil(ownc/ 30)} • chupapi#6109`)
                tdata.edit(embed);

        }



        await reaction.users.remove(message.author.id);

    })
      })
} catch (error) {
    console.log(error)
}
}} else {
    
}

    }
}