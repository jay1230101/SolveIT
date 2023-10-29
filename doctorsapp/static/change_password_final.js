function togglePass(){
    const inputButton = document.querySelector('.input-button');
    const toggleButton = document.querySelector(".toggle-password");

    if(inputButton.type=='password'){
        inputButton.type='text';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    }else{
        inputButton.type='password';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    }
}
window.addEventListener('DOMContentLoaded',function(){
    const inputButton = document.querySelector('.input-button');
    inputButton.type='password';
})


function togglePass1(){
    const inputButton = document.querySelector('.input-button1');
    const toggleButton = document.querySelector(".toggle-password1");

    if(inputButton.type=='password'){
        inputButton.type='text';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
    }else{
        inputButton.type='password';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
    }
}
window.addEventListener('DOMContentLoaded',function(){
    const inputButton = document.querySelector('.input-button1');
    inputButton.type='password';
})