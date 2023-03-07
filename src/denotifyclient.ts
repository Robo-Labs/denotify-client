import { createClient } from "@supabase/supabase-js"
import axios from "axios"
import { Notification } from "./notifications/notification.js"
import { AlertConfig, DeNotifyOptions } from "./types/types.js"
import { Trigger, TriggerUpdate } from "./triggers/trigger.js"

const toFunctionsUrl = (id: string) => {
    return `https://${id}.functions.supabase.co/`
} 

const toApiUrl = (id: string) => {
    return `https://${id}.supabase.co/`
}

const PROD_PROJECT_ID = 'fdgtrxmmrtlokhgkvcjz'
// const API_URL = ''
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3RyeG1tcnRsb2toZ2t2Y2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMwODcwNzYsImV4cCI6MTk4ODY2MzA3Nn0.sAMxjlcJSSozBGr-LNcsudyxzUEM9e-UspMHHQLqLr4'


export class DeNotifyClient {
    private headers: any = {}
	private constructor(private url: string, private token: string) {
        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
	}

	public static async create(options: DeNotifyOptions): Promise<DeNotifyClient> {
		if (options.key) {
			// TODO
			throw new Error('Auth by key not yet supported')
		} else if (options.email && options.password) {	
			const url = options.projectId ? toApiUrl(options.projectId) : toApiUrl(PROD_PROJECT_ID)
			const functionsUrl = options.projectId ? toFunctionsUrl(options.projectId) : toFunctionsUrl(PROD_PROJECT_ID)
			const anonKey = options.anonKey ? options.anonKey : ANON_KEY
			const supabase = createClient(url, anonKey)
			const { data: login, error } = await supabase.auth.signInWithPassword({
				email: options.email,
				password: options.password,
			})

			if (error)
				throw error
			
			if (login.session?.access_token === undefined)
				throw new Error('Access token not found')

			return new DeNotifyClient(functionsUrl, login.session?.access_token)			
		} else {
			throw new Error('Authentication Required. DeNotify supports either username/password or API key authentication')
		}
	}

	public async alertHistory(id: number | null, pagination: { page?: number, size?: number } = {}) {
		const alerts = await this.request(
			'get', 
			`alert-history${id ? '/' + id : ''}`,
			{ params: pagination }
		)
		return alerts
	}

	public async getAlert(id: number) {
		const alerts = await this.request('get', `alerts/${id}`)
		return alerts[0]
	}

	public async getAlerts() {
		const alerts = await this.request('get', 'alerts')
		return alerts
	}


	public async createAlert(config: AlertConfig) {
		const trigger = Trigger.SimpleToRaw(config.name, config.triggerId, config.network, config.trigger)
		const notification = Notification.SimpleToRaw(config.notificationId, config.notification)
		const alert = await this.request('post', `alerts`, { body: { trigger, notification } })
		return alert
	}

	public async deleteAlert(id: number) {
		const alerts = await this.request('delete', `alerts/${id}`)
		return alerts
	}

	private async request(method: 'get' | 'post' | 'patch' | 'delete', path: string, options: { body?: any, params?: any } = {}) {
		const url = new URL(`${this.url}${path}`)

		// append params
		if (options.params) {
			for (const param of Object.keys(options.params)) {
				url.searchParams.append(param, options.params[param])
			}
		}

		const payload: any = {
			method,
			url: url.toString(),
			headers: this.headers
		}
		if (options.body)
			payload.data = options.body
		const res = await axios(payload);
		return res.data
	} 

	public async getAbi(network: string, address: string): Promise<{ abi: any[], proxy?: string }>  {
		const ret = await this.request('get', `abi/${network}/${address}`)
		return ret

	}
	

	public async getAbiHash(abi: any) {
		const ret = await this.request('post', 'abi', { body: abi })
		return ret.hash
	}

	public async setAlertName(triggerId: number, name: string) {
		
	}

	public async enableAlert(triggerId: number) {
		
	}

	public async disableAlert(triggerId: number) {
		
	}

	public async updateTrigger(triggerId: number, update: TriggerUpdate) {
		const ret = await this.request('patch', `alerts/trigger-handler/${triggerId}`, { body: update })
		return ret		
	}


    // public async updateAlert(alertId: number, type: AlertUpdateType, update: NotifyUpdate | TriggerUpdate | HandlerUpdate): Promise<AlertRepsonse>  {
    //     switch (type) {
    //         case 'notify': return await this.updateNotify(alertId, update as NotifyUpdate)
    //         case 'trigger': return await this.updateTrigger(alertId, update as TriggerUpdate)
    //         case 'trigger-handler': return await this.updateTriggerHandler(alertId, update as HandlerUpdate)
    //     }
    // }

    // public async updateNotify(alertId: number, update: NotifyUpdate): Promise<AlertRepsonse>  {
    //     const { data } = (await this.request('update-alert', 'post', { 
    //         id: alertId,
    //         type: 'notify', 
    //         options: update,
    //     }))
    //     return data
    // }

    // public async updateTrigger(alertId: number, update: TriggerUpdate): Promise<AlertRepsonse>  {
    //     const { data } = (await this.request('update-alert', 'post', { 
    //         id: alertId,
    //         type: 'trigger', 
    //         options: update,
    //     }))
    //     return data
    // }

    // public async updateTriggerHandler(alertId: number, update: HandlerUpdate): Promise<AlertRepsonse>  {
    //     const { data } = (await this.request('update-alert', 'post', { 
    //         id: alertId,
    //         type: 'trigger-handler', 
    //         options: update,
    //     }))
    //     return data
    // }

}