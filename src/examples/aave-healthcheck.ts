import { ethers } from "ethers"
import { AlertBuilder } from "../alertbuilder"
import { DeNotifyClient } from "../denotifyclient"
import { FunctionBuilder } from "../functionbuilder"
import { DiscordWebhook } from "../notifications/notify_discord_webhook"
import { PollFunctionV2 } from "../triggers/handler_function_call_v2"
import { FilterBuilder } from "../util/filter"

// Simple App to demonstrate usage. Created a balance monitoring alert, updates it and deletes it
async function main() {
	const api = await DeNotifyClient.create({
		email: 's.battenally@gmail.com',
		password: 'Password',
		projectId: 'xfxplbmdcoukaitzxzei',
		anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeHBsYm1kY291a2FpdHp4emVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgwMDg4NzMsImV4cCI6MTk5MzU4NDg3M30.WLk7bR5syQ4YJ8_jNOAuaT1UMvl7E2MS_VYMs7sN56c'
	})
	
	// const network = 'avalanche'
	// const address = '0x26985888d5b7019ff2A7444fB567D8F386c3b538'
	// const myAddress = '0x7601630eC802952ba1ED2B6e4db16F699A0a5A87'
	// const { abi } = await api.getAbi(network, address)
	// const webhook = 'https://discord.com/api/webhooks/1063967722276388874/VrdsvfyCTEtnRIk5Vzhj1Y0Fi7pFueN5dH9Bz7OeXyNpwJUI7ucIzdIQwpOq8amVgCbW'

	// const builder = FunctionBuilder.create(api)
	// await builder.addFunction(address, 'getBalance', [myAddress], abi)


	// // Create the Balance Monitor alert
	// const alert = AlertBuilder.create('Test Alert')
	// 	.onNetwork('avalanche')
	// 	.withTrigger<PollFunctionV2>('PollFunctionV2', {
	// 		timeBase: 'time',
	// 		timePeriod: '100s',
	// 		functions: builder.get(),
	// 		triggerOn: 'always',
	// 	})
	// 	.withNotification<DiscordWebhook>('Discord', {
	// 		url: webhook,
	// 		message: 
	// 		`
	// 		Your avax balance is [{func_0_ret_0 / 1e18}](https://snowtrace.io/address/${myAddress})
	// 		`,
	// 	})
	// 	.config()
	
	// // Create the alert with the API
	// const triggerId = await api.createAlert(alert)
	// console.log(triggerId)
	

	// // Update the period to every 10s
	// await api.updateTrigger(triggerId, { timePeriod: '10s' })

	// Update the Filter using the filter builder
	const filter = FilterBuilder.new()
		.addCondition('WHERE', 'func_0_ret_0', 'Number', 'gt', 3)
		.finalise()
	await api.updateTrigger(13, { triggerOn: 'filter', filter, filterVersion: FilterBuilder.version() })

	// Delete the filter in 10s
	// setTimeout(async () => {
	// 	await api.deleteAlert(triggerId)
	// }, 10 * 1000)

	
}

main()