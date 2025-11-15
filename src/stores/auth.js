import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        companies: [],
        activeCompany: JSON.parse(localStorage.getItem('activeCompany')) || null,
    }),

    getters: {
        roles: (state) => state.user?.roles || [], // [{uuid, name, company, permissions, centers}]

        // companies: (state) => {
        // 	// Evitar duplicados
        // 	const map = new Map();
        // 	for (const r of state.user?.roles || []) {
        // 		if (r.company) {
        // 			map.set(r.company.uuid, r.company);
        // 		}
        // 	}
        // 	return Array.from(map.values());
        // },
        activeRoles: (state) => state.roles.filter((r) => r.company.uuid === state.activeCompany.uuid),

        permissions() {
            const perms = new Set()
            for (const role of this.activeRoles) {
                // 👈 uso otro getter
                for (const p of role.permissions || []) {
                    perms.add(p.name)
                }
            }
            return Array.from(perms)
        },
    },

    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },

        setUser(user) {
            this.user = user
        },
        setCompanies(companies) {
            this.companies = companies
        },

        setActiveCompany(company) {
            this.activeCompany = company
            localStorage.setItem('activeCompany', JSON.stringify(company))
        },

        hasPermission(permission) {
            // No permission required || Admin || User has permission
            return !permission || this.permissions.includes('*') || this.permissions.includes(permission)
        },

        clearStore() {
            this.user = null
            this.token = null
            this.companies = null
            this.activeCompany = null
            localStorage.removeItem('token')
        },
    },
})
