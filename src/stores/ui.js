import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUiStore = defineStore('ui', () => {
    // Estado reactivo de la modal de error
    const errorModal = reactive({ show: false, title: '', message: '' })
    const actionModal = reactive({
        show: false,
        type: 'delete',
        title: '',
        message: '',
        loading: false,
        confirm: () => {},
    })
    const toast = reactive({ show: false, type: '', message: '', duration: 3000 })

    // ERROR MODAL
    function showError({ message, title = 'Error' }) {
        errorModal.show = true
        errorModal.title = title
        errorModal.message = message
    }

    // ACTION MODAL
    function _showActionModal({ message, title, confirm, type }) {
        actionModal.show = true
        actionModal.title = title
        actionModal.message = message
        actionModal.type = type
        actionModal.confirm = async () => {
            actionModal.loading = true
            try {
                await confirm()
            } catch (err) {
                console.error('Error en confirmación:', err)
            } finally {
                actionModal.loading = false
                actionModal.show = false
            }
        }
    }

    function showInfo({ message, title = 'Información', confirm }) {
        _showActionModal({ message, title, confirm, type: 'info' })
    }
    function showApprove({ message, title = 'Confirmar', confirm }) {
        _showActionModal({ message, title, confirm, type: 'approve' })
    }
    function showWarning({ message, title = 'Advertencia', confirm }) {
        _showActionModal({ message, title, confirm, type: 'warning' })
    }
    function showDelete({ message, title = 'Eliminar', confirm }) {
        _showActionModal({ message, title, confirm, type: 'delete' })
    }

    // TOAST
    function showToast({ type, message, duration = 3000 }) {
        toast.show = true
        toast.type = type
        toast.message = message
        toast.duration = duration
    }

    return { errorModal, actionModal, toast, showError, showInfo, showApprove, showWarning, showDelete, showToast }
})
