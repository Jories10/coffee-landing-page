const filterBtn = document.querySelectorAll('.filter-button');
const menuCards = document.querySelectorAll('.menu-grid .menu-card');

export default function filterMenu(){
   filterBtn.forEach(filterLabel =>{
        filterLabel.addEventListener('click', (event)=>{
            const filter = event.target.innerText.toLowerCase();

            menuCards.forEach(card=>{
                if(filter === 'all'){
                    card.style.display = 'block';

                }else if(filter.slice(0, 3) === 'hot'){
                    card.style.display= 'block';
                    if(!card.classList.contains('hot')){
                        card.style.display = 'none';
                    }
                }else if(filter.slice(0, 4) === 'cold'){
                    card.style.display= "block";
                    if(!card.classList.contains('cold')){
                        card.style.display = "none";
                    }
                }else if(filter === 'pastries'){
                    card.style.display = 'block';
                    if(!card.classList.contains('pastries')){
                        card.style.display = 'none';
                    }
                }

                
            });
        });
   });
}