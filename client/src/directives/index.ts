import type { App } from 'vue'

const modules = import.meta.glob<{ install: (app: App) => void }>('./modules/*.ts', {
	eager: true,
})

export function setupDirectives(app: App) {
	Object.values(modules).map(i => app.use(i))
}
