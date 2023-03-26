import { TelegramSchema } from '../src/notifications/notify_telegram'

test('test schema', () => {
	TelegramSchema.validate({
		clientId: 1232132,
		content: 'hello'
	})
})
