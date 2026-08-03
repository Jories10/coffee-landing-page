import {testimonialData} from "./testimonial.js";
import { sliderContent } from "./testimonial-corousel-animation.js";
import { saveTestimonials } from "../../saveToLocalStorage/saveTestimonialData.js";

const testimonialSection = document.getElementById('testimonials');

const shareExperienceBtn = document.getElementById('share-experience-button');
const shareExperienceWrapper = document.querySelector('.share-experience-form-wrap');
const testimonialFormExitBtn = document.getElementById('exit-btn');
const testimonialForm = document.getElementById('testimonial-form');

const authorName = document.getElementById('testimonial-name');
const ratingStar = document.querySelectorAll('.rating');
const testimonialMessage = document.getElementById('testimonial-text');
const testimonialFormSubmit = document.getElementById('testimonial-form');

const testimonials = document.getElementById('client-testimonials');

function showTestimonialForm(){
    if(document.startViewTransition){
        document.startViewTransition(()=>{
            shareExperienceBtn.addEventListener('click',(event)=>{
                event.stopPropagation();
                shareExperienceWrapper.classList.add('show-share-experience-form');
                document.body.style.overflow = "hidden";

            });
            
        })
    }else{
         shareExperienceBtn.addEventListener('click',(event)=>{
            event.stopPropagation();
            shareExperienceWrapper.classList.add('show-share-experience-form');
            document.body.style.overflowY = "hidden";
        });
    }
}

function windowTestimonialExit(){
    window.addEventListener('click',(event)=>{
            if(!testimonialForm.contains(event.target)){
                shareExperienceWrapper.classList.remove("show-share-experience-form");
                document.body.style.overflowY = "auto";
            }
     });
}

function formExitButton(){
    testimonialFormExitBtn.addEventListener('click', (event)=>{
                event.stopPropagation();
                shareExperienceWrapper.classList.remove('show-share-experience-form');
                document.body.style.overflowY = 'auto';
    });
}

function addTestimonial(){
    let starCount = 0;
    ratingStar.forEach((star, index) =>{
        star.addEventListener('change', ()=>{
            if(star.checked){
               for(let i = 0; i <= index; i++){
                    ratingStar[i].checked = true;
               }
            }else{
                for(let i = index ; i < ratingStar.length; i++){
                    ratingStar[i].checked = false;
                }
            }

            starCount = document.querySelectorAll('.rating:checked').length;

        });
    });

    testimonialFormSubmit.addEventListener('submit',(event)=>{
       event.preventDefault();
    
       handleTestimonialFormValidation(event, starCount);
       document.getElementById('testimonial-name').value = "";
       document.getElementById('testimonial-text').value = "";
       document.querySelectorAll('.rating').forEach(star => star.checked = false);
});

}

function handleTestimonialFormValidation(event, ratingCheckedLength){
    event.preventDefault();
    event.stopPropagation();
    const div = document.createElement('div');
    div.className = "testimonial-form-message";
    div.innerHTML = "<span>!</span> "+" Please fill in both your name and testimonial.";
    

        if(authorName.value === "" || testimonialMessage.value === ""){
            document.querySelectorAll('.testimonial-form-message').forEach(message => message.remove());
            testimonialSection.appendChild(div);
            setTimeout(()=>{
                if(div){
                    div.remove();
                }
            },3000);

            return;
        }
        let rating= "★".repeat(ratingCheckedLength);

        testimonialData.push(
            {
                stars: rating, 
                testimonialText: testimonialMessage.value, 
                testimonialAuthor: authorName.value}
            );

        saveTestimonials(testimonialData);

        testimonials.innerHTML = "";
        testimonialData.forEach((testimonial,index) =>{
                            const testimonialName = `testimonial-${testimonial.testimonialAuthor.toLocaleLowerCase().replace(/\s+/g, "-")}`;
                
                            const article = document.createElement('article');
                            article.className = `testimonial-card testimonial-card-${index} slide`;
                            article.setAttribute('aria-labelledby', `testimonial-${testimonial.testimonialAuthor}`);
                            article.innerHTML = `
                                                    <div class="testimonial-stars" aria-label="5 out of 5 stars">
                                                        <span aria-hidden="true">${testimonial.stars}</span>
                                                    </div>
                                                    <p class="testimonial-text">${testimonial.testimonialText}</p>
                                                    <h3 class="testimonial-author" id="${testimonialName}">${testimonial.testimonialAuthor}</h3>
                                        `;
                            testimonials.appendChild(article);
            });
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        sliderContent(testimonialCards);
}


export function shareYourExperience(){
    showTestimonialForm();
    formExitButton();
    windowTestimonialExit();
    addTestimonial();

}

