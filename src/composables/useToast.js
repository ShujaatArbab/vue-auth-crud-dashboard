import { ref } from "vue"

const showToast = ref(false)
const toastMessage = ref("")
const toastType = ref("success")

export function useToast() {

  const triggerToast = (message, type = "success") => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }

  return {
    showToast,
    toastMessage,
    toastType,
    triggerToast
  }
}