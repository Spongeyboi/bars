const { SlashCommandBuilder } = require('@discordjs/builders');

const settingschema = require('../schemas/serversettings')

const { emojis } = require('../settings.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Changes the settings of the bot')
		.addSubcommand(sub=>sub.setName('modlog').setDescription("Sets the modlog channel").addChannelOption(option=>option.setName('channel').setDescription('The modlog channel').setRequired(true)))

		.addSubcommand(sub=>sub.setName('memberlog').setDescription("Sets the memberlog channel").addChannelOption(option=>option.setName('channel').setDescription('The memberlog channel').setRequired(true)))

		.addSubcommand(sub=>sub.setName('messagelog').setDescription("Sets the messagelog channel").addChannelOption(option=>option.setName('channel').setDescription('The serverlog channel').setRequired(true)))

		.addSubcommand(sub=>sub.setName('serverlog').setDescription("Sets the serverlog channel").addChannelOption(option=>option.setName('channel').setDescription('The serverlog channel').setRequired(true)))

		.addSubcommand(sub=>sub.setName('mutedrole').setDescription("Sets the muted role for muted users").addRoleOption(option=>option.setName('role').setDescription('The muted role').setRequired(true)))

		.addSubcommand(sub=>sub.setName('modrole').setDescription("Sets the server's modrole, which gives them access to mod commands").addRoleOption(option=>option.setName('role').setDescription('The mod role').setRequired(true)))

		.addSubcommand(sub=>sub.setName('welcomechannel').setDescription("Sets the welcome channel").addChannelOption(option=>option.setName('channel').setDescription('The welcome channel').setRequired(true)).addStringOption(option=>option.setName('text').setDescription('The welcome text').setRequired(false)))

		.addSubcommand(sub=>sub.setName('goodbyechannel').setDescription("Sets the goodbye channel").addChannelOption(option=>option.setName('channel').setDescription('The goodbye channel').setRequired(true)).addStringOption(option=>option.setName('text').setDescription('The goodbye text').setRequired(false)))
		
		.addSubcommand(sub=>sub.setName('lockdown-channels').setDescription("Channels to lock during server lockdowb").addStringOption(option=>option.setName('channels').setDescription('List of channel ids, space to separate').setRequired(true))),
	async execute(interaction) {
		if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.reply(`${emojis.warn} | Only guild managers can change the server settings.`)
		await interaction.deferReply();
		const setting = await interaction.options.getSubcommand()
		let channel
		let role
		switch(setting){
			case 'modlog':
				 channel = interaction.options.getChannel('channel')
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,modlogchannel:channel.id},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			break;
			case 'memberlog':
				 channel = interaction.options.getChannel('channel')
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,memberlogchannel:channel.id},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			break;
			case 'messagelog':
				 channel = interaction.options.getChannel('channel')
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,messagelogchannel:channel.id},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			break;
			case 'serverlog':
				 channel = interaction.options.getChannel('channel')
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,serverlogchannel:channel.id},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			break;
			case 'mutedrole':
				 role = interaction.options.getRole('role')
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,mutedrole:role.id},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			break;
			case 'modrole':
				 role = interaction.options.getRole('role')
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,modrole:role.id},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			break;
			case 'welcome-channel':
				channel = interaction.options.getChannel('channel')
				text = interaction.options.getString('text') || "Welcome {{member}} to the server."
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,welcomechannel:channel.id,welcometext:text},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			case 'goodbye-channel':
				channel = interaction.options.getChannel('channel')
				text = interaction.options.getString('text') || "{{member}} has left the server."
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,goodbyechannel:channel.id,goodbyetext:text},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			case 'lockdown-channels':
				 channels = interaction.options.getString('channels')
				await settingschema.findOneAndUpdate({_id:interaction.guild.id},{_id:interaction.guild.id,lockdownchannel:channels},{upsert:true})
				.catch(()=>{return interaction.followUp(`${emojis.fail} | Oops, a database error occured.`)})
				.then(()=>{return interaction.followUp(`${emojis.success} | Setting successfully updated.`)})
			break;
		}
	},
	prefixname: 'settings',
	prefixdescription: 'Changes bot settings',
	async prefixed(client,message,args) {
		message.reply(`:x: | Settings can only be changed with slash commands.`)
	}
};