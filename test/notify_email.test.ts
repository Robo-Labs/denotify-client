import { EmailSchema } from '../src/notifications/notify_email'

test('test schema', () => {
	EmailSchema.validate({
		email: 'test@google.com',
		subject: 'tests',
		html: '<h1>test</h1>'
	})
})
