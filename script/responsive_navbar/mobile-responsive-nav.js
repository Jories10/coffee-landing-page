
const inputChecked = document.getElementById('responsive-nav');
const labelChecked = document.querySelector('.remove-responsive-nav');

export function changeHamburgerIcon(){
    inputChecked.addEventListener('click',()=>{
        if(inputChecked.checked){
            setTimeout(()=>{
                labelChecked.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x w-6 h-6"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
            },100)
        }else{
           setTimeout(()=>{
             labelChecked.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-6 h-6"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>';
           },100);
        }
    })
}