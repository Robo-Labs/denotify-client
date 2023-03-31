import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import {
	Notification,
	NotificationHelper,
	NotificationRawConfig,
	NotificationRawResponse,
	NotificationTypeId,
	NotifyRawId
} from './notifications/notification.js'
import { DeNotifyOptions } from './types/types.js'
import {
	Network,
	Trigger,
	TriggerHelper,
	TriggerRawConfig,
	TriggerRawResponse,
	TriggerTypeId,
	TriggerTypeRawId,
	TriggerUpdate
} from './triggers/trigger.js'

const toFunctionsUrl = (id: string) => {
	return `https://${id}.functions.supabase.co/`
}

const toApiUrl = (id: string) => {
	return `https://${id}.supabase.co/`
}

const PROD_PROJECT_ID = 'fdgtrxmmrtlokhgkvcjz'
// const API_URL = ''
const ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3RyeG1tcnRsb2toZ2t2Y2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzMwODcwNzYsImV4cCI6MTk4ODY2MzA3Nn0.sAMxjlcJSSozBGr-LNcsudyxzUEM9e-UspMHHQLqLr4'

type Pagination = { page?: number; size?: number }
type HistoryParams = { id?: number; page?: number; size?: number }
type AlertHistory = {
	type: 'trigger' | 'notification'
	set: boolean
	alert_id: number
	block: number
	metadata: any
	subtype: TriggerTypeRawId | NotifyRawId
}

export type Alert = {
	name: string
	network: Network
	id?: number
	triggerId: TriggerTypeId
	trigger: Trigger
	notificationId: NotificationTypeId
	notification: Notification
}

type AlertRawCreate = {
	trigger: TriggerRawConfig
	notification: NotificationRawConfig
}

type AlertRawResponse = {
	alertId: number
	trigger: TriggerRawResponse
	notification: NotificationRawResponse
}

export class DeNotifyClient {
	private headers: any = {}
	private constructor(private url: string, token: string) {
		this.headers = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}
	}

	public static async create(
		options: DeNotifyOptions
	): Promise<DeNotifyClient> {
		if (options.key) {
			// TODO
			throw new Error('Auth by key not yet supported')
		} else if (options.email && options.password) {
			const url = options.projectId
				? toApiUrl(options.projectId)
				: toApiUrl(PROD_PROJECT_ID)
			const functionsUrl = options.projectId
				? toFunctionsUrl(options.projectId)
				: toFunctionsUrl(PROD_PROJECT_ID)
			const anonKey = options.anonKey ? options.anonKey : ANON_KEY
			const supabase = createClient(url, anonKey)
			const { data: login, error } = await supabase.auth.signInWithPassword({
				email: options.email,
				password: options.password
			})

			if (error) {
				throw error
			}

			if (login.session?.access_token === undefined) {
				throw new Error('Access token not found')
			}

			return new DeNotifyClient(functionsUrl, login.session?.access_token)
		} else {
			throw new Error(
				'Authentication Required. DeNotify supports either username/password or API key authentication'
			)
		}
	}

	public async alertHistory(
		id?: number | null,
		pagination?: Pagination
	): Promise<{ params: HistoryParams; history: AlertHistory[] }> {
		const url = `alert-history`
		const params: any = pagination ? pagination : {}
		if (id) params.id = id

		if (Object.keys(params).length > 0) {
			return await this.request('get', url, { params: pagination })
		} else {
			return await this.request('get', url)
		}
	}

	public async getAlert(id: number): Promise<Alert> {
		const raw = (
			await this.request('get', `alerts/${id}`)
		)[0] as AlertRawResponse
		return await this.decode(raw)
	}

	public async getAlerts(): Promise<Alert[]> {
		const raw = (await this.request('get', 'alerts')) as AlertRawResponse[]
		return Promise.all(raw.map(raw => this.decode(raw)))
	}

	public async createAlert(config: Alert) {
		const body = await this.encode(config)
		const alert = await this.request('post', `alerts`, { body })
		return alert
	}

	public async deleteAlert(id: number) {
		const alerts = await this.request('delete', `alerts/${id}`)
		return alerts
	}

	private async decode(raw: AlertRawResponse): Promise<Alert> {
		const alert: Alert = {
			id: raw.alertId,
			name: raw.trigger.nickname,
			network: raw.trigger.network,
			triggerId: TriggerHelper.RawTypeToSimpleType(raw.trigger.type),
			trigger: await TriggerHelper.RawToSimple(raw.trigger),
			notificationId: NotificationHelper.RawTypeToSimpleType(
				raw.notification.notify_type
			),
			notification: await NotificationHelper.RawToSimple(raw.notification)
		}
		return alert
	}

	private async encode(alert: Alert): Promise<AlertRawCreate> {
		const raw: AlertRawCreate = {
			trigger: await TriggerHelper.SimpleToRaw(
				alert.name,
				alert.triggerId,
				alert.network,
				alert.trigger
			),
			notification: await NotificationHelper.SimpleToRaw(
				alert.notificationId,
				alert.notification
			)
		}
		return raw
	}

	private async request(
		method: 'get' | 'post' | 'patch' | 'delete',
		path: string,
		options: { body?: any; params?: any } = {}
	) {
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
		if (options.body) {
			payload.data = options.body
		}
		const res = await axios(payload)
		return res.data
	}

	public async getAbi(
		network: string,
		address: string
	): Promise<{ abi: unknown[]; proxy?: string; hash: string }> {
		const ret = await this.request('get', `abi/${network}/${address}`)
		return ret
	}

	public async getAbiHash(abi: unknown) {
		const ret = await this.request('post', 'abi', { body: abi })
		return ret.hash
	}

	public async setAlertName(_triggerId: number, _name: string) {
		throw new Error('Not yet supported - Sorry!')
	}

	public async enableAlert(_triggerId: number) {
		throw new Error('Not yet supported - Sorry!')
	}

	public async disableAlert(_triggerId: number) {
		throw new Error('Not yet supported - Sorry!')
	}

	public async updateNotification(_triggerId: number) {
		throw new Error('Not yet supported - Sorry!')
	}

	public async updateTrigger(triggerId: number, update: TriggerUpdate) {
		// TODO - Input validation
		const ret = await this.request(
			'patch',
			`alerts/trigger-handler/${triggerId}`,
			{ body: update }
		)
		return ret
	}
}
