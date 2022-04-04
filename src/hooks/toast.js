import {ref, onUnmounted} from 'vue';

export const useToast = () => {
    const showToast = ref(false);
    const toastMessage = ref('');
    const toastAlertType = ref('');
    const timeout = ref(null);
    const triggerToast = (message, type='success') => {
      toastMessage.value = message;
      toastAlertType.value = type;
      showToast.value = true;
      timeout.value = setTimeout(() => {
        console.log('hello');
        toastMessage.value = '';
        toastAlertType.value = '';
        showToast.value = false;
      },1000)
    }

    onUnmounted(()=>{
        console.log('unmout');
    })

    return {
        toastMessage,
        toastAlertType,
        showToast,
        triggerToast
    }
}