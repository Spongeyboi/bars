module.exports = {
	name: 'messageDelete',
	once: false,
	async execute(message) {
		const settingschema = require('../schemas/serversettings')

		const setting = await settingschema.findOne({_id:message.guild.id})

		if (setting){
			if (setting.messagelogchannel){
				var messagelog = await message.guild.channels.fetch(setting.messagelogchannel)
				.catch(()=>{return})
				if (!messagelog) return;

				messagelog.send({embeds:[
					{
						author:{name:'Message deleted',icon_url:message.member.user.displayAvatarURL({dynamic:true,size:1024})},
						description:`Message my ${message.member} was deleted in ${message.channel}`,
						fields:[
							{name:`Content`,value:message.content||"Unknown"}
						],
						color:`BLACK`,
						footer:{text:`ID: ${message.member.id}`},
						timestamp:new Date()
					}
				]})
			}
		}

		try{
			if(message.member.user.bot) return;
		  client.snipes.set(message.channel.id, {
		    content: message.content,
		    author: message.author.tag,
		    member: message.member,
		    image: message.attachments.first() ? message.attachments.first().proxyURL : null
		  })
			}catch(e){
				logger.log(`Couldn't set a snipe. Ignore this`)
			}
	},
};