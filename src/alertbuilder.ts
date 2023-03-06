import { TriggerType } from "./types/trigger"

export class AlertBuilder {

	// private trigger = 

	private constructor(private name: string) {}

	public static create(name: string) {
		return new AlertBuilder(name)
	}

	public withTrigger<T = TriggerType>(options: T): AlertBuilder {
		return this
	}
	
	public withNotification<T = NotificationType>(options: T): AlertBuilder {
		return this
	}

	public config() {
		return {}
	}
}