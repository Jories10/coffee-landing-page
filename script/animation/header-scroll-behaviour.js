
export const mobileResponsiveNav = document.getElementById('mobile-responsive-nav');

export default function scrollBehaviour(){
    const siteHeader = document.getElementById('site-header');
    window.addEventListener('scroll', (event)=>{
  
            if(window.scrollY > 100){      
                if(!siteHeader.classList.contains('smooth-changing-background')){
                    siteHeader.classList.add("smooth-changing-background");
                    siteHeader.style.animationName = "smoothChangingBg";
                }
                if(siteHeader.classList.contains("smooth-removing-background")){
                    siteHeader.classList.remove("smooth-removing-background");
                }         
            }else{  
                if(siteHeader.classList.contains("smooth-changing-background")){
                    siteHeader.classList.remove("smooth-changing-background");
                }
                if(!siteHeader.classList.contains("smooth-removing-background")){
                    siteHeader.classList.add("smooth-removing-background");
                    siteHeader.style.animationName = "smoothRemovingBg"; 
                } 
                
            }
            changeTopPosition();
    });
}

function changeTopPosition(){
    if(window.scrollY < 10 || window.scrollY === 0){
            mobileResponsiveNav.classList.add('change-mobile-nav-Top-Position');
    }else{
            mobileResponsiveNav.classList.remove('change-mobile-nav-Top-Position');  
    }
}