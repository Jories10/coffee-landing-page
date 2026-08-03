export function loadTestimonials(){
    try{
        const raw = localStorage.getItem('testimonialData');
        return raw ? JSON.parse(raw) : null;
    }catch(e){
        console.error('Failed to load testimonials from localStorage', e);
        return null;
    }
}

export function saveTestimonials(data){
    try{
        localStorage.setItem('testimonialData', JSON.stringify(data));
        return true;
    }catch(e){
        console.error('Failed to save testimonials to localStorage', e);
        return false;
    }
}