import { testimonialsData } from "./testimonial-data.js";
import { shareYourExperience } from "./share-experience-testimonial.js";
import { sliderContent, testimonialPagination } from "./testimonial-corousel-animation.js";
import { loadTestimonials, saveTestimonials } from "../../saveToLocalStorage/saveTestimonialData.js";

const storedTestimonials = loadTestimonials();
export const testimonialData = Array.isArray(storedTestimonials) && storedTestimonials.length ? storedTestimonials : [...testimonialsData];
const testimonials = document.getElementById('client-testimonials');


export  function clientTestimonial(){
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
     shareYourExperience();
}

