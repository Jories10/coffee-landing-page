export const testimonialPagination = document.querySelector('.testimonial-pagination');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = 0;
let slideInterval;

function showSlide(index, testimonialCard, paginationBullet){
        testimonialCard.forEach((slide, i) => {
    
                slide.classList.toggle("active", i === index);
                
                if(paginationBullet[i]){
                    paginationBullet[i].classList.toggle("active", i === index);
                }
                
        });
        currentIndex = index;
}

function nextSlide(testimonialCard,paginationBullet){
        const newIndex = (currentIndex + 1) % testimonialCard.length;
        showSlide(newIndex,testimonialCard,paginationBullet);
}

function prevSlide(testimonialCard,paginationBullet){
        const newIndex = (currentIndex - 1 + testimonialCard.length) % testimonialCard.length;
        showSlide(newIndex,testimonialCard,paginationBullet);
}

function startAutoSlide(testimonialCard, paginationBullet){
    slideInterval = setInterval(()=>nextSlide(testimonialCard, paginationBullet), 3000);
}

function resetAutoSlide(testimonialCard,paginationBullet){
    clearInterval(slideInterval);
    startAutoSlide(testimonialCard, paginationBullet);
}


export function sliderContent(testimonialCard){
      if (!testimonialCard || testimonialCard.length === 0) return;

      clearInterval(slideInterval);
      currentIndex = 0;
      testimonialPagination.innerHTML = "";

      testimonialCard.forEach(() =>{
            const bullet = document.createElement('span');
            bullet.className = "bullet";
            testimonialPagination.appendChild(bullet);
      });

      const paginationBullet = document.querySelectorAll('.bullet');

       paginationBullet.forEach((dot, i)=>{
            dot.addEventListener('click', ()=>{
                showSlide(i, testimonialCard,paginationBullet);
                resetAutoSlide(testimonialCard,paginationBullet);
            });
       });

       prevBtn.onclick = ()=>{
            prevSlide(testimonialCard,paginationBullet);
            resetAutoSlide(testimonialCard,paginationBullet);
       };

       nextBtn.onclick = ()=>{
            nextSlide(testimonialCard,paginationBullet);
            resetAutoSlide(testimonialCard,paginationBullet);
       };

       showSlide(0,testimonialCard,paginationBullet);
       startAutoSlide(testimonialCard,paginationBullet);
}
