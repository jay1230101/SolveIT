function togglePassword(){
    const passwordInput = document.querySelector('.password-input');
    const passwordButton = document.querySelector('#toggle-password');
    if(passwordInput.type=='password'){
        passwordInput.type='text';
        passwordButton.classList.remove('fa-eye');
        passwordButton.classList.add('fa-eye-slash');
    }else{
        passwordInput.type='password';
        passwordButton.classList.remove('fa-eye-slash');
        passwordButton.classList.add('fa-eye')
    }
}
// hide and put the type as password
window.addEventListener('DOMContentLoaded',function(){
    const passwordInput = document.querySelector('.password-input');
    passwordInput.type='password';
})