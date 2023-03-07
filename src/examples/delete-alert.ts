import { DeNotifyClient } from "../denotifyclient.js"

// Simple App to demonstrate deleting an alert
async function main() {
	const api = await DeNotifyClient.create({
		email: 's.battenally@gmail.com',
		password: 'Password',
		projectId: 'xfxplbmdcoukaitzxzei',
		anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmeHBsYm1kY291a2FpdHp4emVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgwMDg4NzMsImV4cCI6MTk5MzU4NDg3M30.WLk7bR5syQ4YJ8_jNOAuaT1UMvl7E2MS_VYMs7sN56c'
	})
	
	const alertId = 11
	await api.deleteAlert(alertId)	
}

main()