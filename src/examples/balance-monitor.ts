import { AlertBuilder } from '../alertbuilder.js'
import { DeNotifyClient } from '../denotifyclient.js'
import { FunctionBuilder } from '../functionbuilder.js'
import { FilterBuilder } from '../util/filter.js'
import * as dotenv from 'dotenv'
dotenv.config()

// Simple App to demonstrate usage. Created a balance monitoring alert, updates it and deletes it
async function main() {
	const api = await DeNotifyClient.create({
		email: process.env.EMAIL,
		password: process.env.PASSWORD,
		anonKey: process.env.ANON_KEY,
		projectId: process.env.PROJECT_ID
	})

	const network = 'avalanche'
	const address = '0x26985888d5b7019ff2A7444fB567D8F386c3b538'
	const myAddress = '0x7601630eC802952ba1ED2B6e4db16F699A0a5A87'
	const { abi } = await api.getAbi(network, address)
	const webhook = process.env.DISCORD_WEBHOOK as string

	const builder = FunctionBuilder.create(api)
	await builder.addFunction(address, 'getBalance', [myAddress], abi)

	// Create the Balance Monitor alert
	const alert = await AlertBuilder.create('Test Alert')
		.onNetwork('avalanche')
		.withTrigger('PollFunctionV2', {
			timeBase: 'time',
			timePeriod: '100s',
			functions: builder.get(),
			triggerOn: 'always'
		})
		.withNotification('Discord', {
			url: webhook,
			message: `Your avax balance is [{func_0_ret_0 / 1e18}](https://snowtrace.io/address/${myAddress})`
		})
		.config()

	// Create the alert with the API
	const triggerId = await api.createAlert(alert)
	console.log(triggerId)

	// Update the period to every 10s
	await api.updateAlert(triggerId, { trigger: { timePeriod: '10s' } })

	// Update the Filter using the filter builder
	const filter = FilterBuilder.new()
		.addCondition('WHERE', 'func_0_ret_0', 'Number', 'gt', 3)
		.finalise()
	await api.updateAlert(13, {
		trigger: {
			triggerOn: 'filter',
			filter,
			filterVersion: FilterBuilder.version()
		}
	})

	// Delete the filter in 10s
	setTimeout(async () => {
		await api.deleteAlert(triggerId)
	}, 10 * 1000)
}

main()
