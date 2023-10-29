function togglePasswordVisibility(){
    const passwordInput = document.querySelector('.password-input');
    const toggleButton = document.querySelector('#toggle-password')
//in index.html when i am saying form.password meaning the type is password
    if(passwordInput.type=='password'){
        passwordInput.type ='text';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    }else{
        passwordInput.type='password';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    }
}
//initally hide the password input and the put the type as password
window.addEventListener('DOMContentLoaded',function(){
    const passwordInput = document.querySelector('.password-input');
    passwordInput.type='password';
})