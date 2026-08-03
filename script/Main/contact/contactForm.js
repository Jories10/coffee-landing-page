const contactForm = document.getElementById("contact-form");
const sendingEmailResult = document.getElementById("result");

export default function sendEmailToOwner(){
    contactForm.addEventListener('submit', (e)=>{
        e.preventDefault();

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        sendingEmailResult.style.display = 'block';
        sendingEmailResult.innerText = "Please wait....";

        fetch('https://api.web3forms.com/submit',{
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response)=>{
            let json = await response.json();
            if(response.status === 200){
                sendingEmailResult.innerText = json.message;  
            }else{
                console.log(response);
                sendingEmailResult.innerText = json.message;
            }
        })
        .catch(error=>{
            console.log(error);
            sendingEmailResult.innerText = "Something went wrong...";
            
        })
        .then(()=>{
            contactForm.reset();
            setTimeout(()=>{
                sendingEmailResult.style.display = 'none';
            },3000);
        });

    })
}